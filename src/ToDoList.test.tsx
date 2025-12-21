import { render, screen, fireEvent, within } from "@testing-library/react";
import ToDoList from "./ToDoList";

describe("ToDoList Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders input and add button", () => {
    render(<ToDoList />);
    expect(screen.getByPlaceholderText(/enter a task/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  test("does not add empty or whitespace-only todos", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  test("adds a todo and displays it", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Test Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("prevents adding duplicate todos (case-insensitive, trimmed)", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: " task " },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getAllByText("Task")).toHaveLength(1);
  });

  test("can delete a todo", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Delete Me" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const listItem = screen.getByRole("listitem", { name: /task: delete me/i });
    const deleteButton = within(listItem).getByRole("button", {
      name: /delete task/i,
    });
    fireEvent.click(deleteButton);
    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
  });

  test("can toggle a todo as done/undone", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Toggle Me" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const listItem = screen.getByRole("listitem", { name: /task: toggle me/i });
    const toggleButton = within(listItem).getByRole("button", {
      name: /mark as done/i,
    });
    fireEvent.click(toggleButton);
    expect(screen.getByText("Toggle Me")).toHaveClass("done");
    const toggleButtonAfter = within(listItem).getByRole("button", {
      name: /mark as not done/i,
    });
    fireEvent.click(toggleButtonAfter);
    expect(screen.getByText("Toggle Me")).not.toHaveClass("done");
  });

  test("can move todos up and down", () => {
    render(<ToDoList />);
    // Add two todos
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "First" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Second" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    // Move second up
    const secondItem = screen.getByRole("listitem", { name: /task: second/i });
    const moveUpButton = within(secondItem).getByRole("button", {
      name: /move task up/i,
    });
    fireEvent.click(moveUpButton);
    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).getByText("Second")).toBeInTheDocument();
    expect(within(items[1]).getByText("First")).toBeInTheDocument();
    // Move first (now second) down
    const firstItem = screen.getByRole("listitem", { name: /task: second/i });
    const moveDownButton = within(firstItem).getByRole("button", {
      name: /move task down/i,
    });
    fireEvent.click(moveDownButton);
    const itemsAfter = screen.getAllByRole("listitem");
    expect(within(itemsAfter[0]).getByText("First")).toBeInTheDocument();
    expect(within(itemsAfter[1]).getByText("Second")).toBeInTheDocument();
  });

  test("move up/down does nothing at boundaries", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Only" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const listItem = screen.getByRole("listitem", { name: /task: only/i });
    const moveUpButton = within(listItem).getByRole("button", {
      name: /move task up/i,
    });
    const moveDownButton = within(listItem).getByRole("button", {
      name: /move task down/i,
    });
    fireEvent.click(moveUpButton);
    fireEvent.click(moveDownButton);
    expect(screen.getByText("Only")).toBeInTheDocument();
  });

  test("add todo with Enter key", () => {
    render(<ToDoList />);
    const input = screen.getByPlaceholderText(/enter a task/i);
    fireEvent.change(input, { target: { value: "Enter Task" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Enter Task")).toBeInTheDocument();
  });

  test("loads todos from localStorage on mount", () => {
    const savedTodos = [
      { id: "1", text: "Saved Task 1", done: false },
      { id: "2", text: "Saved Task 2", done: true },
    ];
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    render(<ToDoList />);
    expect(screen.getByText("Saved Task 1")).toBeInTheDocument();
    expect(screen.getByText("Saved Task 2")).toBeInTheDocument();
  });

  test("handles nested JSON string in localStorage", () => {
    const nestedData = {
      todos: JSON.stringify([{ id: "1", text: "Nested Task", done: false }]),
    };
    localStorage.setItem("todos", JSON.stringify(nestedData));
    render(<ToDoList />);
    expect(screen.getByText("Nested Task")).toBeInTheDocument();
  });

  test("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("todos", "invalid json");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<ToDoList />);
    expect(screen.getByPlaceholderText(/enter a task/i)).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load todos from localStorage:",
      expect.any(Error)
    );
    consoleError.mockRestore();
  });

  test("handles non-array data in localStorage", () => {
    localStorage.setItem("todos", JSON.stringify({ invalid: "data" }));
    render(<ToDoList />);
    expect(screen.getByPlaceholderText(/enter a task/i)).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  test("persists todos to localStorage when added", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Persist Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const stored = localStorage.getItem("todos");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].text).toBe("Persist Task");
  });

  test("keyboard shortcuts: 't' toggles todo", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Keyboard Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const listItem = screen.getByRole("listitem");
    fireEvent.keyDown(listItem, { key: "t" });
    expect(screen.getByText("Keyboard Task")).toHaveClass("done");
    fireEvent.keyDown(listItem, { key: "T" });
    expect(screen.getByText("Keyboard Task")).not.toHaveClass("done");
  });

  test("keyboard shortcuts: 'd' deletes todo", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Delete With Key" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const listItem = screen.getByRole("listitem");
    fireEvent.keyDown(listItem, { key: "d" });
    expect(screen.queryByText("Delete With Key")).not.toBeInTheDocument();
  });

  test("keyboard shortcuts: 'D' (uppercase) deletes todo", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Delete With D" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const listItem = screen.getByRole("listitem");
    fireEvent.keyDown(listItem, { key: "D" });
    expect(screen.queryByText("Delete With D")).not.toBeInTheDocument();
  });

  test("keyboard shortcuts: ArrowUp moves todo up", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "First" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Second" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const secondItem = screen.getByRole("listitem", { name: /task: second/i });
    fireEvent.keyDown(secondItem, { key: "ArrowUp" });
    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).getByText("Second")).toBeInTheDocument();
    expect(within(items[1]).getByText("First")).toBeInTheDocument();
  });

  test("keyboard shortcuts: ArrowDown moves todo down", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "First" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Second" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const items = screen.getAllByRole("listitem");
    const firstItem = items[1]; // "First" is now second in the list
    fireEvent.keyDown(firstItem, { key: "ArrowDown" });
    const itemsAfter = screen.getAllByRole("listitem");
    expect(within(itemsAfter[0]).getByText("Second")).toBeInTheDocument();
    expect(within(itemsAfter[1]).getByText("First")).toBeInTheDocument();
  });

  test("handles moving multiple todos in sequence", () => {
    render(<ToDoList />);
    // Add three todos
    ["First", "Second", "Third"].forEach((text) => {
      fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
        target: { value: text },
      });
      fireEvent.click(screen.getByRole("button", { name: /add/i }));
    });

    const items = screen.getAllByRole("listitem");
    // Move "First" (now at index 2) up twice to get to top
    fireEvent.keyDown(items[2], { key: "ArrowUp" });
    const items2 = screen.getAllByRole("listitem");
    fireEvent.keyDown(items2[1], { key: "ArrowUp" });

    const finalItems = screen.getAllByRole("listitem");
    expect(within(finalItems[0]).getByText("First")).toBeInTheDocument();
    expect(within(finalItems[1]).getByText("Third")).toBeInTheDocument();
    expect(within(finalItems[2]).getByText("Second")).toBeInTheDocument();
  });

  test("can edit a todo", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Original Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    
    // Click edit button
    const listItem = screen.getByRole("listitem");
    const editButton = within(listItem).getByRole("button", {
      name: /edit task/i,
    });
    fireEvent.click(editButton);
    
    // Change the text and save
    const input = screen.getByLabelText("Edit task text");
    fireEvent.change(input, { target: { value: "Updated Task" } });
    const saveButton = screen.getByLabelText("Save edit");
    fireEvent.click(saveButton);
    
    expect(screen.getByText("Updated Task")).toBeInTheDocument();
    expect(screen.queryByText("Original Task")).not.toBeInTheDocument();
  });

  test("prevents editing to duplicate todo name", () => {
    render(<ToDoList />);
    // Add two todos
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Task One" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Task Two" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    
    // Try to edit second task to match first task name
    const items = screen.getAllByRole("listitem");
    const editButton = within(items[0]).getByRole("button", {
      name: /edit task/i,
    });
    fireEvent.click(editButton);
    
    const input = screen.getByLabelText("Edit task text");
    fireEvent.change(input, { target: { value: "Task One" } });
    const saveButton = screen.getByLabelText("Save edit");
    fireEvent.click(saveButton);
    
    // Should still have both tasks with original names
    expect(screen.getByText("Task Two")).toBeInTheDocument();
    expect(screen.getAllByText("Task One")).toHaveLength(1);
  });

  test("prevents editing to empty text", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Original Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    
    const listItem = screen.getByRole("listitem");
    const editButton = within(listItem).getByRole("button", {
      name: /edit task/i,
    });
    fireEvent.click(editButton);
    
    const input = screen.getByLabelText("Edit task text");
    fireEvent.change(input, { target: { value: "   " } });
    const saveButton = screen.getByLabelText("Save edit");
    fireEvent.click(saveButton);
    
    // Should still have original text
    expect(screen.getByText("Original Task")).toBeInTheDocument();
  });

  test("persists edited todos to localStorage", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Original Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    
    const listItem = screen.getByRole("listitem");
    const editButton = within(listItem).getByRole("button", {
      name: /edit task/i,
    });
    fireEvent.click(editButton);
    
    const input = screen.getByLabelText("Edit task text");
    fireEvent.change(input, { target: { value: "Updated Task" } });
    const saveButton = screen.getByLabelText("Save edit");
    fireEvent.click(saveButton);
    
    const stored = localStorage.getItem("todos");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].text).toBe("Updated Task");
  });
});

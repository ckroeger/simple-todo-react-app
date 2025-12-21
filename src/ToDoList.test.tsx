import { render, screen, fireEvent, within } from "@testing-library/react";
import ToDoList from "./ToDoList";

describe("ToDoList Component", () => {
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
});

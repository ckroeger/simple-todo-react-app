// @vitest-environment jsdom
/// <reference types="vitest" />
import { render, screen, fireEvent } from "@testing-library/react";
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
    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));
    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
  });

  test("can toggle a todo as done/undone", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Toggle Me" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const toggleButton = screen.getByRole("button", { name: /mark as done/i });
    fireEvent.click(toggleButton);
    expect(screen.getByText("Toggle Me")).toHaveClass("done");
    fireEvent.click(screen.getByRole("button", { name: /mark as not done/i }));
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
    const moveUpButtons = screen.getAllByRole("button", {
      name: /move task up/i,
    });
    fireEvent.click(moveUpButtons[1]);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Second");
    expect(items[1]).toHaveTextContent("First");
    // Move first (now second) down
    const moveDownButtons = screen.getAllByRole("button", {
      name: /move task down/i,
    });
    fireEvent.click(moveDownButtons[0]);
    const itemsAfter = screen.getAllByRole("listitem");
    expect(itemsAfter[0]).toHaveTextContent("First");
    expect(itemsAfter[1]).toHaveTextContent("Second");
  });

  test("move up/down does nothing at boundaries", () => {
    render(<ToDoList />);
    fireEvent.change(screen.getByPlaceholderText(/enter a task/i), {
      target: { value: "Only" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    const moveUpButton = screen.getByRole("button", { name: /move task up/i });
    const moveDownButton = screen.getByRole("button", {
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

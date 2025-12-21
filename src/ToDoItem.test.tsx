import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ToDoItem from "./ToDoItem";

describe("ToDoItem Component", () => {
  const mockTodo = {
    id: "1",
    text: "Test Task",
    done: false,
  };

  const mockHandlers = {
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
    onKeyDown: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders todo item with text", () => {
    render(
      <ToDoItem todo={mockTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("applies 'done' class when todo is completed", () => {
    const doneTodo = { ...mockTodo, done: true };
    render(
      <ToDoItem todo={doneTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    expect(screen.getByText("Test Task")).toHaveClass("done");
  });

  test("calls onToggle when toggle button is clicked", () => {
    render(
      <ToDoItem todo={mockTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    fireEvent.click(screen.getByLabelText("Mark as done"));
    expect(mockHandlers.onToggle).toHaveBeenCalledWith("1");
  });

  test("calls onDelete when delete button is clicked", () => {
    render(
      <ToDoItem todo={mockTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    fireEvent.click(screen.getByLabelText("Delete task"));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith("1");
  });

  test("calls onMoveUp when move up button is clicked", () => {
    render(
      <ToDoItem todo={mockTodo} index={1} totalCount={3} {...mockHandlers} />
    );
    fireEvent.click(screen.getByLabelText("Move task up"));
    expect(mockHandlers.onMoveUp).toHaveBeenCalledWith("1");
  });

  test("calls onMoveDown when move down button is clicked", () => {
    render(
      <ToDoItem todo={mockTodo} index={1} totalCount={3} {...mockHandlers} />
    );
    fireEvent.click(screen.getByLabelText("Move task down"));
    expect(mockHandlers.onMoveDown).toHaveBeenCalledWith("1");
  });

  test("disables move up button when item is first", () => {
    render(
      <ToDoItem todo={mockTodo} index={0} totalCount={3} {...mockHandlers} />
    );
    expect(screen.getByLabelText("Move task up")).toBeDisabled();
  });

  test("disables move down button when item is last", () => {
    render(
      <ToDoItem todo={mockTodo} index={2} totalCount={3} {...mockHandlers} />
    );
    expect(screen.getByLabelText("Move task down")).toBeDisabled();
  });

  test("shows correct aria-label for done vs not done", () => {
    const { rerender } = render(
      <ToDoItem todo={mockTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    expect(screen.getByLabelText("Mark as done")).toBeInTheDocument();

    const doneTodo = { ...mockTodo, done: true };
    rerender(
      <ToDoItem todo={doneTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    expect(screen.getByLabelText("Mark as not done")).toBeInTheDocument();
  });

  test("calls onKeyDown when a key is pressed on list item", () => {
    render(
      <ToDoItem todo={mockTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    const listItem = screen.getByRole("listitem");
    fireEvent.keyDown(listItem, { key: "t" });
    expect(mockHandlers.onKeyDown).toHaveBeenCalled();
  });

  test("list item is focusable with tabIndex", () => {
    render(
      <ToDoItem todo={mockTodo} index={0} totalCount={1} {...mockHandlers} />
    );
    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveAttribute("tabIndex", "0");
  });
});

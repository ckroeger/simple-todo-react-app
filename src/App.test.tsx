import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renders ToDoList component", () => {
    render(<App />);
    expect(screen.getByText("📋 Todo List ☑️")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter a task/i)).toBeInTheDocument();
  });
});

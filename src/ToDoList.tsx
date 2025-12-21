import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ToDo {
  id: string;
  text: string;
  done: boolean;
}

const ToDoList = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [text, setText] = useState<string>("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function addAToDo() {
    const trimmedText = text.trim();
    if (trimmedText === "") return;
    // Prevent adding duplicate tasks (case-insensitive, trimmed)
    const isDuplicate = todos.some(
      (todo) => todo.text.trim().toLowerCase() === trimmedText.toLowerCase()
    );
    if (isDuplicate) return;
    const newToDo = {
      id: uuidv4(),
      text: trimmedText,
      done: false,
    };
    setTodos([...todos, newToDo]);
    setText("");
  }

  function deleteAToDo(id: string) {
    const filteredToDos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredToDos);
  }

  function moveToDoUp(id: string) {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === 0) return;
    const newToDos = [...todos];
    const temp = newToDos[index];
    newToDos[index] = newToDos[index - 1];
    newToDos[index - 1] = temp;
    setTodos(newToDos);
  }

  function moveToDoDown(id: string) {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === todos.length - 1) return;
    const newToDos = [...todos];
    const temp = newToDos[index];
    newToDos[index] = newToDos[index + 1];
    newToDos[index + 1] = temp;
    setTodos(newToDos);
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    //console.log(e.key);
    if (e.key === "Enter") {
      addAToDo();
    }
  }

  function toggleAToDo(id: string): void {
    const newToDos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          done: !todo.done,
        };
      }
      return todo;
    });
    setTodos(newToDos);
  }

  return (
    <>
      <div className="to-do-list">
        <h1>📋 Todo List ☑️</h1>
        <label htmlFor="todo-input">Add a new task:</label>
        <input
          id="todo-input"
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleEnterKey}
          placeholder="Enter a task..."
        />
        <button className="add-button" onClick={addAToDo} aria-label="Add task">
          ➕ Add
        </button>
      </div>
      <ol>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span className={`text ${todo.done ? "done" : ""}`}>
              {todo.text}
            </span>
            <button
              className="toggle-button"
              onClick={() => toggleAToDo(todo.id)}
              title="toggle done state"
              aria-label={todo.done ? "Mark as not done" : "Mark as done"}
            >
              ☑️
            </button>
            <button
              className="delete-button"
              onClick={() => deleteAToDo(todo.id)}
              title="delete"
              aria-label="Delete task"
            >
              🗑
            </button>
            <button
              className="move-button"
              onClick={() => moveToDoUp(todo.id)}
              title="move up"
              aria-label="Move task up"
            >
              👆
            </button>
            <button
              className="move-button"
              onClick={() => moveToDoDown(todo.id)}
              title=" move down"
              aria-label="Move task down"
            >
              👇
            </button>
          </li>
        ))}
      </ol>
    </>
  );
};

export default ToDoList;

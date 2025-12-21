import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ToDoItem from "./ToDoItem";

interface ToDo {
  id: string;
  text: string;
  done: boolean;
}

const LOCAL_STORAGE_KEY = "todos";

const ToDoList = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [text, setText] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        let parsed = JSON.parse(stored);
        // If parsed is an object with a 'todos' property that's a string, parse that string
        if (
          parsed &&
          typeof parsed === "object" &&
          "todos" in parsed &&
          typeof parsed.todos === "string"
        ) {
          parsed = JSON.parse(parsed.todos);
        }
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      } catch (error) {
        console.error("Failed to load todos from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist todos to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

  const addAToDo = useCallback(() => {
    const trimmedText = text.trim();
    if (trimmedText === "") return;
    // Prevent adding duplicate tasks (case-insensitive, trimmed)
    const isDuplicate = todos.some(
      (todo) => todo.text.trim().toLowerCase() === trimmedText.toLowerCase()
    );
    if (isDuplicate) return;
    const newToDo: ToDo = {
      id: uuidv4(),
      text: trimmedText,
      done: false,
    };
    setTodos([newToDo, ...todos]);
    setText("");
  }, [text, todos]);

  const deleteAToDo = useCallback(
    (id: string) => {
      const filteredToDos = todos.filter((todo) => todo.id !== id);
      setTodos(filteredToDos);
    },
    [todos]
  );

  const editAToDo = useCallback(
    (id: string, newText: string) => {
      const trimmedText = newText.trim();
      if (trimmedText === "") return;
      
      // Check if new text is duplicate with another todo (excluding current one)
      const isDuplicate = todos.some(
        (todo) => todo.id !== id && todo.text.trim().toLowerCase() === trimmedText.toLowerCase()
      );
      if (isDuplicate) return;

      const newToDos = todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            text: trimmedText,
          };
        }
        return todo;
      });
      setTodos(newToDos);
    },
    [todos]
  );

  const moveToDoUp = useCallback(
    (id: string) => {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index === 0) return;
      const newToDos = [...todos];
      const temp = newToDos[index];
      newToDos[index] = newToDos[index - 1];
      newToDos[index - 1] = temp;
      setTodos(newToDos);
    },
    [todos]
  );

  const moveToDoDown = useCallback(
    (id: string) => {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index === todos.length - 1) return;
      const newToDos = [...todos];
      const temp = newToDos[index];
      newToDos[index] = newToDos[index + 1];
      newToDos[index + 1] = temp;
      setTodos(newToDos);
    },
    [todos]
  );

  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      //console.log(e.key);
      if (e.key === "Enter") {
        addAToDo();
      }
    },
    [addAToDo]
  );

  const toggleAToDo = useCallback(
    (id: string): void => {
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
    },
    [todos]
  );

  const handleTaskKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>, id: string) => {
      if (e.key === "t" || e.key === "T") {
        toggleAToDo(id);
        e.preventDefault();
      } else if (e.key === "d" || e.key === "D") {
        deleteAToDo(id);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        moveToDoUp(id);
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        moveToDoDown(id);
        e.preventDefault();
      }
    },
    [toggleAToDo, deleteAToDo, moveToDoUp, moveToDoDown]
  );

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
        {todos.map((todo, index) => (
          <ToDoItem
            key={todo.id}
            todo={todo}
            index={index}
            totalCount={todos.length}
            onToggle={toggleAToDo}
            onDelete={deleteAToDo}
            onEdit={editAToDo}
            onMoveUp={moveToDoUp}
            onMoveDown={moveToDoDown}
            onKeyDown={handleTaskKeyDown}
          />
        ))}
      </ol>
    </>
  );
};

export default ToDoList;

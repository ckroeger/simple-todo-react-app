import React from "react";

interface ToDo {
  id: string;
  text: string;
  done: boolean;
}

interface ToDoItemProps {
  todo: ToDo;
  index: number;
  totalCount: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>, id: string) => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({
  todo,
  index,
  totalCount,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onKeyDown,
}) => {
  return (
    <li
      tabIndex={0}
      onKeyDown={(e) => onKeyDown(e, todo.id)}
      aria-label={`Task: ${todo.text}`}
    >
      <span className={`text ${todo.done ? "done" : ""}`}>{todo.text}</span>
      <button
        className="toggle-button"
        onClick={() => onToggle(todo.id)}
        title="toggle done state"
        aria-label={todo.done ? "Mark as not done" : "Mark as done"}
      >
        ☑️
      </button>
      <button
        className="delete-button"
        onClick={() => onDelete(todo.id)}
        title="delete"
        aria-label="Delete task"
      >
        🗑
      </button>
      <button
        className="move-button"
        onClick={() => onMoveUp(todo.id)}
        title="move up"
        aria-label="Move task up"
        disabled={index === 0}
      >
        👆
      </button>
      <button
        className="move-button"
        onClick={() => onMoveDown(todo.id)}
        title=" move down"
        aria-label="Move task down"
        disabled={index === totalCount - 1}
      >
        👇
      </button>
    </li>
  );
};

export default ToDoItem;

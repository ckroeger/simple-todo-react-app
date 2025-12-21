import React, { useState, useRef, useEffect } from "react";

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
  onEdit: (id: string, newText: string) => void;
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
  onEdit,
  onKeyDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText === "") {
      // Don't save empty text
      setIsEditing(false);
      setEditText(todo.text);
      return;
    }
    if (trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
      e.preventDefault();
    } else if (e.key === "Escape") {
      handleCancelEdit();
      e.preventDefault();
    }
  };

  return (
    <li
      tabIndex={0}
      onKeyDown={(e) => !isEditing && onKeyDown(e, todo.id)}
      aria-label={`Task: ${todo.text}`}
    >
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            aria-label="Edit task text"
          />
          <button
            className="add-button"
            onClick={handleSaveEdit}
            title="save edit"
            aria-label="Save edit"
          >
            ✅
          </button>
          <button
            className="delete-button"
            onClick={handleCancelEdit}
            title="cancel edit"
            aria-label="Cancel edit"
          >
            ❌
          </button>
        </>
      ) : (
        <>
          <span className={`text ${todo.done ? "done" : ""}`}>{todo.text}</span>
          <button
            className="move-button"
            onClick={handleEditClick}
            title="edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
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
        </>
      )}
    </li>
  );
};

export default ToDoItem;

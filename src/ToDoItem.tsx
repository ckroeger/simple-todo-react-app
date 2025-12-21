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
  const listItemRef = useRef<HTMLLIElement>(null);

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
      listItemRef.current?.focus();
      return;
    }
    if (trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    }
    setIsEditing(false);
    listItemRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
    listItemRef.current?.focus();
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
      ref={listItemRef}
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
            title="save edit (Enter)"
            aria-label="Save edit"
          >
            ✅
          </button>
          <button
            className="delete-button"
            onClick={handleCancelEdit}
            title="cancel edit (Esc)"
            aria-label="Cancel edit"
          >
            ❌
          </button>
        </>
      ) : (
        <>
          <span onDoubleClick={handleEditClick} className={`text ${todo.done ? "done" : ""}`}>{todo.text}</span>
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
            title="toggle done state (T)"
            aria-label={todo.done ? "Mark as not done" : "Mark as done"}
          >
            ☑️
          </button>
          <button
            className="delete-button"
            onClick={() => onDelete(todo.id)}
            title="delete (D)"
            aria-label="Delete task"
          >
            🗑
          </button>
          <button
            className="move-button"
            onClick={() => onMoveUp(todo.id)}
            title="move up (ArrowUp)"
            aria-label="Move task up"
            disabled={index === 0}
          >
            👆
          </button>
          <button
            className="move-button"
            onClick={() => onMoveDown(todo.id)}
            title="move down (ArrowDown)"
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

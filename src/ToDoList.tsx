import React, { useState } from 'react';

interface ToDo {
    id: number;
    text: string;
    done: boolean;
}

const ToDoList = () => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [text, setText] = useState<string>('');

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setText(e.target.value);
    }

    function addAToDo() {
        if(text.trim() === '') return;
        const newToDo = {
            id: todos.length,
            text: text,
            done: false
        };

        setTodos([...todos, newToDo]);
        setText('');
    }

    function deleteAToDo(id: number) {
        const filteredToDos = todos.filter(todo => todo.id !== id);
        setTodos(filteredToDos);
    }

    function moveToDoUp(id: number) {
        const index = todos.findIndex(todo => todo.id === id);
        if (index === 0) return;

        const newToDos = [...todos];
        const temp = newToDos[index];
        newToDos[index] = newToDos[index - 1];
        newToDos[index - 1] = temp;

        setTodos(newToDos);
    }

    function moveToDoDown(id: number) {
        const index = todos.findIndex(todo => todo.id === id);
        if (index === todos.length - 1) return;

        const newToDos = [...todos];
        const temp = newToDos[index];
        newToDos[index] = newToDos[index + 1];
        newToDos[index + 1] = temp;

        setTodos(newToDos);
    }

    function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
        //console.log(e.key);
        if (e.key === 'Enter') {
            addAToDo();
        }
    }

    return (
        <>
            <div className='to-do-list'>
                <h1>📋 Todo List ☑️</h1>
                <input type='text' value={text} onChange={handleInputChange} onKeyDown={handleEnterKey} placeholder='Enter a task...' />
                <button className='add-button' onClick={addAToDo}>➕ Add</button>
            </div>
            <ol>
                {todos.map(todo =>
                    <li key={todo.id}>
                        <span className='text'>{todo.text}</span>
                        <button className='delete-button' onClick={() => deleteAToDo(todo.id)} title='delete'>🗑</button>
                        <button className='move-button' onClick={() => moveToDoUp(todo.id)} title='move up'>👆</button>
                        <button className='move-button' onClick={() => moveToDoDown(todo.id)} title=' move down'>👇</button>
                    </li>
                )}
            </ol>
        </>
    );
};

export default ToDoList;
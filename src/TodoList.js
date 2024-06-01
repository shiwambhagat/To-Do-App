import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() === '') {
      alert("Task input cannot be empty!");
      return;
    }
    
    if (tasks.some(task => task.text.trim().toLowerCase() === taskInput.trim().toLowerCase())) {
      alert("Task already exists!");
      return;
    }

    const newTask = { id: Date.now(), text: taskInput, completed: false };
    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const sortTasks = (tasks) => {
    if (sort === 'asc') return tasks.sort((a, b) => a.text.localeCompare(b.text));
    if (sort === 'desc') return tasks.sort((a, b) => b.text.localeCompare(a.text));
    if (sort === 'creation') return tasks.sort((a, b) => a.id - b.id);
    if (sort === 'completed') return tasks.sort((a, b) => a.completed - b.completed);
    return tasks;
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const sortedTasks = sortTasks(filteredTasks);

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="filters">
        <div>
          <label>Filter:</label>
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
        <div>
          <label>Sort:</label>
          <select value={sort} onChange={handleSortChange}>
            <option value="default">Default</option>
            <option value="asc">Alphabetical (A-Z)</option>
            <option value="desc">Alphabetical (Z-A)</option>
            <option value="creation">Creation Date</option>
            <option value="completed">Completion Status</option>
          </select>
        </div>
      </div>
      <ul>
        {sortedTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
            <span className="task-text">{task.text}</span>
            <div className="task-buttons">
              <button className="remove-btn" onClick={() => removeTask(task.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
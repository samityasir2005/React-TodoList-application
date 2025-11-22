import React, { useState, useEffect } from "react";
import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : {};
  });
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [taskInput, setTaskInput] = useState("");
  const [completedItems, setCompletedItems] = useState(() => {
    const savedCompleted = localStorage.getItem("completedItems");
    return savedCompleted ? JSON.parse(savedCompleted) : {};
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("completedItems", JSON.stringify(completedItems));
  }, [completedItems]);

  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      const newTodos = { ...todos };
      if (!newTodos[selectedDay]) {
        newTodos[selectedDay] = [];
      }
      newTodos[selectedDay].push(taskInput);
      setTodos(newTodos);
      setTaskInput("");
    }
  };

  const handleDeleteTask = (day, taskIndex) => {
    const newTodos = { ...todos };
    newTodos[day].splice(taskIndex, 1);
    if (newTodos[day].length === 0) {
      delete newTodos[day];
    }
    setTodos(newTodos);
    // Clean up completed status
    const key = `${day}-${taskIndex}`;
    const newCompletedItems = { ...completedItems };
    delete newCompletedItems[key];
    setCompletedItems(newCompletedItems);
  };

  const toggleComplete = (day, taskIndex) => {
    const key = `${day}-${taskIndex}`;
    setCompletedItems({
      ...completedItems,
      [key]: !completedItems[key],
    });
  };

  return (
    <div className="todo-container">
      <h1 className="title">Weekly Todo List</h1>

      <div className="day-selector">
        {days.map((day) => (
          <button
            key={day}
            className={`day-button ${selectedDay === day ? "active" : ""}`}
            onClick={() => setSelectedDay(day)}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="task-input-container">
        <input
          type="text"
          className="task-input"
          placeholder={`Add task for ${selectedDay}...`}
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
        />
        <button className="add-button" onClick={handleAddTask}>
          +
        </button>
      </div>

      <div className="tasks-container">
        <h2 className="day-title">{selectedDay}</h2>
        {todos[selectedDay] && todos[selectedDay].length > 0 ? (
          <ul className="task-list">
            {todos[selectedDay].map((task, index) => {
              const itemKey = `${selectedDay}-${index}`;
              const isCompleted = completedItems[itemKey];
              return (
                <li key={index} className="task-item">
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={isCompleted || false}
                    onChange={() => toggleComplete(selectedDay, index)}
                  />
                  <span
                    className={
                      isCompleted ? "task-text completed" : "task-text"
                    }
                  >
                    {task}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTask(selectedDay, index)}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-tasks">No tasks for {selectedDay}</p>
        )}
      </div>
    </div>
  );
};

export default TodoList;

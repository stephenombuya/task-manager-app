import { useState, useEffect, useMemo } from "react";
import "./App.css";

function App() {
  // Load from localStorage safely
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // Persist tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Derived values
  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "completed") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const activeCount = useMemo(
    () => tasks.filter((t) => !t.done).length,
    [tasks]
  );

  // Actions
  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTask = {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>📝 Task Manager</h1>

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
        />
        <button style={styles.addBtn} onClick={addTask}>
          Add
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        {["all", "active", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              ...styles.filterBtn,
              background: filter === type ? "#6366f1" : "#eee",
              color: filter === type ? "white" : "#333",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <ul style={styles.list}>
        {filteredTasks.length === 0 ? (
          <p style={styles.emptyText}>
            {tasks.length === 0
              ? "No tasks yet. Add one above!"
              : "No tasks in this category."}
          </p>
        ) : (
          filteredTasks.map((task) => (
            <li key={task.id} style={styles.listItem}>
              <span
                onClick={() => toggleTask(task.id)}
                style={{
                  ...styles.taskText,
                  textDecoration: task.done ? "line-through" : "none",
                  color: task.done ? "#aaa" : "#333",
                }}
              >
                {task.done ? "✅" : "⬜"} {task.text}
              </span>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteTask(task.id)}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      {tasks.length > 0 && (
        <div style={styles.footer}>
          <span>{activeCount} task(s) left</span>
          <button style={styles.clearBtn} onClick={clearCompleted}>
            Clear Completed
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 12,
    padding: 32,
    width: "100%",
    maxWidth: 500,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
  },
  inputRow: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 15,
    outline: "none",
  },
  addBtn: {
    padding: "10px 18px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
  filterRow: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
  },
  list: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9f9f9",
    padding: "10px 14px",
    borderRadius: 8,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#f87171",
    cursor: "pointer",
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#6366f1",
    cursor: "pointer",
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
  },
};

export default App;

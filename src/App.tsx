import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
} from "./api";

type FilterStatus = "all" | Task["status"];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await createTask({
        title,
        description,
      });

      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Failed to create task");
    }
  }

  async function handleToggleComplete(task: Task) {
    try {
      const completed = !task.completed;
      const status: Task["status"] = completed ? "done" : "todo";

      const updated = await updateTask(task._id, { completed, status });

      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (err) {
      setError("Failed to update task");
    }
  }

  async function handleStatusChange(task: Task, status: Task["status"]) {
    try {
      const completed = status === "done";

      const updated = await updateTask(task._id, { status, completed });

      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (err) {
      setError("Failed to update status");
    }
  }

  async function handleDelete(taskId: string) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
    }
  }

  // ---------- FILTER + GROUPING LOGIC ----------

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ? true : task.status === statusFilter;

    const matchesSearch =
      !normalizedSearch ||
      task.title.toLowerCase().includes(normalizedSearch) ||
      (task.description ?? "").toLowerCase().includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const grouped: Record<Task["status"], Task[]> = {
    todo: [],
    "in-progress": [],
    done: [],
  };

  filteredTasks.forEach((task) => {
    // ensure status is valid, fallback to "todo"
    const status =
      task.status === "todo" ||
      task.status === "in-progress" ||
      task.status === "done"
        ? task.status
        : "todo";

    grouped[status].push(task);
  });

  const columns: { key: Task["status"]; title: string }[] = [
    { key: "todo", title: "Todo" },
    { key: "in-progress", title: "In Progress" },
    { key: "done", title: "Done" },
  ];

  // ---------- RENDER ----------

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "1.5rem",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Task Manager 🧩</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Mini Trello-style board with filters & search.
          </p>
        </div>
      </header>

      {/* New Task Form */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            marginBottom: "0.75rem",
            fontWeight: 600,
          }}
        >
          Add Task
        </h2>
        <form
          onSubmit={handleAddTask}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              minHeight: "60px",
            }}
          />
          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              padding: "0.5rem 1rem",
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
        </form>
      </section>

      {/* Filters */}
      <section
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="statusFilter"
            style={{ fontSize: "0.8rem", color: "#6b7280" }}
          >
            Status Filter
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            style={{
              padding: "0.4rem 0.6rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            htmlFor="search"
            style={{ fontSize: "0.8rem", color: "#6b7280" }}
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.4rem 0.6rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              minWidth: "220px",
            }}
          />
        </div>
      </section>

      {error && (
        <p style={{ color: "red", marginBottom: "0.75rem" }}>{error}</p>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p>No tasks match your filters yet.</p>
      ) : (
        <section
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
            overflowX: "auto",
          }}
        >
          {columns.map((col) => (
            <div
              key={col.key}
              style={{
                flex: "1 1 0",
                minWidth: "260px",
                background: "#f9fafb",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                padding: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{col.title}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.1rem 0.45rem",
                    borderRadius: 999,
                    background: "#e5e7eb",
                    color: "#374151",
                  }}
                >
                  {grouped[col.key].length}
                </span>
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {grouped[col.key].map((task) => (
                  <article
                    key={task._id}
                    style={{
                      padding: "0.5rem 0.6rem",
                      borderRadius: 8,
                      background: "white",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            textDecoration: task.completed
                              ? "line-through"
                              : "none",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                          }}
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#6b7280",
                              marginTop: "0.15rem",
                            }}
                          >
                            {task.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <button
                          onClick={() => handleToggleComplete(task)}
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: 999,
                            border: "1px solid #d1d5db",
                            background: task.completed ? "#10b981" : "white",
                            color: task.completed ? "white" : "#111827",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                          }}
                        >
                          {task.completed ? "Completed" : "Mark done"}
                        </button>

                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(
                              task,
                              e.target.value as Task["status"]
                            )
                          }
                          style={{
                            padding: "0.15rem 0.4rem",
                            borderRadius: 999,
                            border: "1px solid #d1d5db",
                            fontSize: "0.75rem",
                          }}
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDelete(task._id)}
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: 999,
                          border: "1px solid #fecaca",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default App;

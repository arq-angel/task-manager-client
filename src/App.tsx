import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  registerUser,
  loginUser,
  getCurrentuser,
  type User,
} from "./api";

type FilterStatus = "all" | Task["status"];
type AuthMode = "login" | "register";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // ---------- TASKS LOADING ----------

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  // ---------- INIT: TRY LOAD USER + TASKS ----------

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await getCurrentuser();
        setUser(me);
        await loadTasks();
      } catch (err) {
        console.error("Init auth error:", err);
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      }
    }

    init();
  }, []);

  // ---------- AUTH HANDLERS ----------

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await registerUser(authName, authEmail, authPassword);
      localStorage.setItem("token", res.token);
      setUser(res.user);
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
      await loadTasks();
    } catch (err: any) {
      setAuthError(err?.message || "Registration failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await loginUser(authEmail, authPassword);
      localStorage.setItem("token", res.token);
      setUser(res.user);
      setAuthEmail("");
      setAuthPassword("");
      await loadTasks();
    } catch (err: any) {
      setAuthError(err?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setTasks([]);
    setError(null);
  }

  // ---------- TASK HANDLERS ----------

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await createTask({ title, description });
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err?.message || "Failed to create task");
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
    } catch (err: any) {
      setError(err?.message || "Failed to update task");
    }
  }

  async function handleStatusChange(task: Task, status: Task["status"]) {
    try {
      const completed = status === "done";

      const updated = await updateTask(task._id, { status, completed });

      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (err: any) {
      setError(err?.message || "Failed to update status");
    }
  }

  async function handleDelete(taskId: string) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err: any) {
      setError(err?.message || "Failed to delete task");
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

  const columns: { key: Task["status"]; title: string; badgeColor: string }[] =
    [
      { key: "todo", title: "Todo", badgeColor: "bg-slate-200 text-slate-700" },
      {
        key: "in-progress",
        title: "In Progress",
        badgeColor: "bg-amber-200 text-amber-800",
      },
      {
        key: "done",
        title: "Done",
        badgeColor: "bg-emerald-200 text-emerald-800",
      },
    ];

  // ---------- RENDER ----------

  // ---------- AUTH SCREEN ----------

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              Task Manager <span className="inline-block">🔐</span>
            </h1>
            <p className="text-sm text-slate-500">
              Login or create an account to manage your tasks.
            </p>
          </div>

          <div className="flex rounded-full bg-slate-100 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-full transition ${
                authMode === "login"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError(null);
              }}
              className={`flex-1 py-1.5 rounded-full transition ${
                authMode === "register"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Register
            </button>
          </div>

          {authError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {authError}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <form
              onSubmit={authMode === "login" ? handleLogin : handleRegister}
              className="space-y-4"
            >
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-slate-600"
                  >
                    Name (optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-600"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-600"
                >
                  Password (min 6 characters)
                </label>
                <input
                  id="password"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "login"
                  ? "Login"
                  : "Register"}
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-400 text-center">
            Built by Arjun • Full-stack learning project
          </p>
        </div>
      </div>
    );
  }

  // ---------- MAIN APP (AUTHED) ----------
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 flex items-center gap-2">
              Task Manager
              <span className="text-xl">🧩</span>
            </h1>
            <p className="text-sm text-slate-500">
              Mini Trello-style board with auth, filters & search.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">
                {user.name || user.email}
              </p>
              <p className="text-xs text-slate-500">Logged in</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Add Task */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              Add Task
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Press Enter to add
              </span>
            </h2>
          </div>
          <form
            onSubmit={handleAddTask}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-3"
          >
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 min-h-[40px] sm:min-h-0"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition"
            >
              Add
            </button>
          </form>
        </section>

        {/* Filters */}
        <section className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label
              htmlFor="statusFilter"
              className="block text-xs font-medium text-slate-600"
            >
              Status Filter
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            >
              <option value="all">All</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="space-y-1 flex-1 min-w-[220px]">
            <label
              htmlFor="search"
              className="block text-xs font-medium text-slate-600"
            >
              Search
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                🔍
              </span>
              <input
                id="search"
                type="text"
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Board */}
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-block h-3 w-3 rounded-full bg-slate-400 animate-pulse" />
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-sm text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl py-10 flex flex-col items-center gap-2">
            <span className="text-xl">📭</span>
            <p>No tasks match your filters yet.</p>
          </div>
        ) : (
          <section className="flex gap-4 overflow-x-auto board-scroll pb-2">
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex-1 min-w-[260px] bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {col.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${col.badgeColor}`}
                    >
                      {grouped[col.key].length} tasks
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {grouped[col.key].map((task) => (
                    <article
                      key={task._id}
                      className="bg-white border border-slate-200 rounded-xl p-3 text-sm shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex justify-between gap-2">
                        <div>
                          <h4
                            className={`font-medium text-slate-900 ${
                              task.completed
                                ? "line-through text-slate-400"
                                : ""
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="mt-1 text-xs text-slate-500">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-medium transition ${
                              task.completed
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
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
                            className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/70"
                          >
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleDelete(task._id)}
                          className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-100 transition"
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
    </div>
  );
}

export default App;

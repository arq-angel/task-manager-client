const API_URL = import.meta.env.VITE_API_URL;

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  name?: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ---------- AUTH ----------

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to register");
  }

  return res.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to login");
  }

  return res.json();
}

export async function getCurrentuser(): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load user");
  }

  return res.json();
}

// ---------- TASKS ----------

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch tasks");
  }
  return res.json();
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const responseData = await res.json().catch(() => ({}));
    throw new Error(responseData.error || "Failed to create task");
  }
  return res.json();
}

export async function updateTask(
  id: string,
  data: Partial<Task>
): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const responseData = await res.json().catch(() => ({}));
    throw new Error(responseData.error || "Failed to update task");
  }
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const responseData = await res.json().catch(() => ({}));
    throw new Error(responseData.error || "Failed to delete task");
  }
}

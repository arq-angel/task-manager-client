# Task Manager — Client (Vite + React + TypeScript)

This is the **frontend** for the Task Manager full-stack application.  
It supports **JWT authentication**, **per-user tasks**, a **Kanban board layout**, and **search + filtering**.

Built using **Vite + React + TypeScript**, it communicates with the Express backend via a protected REST API.

---

## Features

### Authentication (JWT)

- Register
- Login
- Logout
- Persisted session using localStorage
- Protected UI (only visible when logged in)

### User-Specific Tasks

Each user only sees their own tasks, tied via backend JWT auth.

### Kanban Board

Tasks appear in 3 columns:

- **Todo**
- **In Progress**
- **Done**

Users can update task status directly from the dropdown.

### Task Actions

- Create task
- Edit status (todo → in-progress → done)
- Mark complete
- Delete

### Filters & Search

- Filter by task status
- Search by title or description

---

## Project Structure

```
client/
  src/
    api.ts          # Handles API requests + JWT
    App.tsx         # Main UI: auth, kanban, filters
    main.tsx
  public/
  .env              # Environment variables
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

---

## Environment Variables

Create `.env` in your `/client` folder:

```env
VITE_API_URL="http://localhost:5000/api"
```

When deployed (Netlify/Vercel), replace this URL with your hosted backend.

---

## Installation

```bash
cd client
npm install
```

---

## Start Development Server

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

The backend **must** be running at:

```
http://localhost:5000/api
```

---

## Build for Production

```bash
npm run build
```

Output is generated at:

```
client/dist
```

This folder can be deployed to:

- Netlify
- Vercel
- GitHub Pages
- Or served by the backend

---

## API Endpoints (Used by Frontend)

### Auth

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Create new user      |
| POST   | `/api/auth/login`    | Log in existing user |
| GET    | `/api/auth/me`       | Get logged-in user   |

### Tasks (Protected)

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/tasks`     | Get user’s tasks |
| POST   | `/api/tasks`     | Create a task    |
| PATCH  | `/api/tasks/:id` | Update a task    |
| DELETE | `/api/tasks/:id` | Remove a task    |

All task requests automatically include:

```
Authorization: Bearer <jwt-token>
```

---

## Tech Stack

- **React** + **TypeScript**
- **Vite** (fast dev server + build)
- **Fetch API**
- **JWT authentication**
- **LocalStorage** for token persistence
- **Inline styling** (easy to migrate to Tailwind)

---

## Future Enhancements

- UI redesign using **TailwindCSS** or **Material UI**
- Drag-and-drop Kanban (like Trello)
- Task categories, tags, priorities UI
- Dark mode
- Toast notifications (success/error)
- Profile page

---

## Author

Created by **Arjun** as part of a full-stack learning project.  
Aiming to build production-ready portfolio projects step-by-step.

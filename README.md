# Task Manager — Client (Vite + React + TypeScript)

This is the **frontend** of the Task Manager full-stack application.  
Built with **Vite + React + TypeScript**, it provides a clean, responsive UI that works like a **mini Trello board**, allowing users to:

- Create tasks
- Move tasks across status columns (Todo → In Progress → Done)
- Mark tasks as completed
- Delete tasks
- Filter by status
- Search by title or description

The UI communicates with an Express backend using REST API calls.

---

## Latest Features

### Kanban Board (Todo / In Progress / Done)

All tasks are grouped into three visual columns.  
You can change a task’s status using a dropdown.

### Filters & Search

- Filter by **All**, **Todo**, **In Progress**, or **Done**
- Search tasks by their **title or description**

### Task Controls

- Mark as complete
- Change status
- Delete
- Auto-updating UI

---

## Screenshots (Coming Soon)

Add screenshots later inside:

```
/screenshots/
  board-view.png
  add-task.png
  search-filter.png
```

---

## Project Structure

```
client/
  src/
    api.ts        # API communication with backend
    App.tsx       # Main UI – Kanban board + filters + search
    main.tsx
  public/
  .env            # Environment variables (VITE_API_URL)
```

---

## Environment Variables

Create `.env` in the client root:

```env
VITE_API_URL="http://localhost:5000/api"
```

In production, replace with your deployed backend URL.

---

## Installation

```bash
cd client
npm install
```

---

## Development Server

```bash
npm run dev
```

Runs on:

```
http://localhost:5173
```

Backend must run on:

```
http://localhost:5000/api
```

---

## Build for Production

```bash
npm run build
```

Build output:

```
client/dist
```

Deployable to:

- Netlify
- Vercel
- GitHub Pages
- Or served by your backend

---

## API Endpoints Used

| Method | Endpoint         | Purpose                         |
| ------ | ---------------- | ------------------------------- |
| GET    | `/api/tasks`     | Fetch all tasks                 |
| POST   | `/api/tasks`     | Create task                     |
| PATCH  | `/api/tasks/:id` | Update status, completion, text |
| DELETE | `/api/tasks/:id` | Delete a task                   |

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- Fetch API
- Inline styling (future conversion to Tailwind/Material UI)

---

## Future Enhancements

- User authentication (JWT)
- Tailwind styling upgrade
- Drag-and-drop Kanban
- Task priorities UI
- Dark mode
- Mobile responsive layout

---

## Author

Built by **Arjun** as part of a full-stack web development learning project.

# Task Manager — Client (Vite + React + TypeScript)

This is the frontend of the Task Manager full-stack application.
Built using **Vite**, **React**, and **TypeScript**, it provides a clean UI for creating, listing, updating, and deleting tasks.

---

## Features

- Add new tasks
- Optional task description
- Mark tasks as complete/incomplete
- Delete tasks
- Auto-updating UI
- Connects to Express backend via REST API
- Uses environment variables (`VITE_API_URL`)

---

## Project Structure

```
client/
  src/
    api.ts
    App.tsx
    main.tsx
  public/
  index.html
  .env
```

---

## Environment Variables

Create `.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

When deployed, replace with your production backend URL.

---

## Installation

```bash
cd client
npm install
```

---

## Running the Development Server

```bash
npm run dev
```

Runs on:

```
http://localhost:5173
```

Frontend expects backend running at:

```
http://localhost:5000/api
```

---

## Build for Production

```bash
npm run build
```

Output goes to:

```
client/dist
```

You can deploy this folder to Netlify, Vercel, or serve it from the backend.

---

## API Usage

The UI uses the REST API provided by the server:

- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

These are configured inside `src/api.ts`.

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- Fetch API

---

## To-Do (Future Improvements)

- Add authentication
- Better UI using Tailwind or Material UI
- Add categories, priorities, and due dates
- Add drag-and-drop board (Todo / In-Progress / Done)
- Add offline mode

---

## Author

Created by **Arjun** as part of a full-stack learning project.

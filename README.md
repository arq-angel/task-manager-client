# Task Manager — Client (Vite + React + TypeScript + TailwindCSS)

This is the **frontend** for the Task Manager full-stack application.  
It now includes a **beautiful TailwindCSS UI**, authentication (JWT), user-specific tasks, a Kanban board, filters, and search.

The client communicates with the Express backend over a protected REST API.

---

## Features (Updated)

### Authentication

- Register
- Login
- Logout
- JWT stored in localStorage
- Protected UI that only appears when logged in

### User-Specific Tasks

Each logged-in user only sees their own tasks.

### Kanban Board (Tailwind UI)

Three-column board styled with Tailwind:

- **Todo**
- **In Progress**
- **Done**

### Task Controls

- Add new tasks
- Mark tasks as completed
- Update status (via dropdown)
- Delete tasks
- Styled cards with shadows, rounded corners, responsive layout

### Filters & Search

- Filter by status
- Real-time search by title/description
- Tailwind-styled form controls

### Tailwind UI

The entire UI (auth screen + board + tasks + forms) is now styled using:

- TailwindCSS
- Utility classes
- Custom scrollbar styling
- Responsive layout

---

## Project Structure

```
client/
  src/
    api.ts            # Handles API requests + JWT auth
    App.tsx           # Main UI (Tailwind version)
    main.tsx
    index.css         # Tailwind imports + global styles
  public/
  .env
  index.html
  package.json
  tailwind.config.cjs
  postcss.config.cjs
  tsconfig.json
  vite.config.ts
```

---

## Environment Variables

Create:

```
client/.env
```

Contents:

```env
VITE_API_URL="http://localhost:5000/api"
```

Replace with your real backend API URL when deployed.

---

## Tailwind Installation (Already Applied)

Installed packages:

```bash
npm install -D tailwindcss postcss autoprefixer
```

Tailwind config:

```js
// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

Global styles:

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-100 text-slate-900;
}
```

---

## Installation

```bash
cd client
npm install
```

---

## Development

```bash
npm run dev
```

View the app at:

```
http://localhost:5173
```

Backend must run at:

```
http://localhost:5000/api
```

---

## Build for Production

```bash
npm run build
```

Deploy the `dist/` folder using:

- Netlify
- Vercel
- GitHub Pages
- Or serve through your Node server

---

## API Endpoints Used by the Frontend

### Auth

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Create new user      |
| POST   | `/api/auth/login`    | Log in user          |
| GET    | `/api/auth/me`       | Fetch logged-in user |

### Tasks (Protected)

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/tasks`     | Get user’s tasks |
| POST   | `/api/tasks`     | Create task      |
| PATCH  | `/api/tasks/:id` | Update task      |
| DELETE | `/api/tasks/:id` | Delete task      |

All requests send:

```
Authorization: Bearer <jwt-token>
```

---

## Tech Stack

- **React** + **TypeScript**
- **Vite**
- **TailwindCSS**
- Fetch API
- JWT Authentication
- LocalStorage token persistence

---

## Future Enhancements

- Drag and drop Kanban (Trello-style)
- Tailwind dark mode
- Animations (Framer Motion)
- Toast notifications (react-hot-toast)
- User profile page
- Categories, labels, priorities UI
- Improved mobile responsiveness

---

## Author

Created by **Arjun** as part of a full-stack learning and portfolio-building project.

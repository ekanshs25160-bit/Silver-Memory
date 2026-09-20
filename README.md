# 🧠 Silver Memory — Project Management System

A full-stack collaborative project management system. Teams can organise projects, manage tasks and subtasks, write project notes, and control access via a role-based permission model.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS v4 |
| **Backend** | Node.js, Express 5, ES Modules |
| **Database** | MongoDB via Mongoose |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **Email** | Nodemailer + Mailgen |
| **File Uploads** | Multer |

---

## 🗂️ Project Structure

```
silver_memory_pms/
├── backend/          # REST API server
│   ├── src/
│   │   ├── controllers/  # Route handlers (auth, project, task, note)
│   │   ├── middlewares/  # JWT auth, role verification
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   └── utils/        # ApiError, ApiResponse, asyncHandler, mail
│   └── package.json
└── frontend/         # React web client
    ├── src/
    │   ├── context/      # AuthContext — global auth state
    │   ├── hooks/        # useProjects, useTasks, useNotes, useMembers
    │   ├── lib/          # apiClient — centralised fetch wrapper
    │   ├── routes/       # React Router config + ProtectedRoute
    │   └── screens/      # AuthScreen, Dashboard, ProjectDetail views
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- An SMTP server or service (e.g. Mailtrap, Gmail) for email features

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd silver_memory_pms
```

### 2. Configure the Backend

```bash
cd backend
cp .env.example .env   # or create a new .env file
```

Fill in the required variables in `backend/.env`:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/silver_memory

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173

# Email (Nodemailer)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM_EMAIL=no-reply@silvermemory.app
SMTP_FROM_NAME=Silver Memory
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev      # starts on PORT (default: 8000)
```

### 3. Configure the Frontend

```bash
cd ../frontend
```

Optionally create a `frontend/.env` file if your backend runs on a different port:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev      # starts on http://localhost:5173
```

---

## 🔌 API Reference

All routes are prefixed with `/api/v1`.

### Auth — `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | — | Register a new user |
| POST | `/login` | — | Login, receive `accessToken` + `refreshToken` |
| POST | `/logout` | ✅ | Logout and invalidate refresh token |
| GET | `/current-user` | ✅ | Get the logged-in user's profile |
| POST | `/change-password` | ✅ | Change current password |
| POST | `/refresh-token` | — | Exchange refresh token for a new access token |
| GET | `/verify-email/:token` | — | Verify email address |
| POST | `/forgot-password` | — | Request a password reset email |
| POST | `/reset-password/:token` | — | Reset password via token |
| POST | `/resend-email-verification` | ✅ | Resend email verification link |

### Projects — `/projects`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | Any | List all projects |
| POST | `/` | Any | Create a new project (creator becomes Admin) |
| GET | `/:projectId` | Any | Get project details |
| PUT | `/:projectId` | Admin | Update project name/description |
| DELETE | `/:projectId` | Admin | Delete project |
| GET | `/:projectId/members` | Any | List project members |
| POST | `/:projectId/members` | Admin | Invite a member by email |
| PUT | `/:projectId/members/:userId` | Admin | Change a member's role |
| DELETE | `/:projectId/members/:userId` | Admin | Remove a member |

### Tasks — `/tasks`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| GET | `/:projectId` | Any | List all tasks for a project |
| POST | `/:projectId` | Admin / Project Admin | Create a task |
| GET | `/:projectId/t/:taskId` | Any | Get task details |
| PUT | `/:projectId/t/:taskId` | Admin / Project Admin | Update task (status, assignee, etc.) |
| DELETE | `/:projectId/t/:taskId` | Admin / Project Admin | Delete task |
| POST | `/:projectId/t/:taskId/subtasks` | Admin / Project Admin | Add a subtask |
| PUT | `/:projectId/st/:subTaskId` | Any | Toggle subtask completion |
| DELETE | `/:projectId/st/:subTaskId` | Admin / Project Admin | Delete subtask |

### Notes — `/notes`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| GET | `/:projectId` | Any | List project notes |
| POST | `/:projectId` | Admin | Create a note |
| GET | `/:projectId/n/:noteId` | Any | Get note details |
| PUT | `/:projectId/n/:noteId` | Admin | Update note |
| DELETE | `/:projectId/n/:noteId` | Admin | Delete note |

### Health Check — `/healthCheck`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Returns API status |

---

## 🔐 Role & Permission Matrix

| Action | Admin | Project Admin | Member |
|--------|:-----:|:-------------:|:------:|
| Create project | ✅ | ✅ | ✅ |
| Edit / Delete project | ✅ | ❌ | ❌ |
| Manage members (add / change role / remove) | ✅ | ❌ | ❌ |
| Create / Edit / Delete tasks | ✅ | ✅ | ❌ |
| View tasks | ✅ | ✅ | ✅ |
| Create / Delete subtasks | ✅ | ✅ | ❌ |
| Toggle subtask completion | ✅ | ✅ | ✅ |
| Create / Edit / Delete notes | ✅ | ❌ | ❌ |
| View notes | ✅ | ✅ | ✅ |

---

## 🖥️ Frontend Pages

| Route | Page | Auth Required |
|-------|------|:-------------:|
| `/login` | Login / Register | ❌ |
| `/register` | Login / Register | ❌ |
| `/` | Projects Dashboard | ✅ |
| `/projects/:projectId/tasks` | Task Board | ✅ |
| `/projects/:projectId/notes` | Notes Feed | ✅ |
| `/projects/:projectId/members` | Member Management | ✅ |

---

## 🧩 Key Design Decisions

- **Token Storage:** JWTs are stored in `localStorage`. The API client automatically attaches the `Authorization: Bearer <token>` header on every request and silently refreshes the token on a `401` response before retrying.
- **API Response Shape:** Every backend response is wrapped in `{ statusCode, data, message, success }`. The frontend `apiClient` transparently unwraps `.data` before returning to hooks/context.
- **No global state library:** Auth state is managed via React Context; server state (projects, tasks, notes, members) is managed via custom hooks with local `useState`.

---

## 📜 License

ISC

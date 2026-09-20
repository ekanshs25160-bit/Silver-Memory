# Product Requirements Document (PRD)

##Silver Momory  Backend

### 1. Product Overview

**Product Name:** Silver Momory Backend  
**Version:** 1.0.0  
**Product Type:** Backend API for Project Management System

Silver Momory Backend is a RESTful API service designed to support collaborative project management. The system enables teams to organize projects, manage tasks with subtasks, maintain project notes, and handle user authentication with role-based access control.

### 2. Target Users

- **Project Administrators:** Create and manage projects, assign roles, oversee all project activities
- **Project Admins:** Manage tasks and project content within assigned projects
- **Team Members:** View projects, update task completion status, access project information

### 3. Core Features

#### 3.1 User Authentication & Authorization

- **User Registration:** ✅ Account creation with email verification
- **User Login:** ✅ Secure authentication with JWT tokens
- **Password Management:** Change password, forgot/reset password functionality
- **Email Verification:** Account verification via email tokens
- **Token Management:** ✅ Access token refresh mechanism
- **Role-Based Access Control:** ✅ Three-tier permission system (Admin, Project Admin, Member)

#### 3.2 Project Management

- **Project Creation:** ✅ Create new projects with name and description
- **Project Listing:** ✅ View all projects user has access to with member count
- **Project Details:** ✅ Access individual project information
- **Project Updates:** ✅ Modify project information (Admin only)
- **Project Deletion:** ✅ Remove projects (Admin only)

#### 3.3 Team Member Management

- **Member Addition:** ✅ Invite users to projects via email
- **Member Listing:** ✅ View all project team members
- **Role Management:** ✅ Update member roles within projects (Admin only)
- **Member Removal:** ✅ Remove team members from projects (Admin only)

#### 3.4 Task Management

- **Task Creation:** ✅ Create tasks with title, description, and assignee
- **Task Listing:** ✅ View all tasks within a project
- **Task Details:** ✅ Access individual task information
- **Task Updates:** ✅ Modify task information and status
- **Task Deletion:** ✅ Remove tasks from projects
- **File Attachments:** ✅ Support for multiple file attachments on tasks
- **Task Assignment:** ✅ Assign tasks to specific team members
- **Status Tracking:** ✅ Three-state status system (Todo, In Progress, Done)

#### 3.5 Subtask Management

- **Subtask Creation:** ✅ Add subtasks to existing tasks
- **Subtask Updates:** ✅ Modify subtask details and completion status
- **Subtask Deletion:** ✅ Remove subtasks (Admin/Project Admin only)
- **Member Completion:** ✅ Allow members to mark subtasks as complete

#### 3.6 Project Notes

- **Note Creation:** ✅ Add notes to projects (Admin only)
- **Note Listing:** ✅ View all project notes
- **Note Details:** ✅ Access individual note content
- **Note Updates:** ✅ Modify existing notes (Admin only)
- **Note Deletion:** ✅ Remove notes (Admin only)

#### 3.7 System Health

- **Health Check:** ✅ API endpoint for system status monitoring

### 4. Technical Specifications

#### 4.1 API Endpoints Structure

**Authentication Routes** (`/api/v1/auth/`)

- `POST /register` ✅ - User registration
- `POST /login` ✅ - User authentication
- `POST /logout` ✅ - User logout (secured)
- `GET /current-user` ✅ - Get current user info (secured)
- `POST /change-password` ✅ - Change user password (secured)
- `POST /refresh-token` ✅ - Refresh access token
- `GET /verify-email/:verificationToken` - Email verification
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:resetToken` - Reset forgotten password
- `POST /resend-email-verification` - Resend verification email (secured)

**Project Routes** (`/api/v1/projects/`)

- `GET /` ✅ - List user projects (secured)
- `POST /` ✅ - Create project (secured)
- `GET /:projectId` ✅ - Get project details (secured, role-based)
- `PUT /:projectId` ✅ - Update project (secured, Admin only)
- `DELETE /:projectId` ✅ - Delete project (secured, Admin only)
- `GET /:projectId/members` ✅ - List project members (secured)
- `POST /:projectId/members` ✅ - Add project member (secured, Admin only)
- `PUT /:projectId/members/:userId` ✅ - Update member role (secured, Admin only)
- `DELETE /:projectId/members/:userId` ✅ - Remove member (secured, Admin only)

**Task Routes** (`/api/v1/tasks/`)

- `GET /:projectId` ✅ - List project tasks (secured, role-based)
- `POST /:projectId` ✅ - Create task (secured, Admin/Project Admin)
- `GET /:projectId/t/:taskId` ✅ - Get task details (secured, role-based)
- `PUT /:projectId/t/:taskId` ✅ - Update task (secured, Admin/Project Admin)
- `DELETE /:projectId/t/:taskId` ✅ - Delete task (secured, Admin/Project Admin)
- `POST /:projectId/t/:taskId/subtasks` ✅ - Create subtask (secured, Admin/Project Admin)
- `PUT /:projectId/st/:subTaskId` ✅ - Update subtask (secured, role-based)
- `DELETE /:projectId/st/:subTaskId` ✅ - Delete subtask (secured, Admin/Project Admin)

**Note Routes** (`/api/v1/notes/`)

- `GET /:projectId` ✅ - List project notes (secured, role-based)
- `POST /:projectId` ✅ - Create note (secured, Admin only)
- `GET /:projectId/n/:noteId` ✅ - Get note details (secured, role-based)
- `PUT /:projectId/n/:noteId` ✅ - Update note (secured, Admin only)
- `DELETE /:projectId/n/:noteId` ✅ - Delete note (secured, Admin only)

**Health Check** (`/api/v1/healthcheck/`)

- `GET /` ✅ - System health status

#### 4.2 Permission Matrix

| Feature                       | Admin | Project Admin | Member |
| ----------------------------- | ----- | ------------- | ------ |
| Create Project ✅             | ✓     | ✗             | ✗      |
| Update/Delete Project ✅      | ✓     | ✗             | ✗      |
| Manage Project Members ✅     | ✓     | ✗             | ✗      |
| Create/Update/Delete Tasks ✅ | ✓     | ✓             | ✗      |
| View Tasks ✅                 | ✓     | ✓             | ✓      |
| Update Subtask Status ✅      | ✓     | ✓             | ✓      |
| Create/Delete Subtasks ✅     | ✓     | ✓             | ✗      |
| Create/Update/Delete Notes ✅ | ✓     | ✗             | ✗      |
| View Notes ✅                 | ✓     | ✓             | ✓      |

#### 4.3 Data Models

**User Roles:**

- `admin` ✅ - Full system access
- `project_admin` ✅ - Project-level administrative access
- `member` ✅ - Basic project member access

**Task Status:**

- `todo` ✅ - Task not started
- `in_progress` ✅ - Task currently being worked on
- `done` ✅ - Task completed

### 5. Security Features

- JWT-based authentication with refresh tokens
- Role-based authorization middleware ✅
- Input validation on all endpoints
- Email verification for account security
- Secure password reset functionality
- File upload security with Multer middleware ✅
- CORS configuration for cross-origin requests ✅

### 6. File Management

- Support for multiple file attachments on tasks ✅
- Files stored in public/images directory ✅
- File metadata tracking (URL, MIME type, size) ✅
- Secure file upload handling ✅

### 7. Success Criteria

- Secure user authentication and authorization system
- Complete project lifecycle management ✅
- Hierarchical task and subtask organization ✅
- Role-based access control implementation ✅
- File attachment capability for enhanced collaboration ✅
- Email notification system for user verification and password reset
- Comprehensive API documentation through endpoint structure

-----------------------------------------------------------------------------

# Product Requirements Document (PRD)

## Silver Memory — Frontend

### 1. Product Overview

**Product Name:** Silver Memory (Frontend)
**Version:** 0.1.0
**Product Type:** Web client for the Project Camp Backend API

Silver Memory's frontend is the client application that lets teams organize projects, manage tasks and subtasks, maintain project notes, and manage team membership — all backed by the existing Project Camp REST API (`/api/v1`). The frontend has no business logic of its own beyond UI state; all authorization, data integrity, and permission enforcement live in the backend. The client's job is to reflect that state accurately and never assume a permission the backend hasn't confirmed.

### 2. Target Users

Same three roles as the backend, scoped per project:

- **Admin:** Full control of a project — settings, members, tasks, notes, deletion.
- **Project Admin:** Manages tasks/subtasks within a project; cannot manage members, notes, or project settings.
- **Member:** Read access to tasks/notes; can update subtask completion status only.

### 3. Core Features

#### 3.1 Authentication

- **Register:** ✅ Full name, email, username, password form → `POST /auth/register`
- **Login:** ✅ Email/username + password → `POST /auth/login`
- **Session persistence:** ✅ Keep user logged in across refresh (pending: cookie vs. localStorage token decision)
- **Logout:** ✅ `POST /auth/logout`, clear local session state
- **Current user fetch:** ✅ Hydrate session on load via `GET /auth/current-user`
- **Change password:** ☐ Authenticated settings form → `POST /auth/change-password`
- **Forgot / reset password:** ☐ Request + reset flow → `POST /auth/forgot-password`, `POST /auth/reset-password/:resetToken`
- **Email verification:** ☐ Verify-link landing page + "resend verification" action → `GET /auth/verify-email/:verificationToken`, `POST /auth/resend-email-verification`
- **Token refresh:** ✅ Silent refresh handling on 401 → `POST /auth/refresh-token`

#### 3.2 Project Management

- **Project dashboard:** ✅ Card grid of all projects the user belongs to, with progress, member avatars, and role badge → `GET /projects`
- **Create project:** ✅ Modal (name, description, visibility, lead, starter template) → `POST /projects` (any authenticated user; becomes Admin of that project)
- **Project detail shell:** ✅ Header with name/status/actions, tab navigation (Tasks/Notes/Members/Settings) → `GET /projects/:projectId`
- **Edit project:** ☐ Settings tab, Admin-only → `PUT /projects/:projectId`
- **Delete project:** ☐ Confirmation flow, Admin-only → `DELETE /projects/:projectId`

#### 3.3 Team Member Management

- **Member list:** ✅ Roster with role badges → `GET /projects/:projectId/members`
- **Invite member:** ✅ Email + role picker, Admin-only → `POST /projects/:projectId/members`
- **Change member role:** ✅ Inline role dropdown, Admin-only → `PUT /projects/:projectId/members/:userId`
- **Remove member:** ☐ Admin-only action → `DELETE /projects/:projectId/members/:userId`

#### 3.4 Task Management

- **Task list/board:** ✅ Grouped by status (Todo/In Progress/Done) → `GET /tasks/:projectId`
- **Create task:** ✅ Title, description, assignee — Admin/Project Admin only → `POST /tasks/:projectId`
- **Task detail:** ☐ Expand for full description, attachments, subtasks → `GET /tasks/:projectId/t/:taskId`
- **Update task:** ✅ Edit fields, change status, reassign — Admin/Project Admin only → `PUT /tasks/:projectId/t/:taskId`
- **Delete task:** ☐ Admin/Project Admin only → `DELETE /tasks/:projectId/t/:taskId`
- **File attachments:** ☐ Upload UI on task detail/create form (multipart) — Admin/Project Admin only
- **Status tracking:** ✅ Todo / In Progress / Done, drag-or-dropdown driven

#### 3.5 Subtask Management

- **Add subtask:** ✅ Inline "+ Add subtask" row under a task, Admin/Project Admin only → `POST /tasks/:projectId/t/:taskId/subtasks`
- **Toggle completion:** ✅ Checkbox, available to all roles including Member → `PUT /tasks/:projectId/st/:subTaskId`
- **Edit subtask details:** ☐ Admin/Project Admin only → `PUT /tasks/:projectId/st/:subTaskId`
- **Delete subtask:** ☐ Admin/Project Admin only → `DELETE /tasks/:projectId/st/:subTaskId`

#### 3.6 Project Notes

- **Notes feed:** ✅ Author, role badge, timestamp, markdown-rendered body → `GET /notes/:projectId`
- **Create note:** ✅ Markdown editor with publish/discard, Admin-only → `POST /notes/:projectId`
- **Note detail:** ☐ "View full doc" expanded view → `GET /notes/:projectId/n/:noteId`
- **Edit note:** ☐ Admin-only → `PUT /notes/:projectId/n/:noteId`
- **Delete note:** ☐ Admin-only → `DELETE /notes/:projectId/n/:noteId`

#### 3.7 System Feedback

- **Connectivity/health indicator:** ☐ Optional status pill using `GET /healthcheck`
- **Global error/loading states:** ✅ Toasts for failed requests, skeleton loaders for in-flight fetches

### 4. Technical Specifications

#### 4.1 Application Routes

| Route | Screen | Auth Required | Role Gate |
|---|---|---|---|
| `/login`, `/register` | Auth screen | No | — |
| `/verify-email/:token` | Email verification landing | No | — |
| `/forgot-password`, `/reset-password/:token` | Password reset flow | No | — |
| `/` (dashboard) | Projects grid | Yes | — |
| `/projects/:projectId/tasks` | Task board | Yes | View: all; Edit: Admin/Project Admin |
| `/projects/:projectId/notes` | Notes feed | Yes | View: all; Edit: Admin |
| `/projects/:projectId/members` | Member management | Yes | View: all; Edit: Admin |
| `/projects/:projectId/settings` | Project settings | Yes | Admin only |

#### 4.2 Frontend Permission Matrix

Mirrors the backend matrix — the frontend must hide/disable actions the backend would reject, but the backend remains the source of truth:

| Action | Admin | Project Admin | Member |
|---|---|---|---|
| Create Project | ✓ | ✓ | ✓ *(creator becomes Admin of it)* |
| Edit/Delete Project | ✓ | ✗ | ✗ |
| Manage Members | ✓ | ✗ | ✗ |
| Create/Edit/Delete Tasks | ✓ | ✓ | ✗ |
| View Tasks | ✓ | ✓ | ✓ |
| Toggle Subtask Status | ✓ | ✓ | ✓ |
| Create/Delete Subtasks | ✓ | ✓ | ✗ |
| Create/Edit/Delete Notes | ✓ | ✗ | ✗ |
| View Notes | ✓ | ✓ | ✓ |

#### 4.3 State & Data Layer

- **API client:** ✅ Single wrapper around fetch/axios, base URL from env, attaches auth token, centralized error handling
- **Auth state:** ✅ Context or store holding `user`, `isAuthenticated`, `login`, `logout`, hydrated on app load
- **Server-state caching:** ☐ Recommend a data-fetching library (e.g. TanStack Query) for `projects`, `tasks`, `notes`, `members` given list+detail+mutate access patterns
- **Optimistic updates:** ✅ Candidate for subtask toggling and note publishing (UI shows a "saved" state per the design)
- **Role-derived UI logic:** ☐ Central helper (e.g. `usePermissions(projectId)`) rather than scattering role checks per component

#### 4.4 Open Decisions

- **Token storage:** backend currently returns tokens in the JSON response body rather than setting httpOnly cookies — frontend needs a decision (localStorage vs. backend change) before auth is finalized.
  - *Update (Frontend Implementation):* We have temporarily elected to use `localStorage` for JWT tokens to unblock development without requiring backend changes right now. 
- **CORS:** confirm backend `cors` config allows the frontend origin and `credentials: true` if cookies are adopted.
- **File attachment UI:** design for task attachments not yet covered in the Stitch screens — needs its own pass.
- **Data Fetching:** We have elected to use native `fetch` with React Context/Hooks rather than TanStack Query for now.

### 5. Design Reference

Visual design sourced from Stitch (Silver Memory project) — auth screen, project dashboard with create-project modal, project detail with task board and sprint metrics panel, and combined notes/members view. Component styling (colors, spacing, badges, pills) should stay consistent with that source rather than introduce new patterns.

### 6. Non-Functional Requirements

- **Responsiveness:** usable down to tablet width at minimum; mobile not yet scoped in the design.
- **Accessibility:** keyboard-navigable forms and modals; role badges and status pills need non-color indicators (text/icon) for colorblind users.
- **Performance:** paginate or virtualize task/note lists if a project's item count grows large.

### 7. Success Criteria

- ✅ User can register, verify email, and log in end-to-end
- ✅ User can create a project and see it reflected on the dashboard
- ☐ Role-appropriate actions are shown/hidden per the permission matrix, and backend rejections are handled gracefully in the UI
- ✅ Task board reflects live status/subtask changes without a full page reload
- ✅ Notes and member management match the Admin-only restrictions from the backend
- ✅ Auth session persists across page refresh
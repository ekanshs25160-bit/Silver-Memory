/**
 * routes/index.jsx - Centralized route configuration.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Import Screens
import AuthScreen from '../screens/AuthScreen';
import ProjectsDashboard from '../screens/ProjectsDashboard';
import ProjectDetailTasks from '../screens/ProjectDetailTasks';
import ProjectDetailNotesMembers from '../screens/ProjectDetailNotesMembers';

import ProjectDetailShell from '../screens/ProjectDetailShell';
import ProjectDetailSettings from '../screens/ProjectDetailSettings';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AuthWrapper = () => {
  const { login, register, isLoading, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleAuthSubmit = async (data) => {
    try {
      if (data.mode === 'login') {
        await login({ email: data.email, password: data.password });
      } else {
        // Register the user
        await register({
          name: data.fullName,
          email: data.email,
          username: data.username,
          password: data.password
        });
        // Auto-login the user immediately after successful registration
        await login({ email: data.email, password: data.password });
      }
    } catch (err) {
      alert(err.message || 'Authentication failed');
    }
  };

  return <AuthScreen onSubmit={handleAuthSubmit} isLoading={isLoading} />;
};

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthWrapper />} />
        <Route path="/register" element={<AuthWrapper />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ProjectsDashboard />} />
          
          {/* Project Detail Routes wrapped in Shell */}
          <Route path="/projects/:projectId" element={<ProjectDetailShell />}>
            <Route path="tasks" element={<ProjectDetailTasks />} />
            <Route path="notes" element={<ProjectDetailNotesMembers />} />
            <Route path="members" element={<ProjectDetailNotesMembers />} />
            <Route path="settings" element={<ProjectDetailSettings />} />
            <Route index element={<Navigate to="tasks" replace />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

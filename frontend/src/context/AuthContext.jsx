/**
 * AuthContext.jsx - Global authentication state provider.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const hydrateSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await apiClient.get('/auth/current-user');
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to hydrate session:', err);
        // Token might be invalid/expired and refresh failed
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const data = await apiClient.post('/auth/login', credentials);
      if (data.accessToken) localStorage.setItem('token', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      setCurrentUser(data.user || data);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const data = await apiClient.post('/auth/register', userData);
      // Auto-login or wait for email verification
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        setCurrentUser(data.user || data);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/logout', {});
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setCurrentUser(null);
      setIsLoading(false);
      window.location.href = '/login';
    }
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    register: registerUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

/**
 * AuthContext.jsx - Global authentication state provider.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsSlowLoading(true);
      }, 5000);
    } else {
      setIsSlowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface p-4 gap-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          {isSlowLoading && (
            <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-body-sm font-medium animate-pulse text-center max-w-sm">
              Backend is a bit slow, but dont worry it will work😉
            </div>
          )}
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

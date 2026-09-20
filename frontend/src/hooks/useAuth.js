/**
 * useAuth.js - Hook for authentication logic.
 * Exposes methods to log in, register, and log out, along with the current user state.
 */
import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { currentUser, isAuthenticated, isLoading, login, register, logout } = useAuthContext();
  return { currentUser, isAuthenticated, isLoading, login, register, logout };
}

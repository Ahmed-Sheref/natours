import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as authApi from '../features/auth/auth.api';
import { getToken, setToken, removeToken } from '../utils/token';
import { onUnauthorized } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearSession = useCallback(() => {
    removeToken();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const logout = useCallback(() => {
    clearSession();
    navigate('/login');
  }, [clearSession, navigate]);

  // Any 401 from the API (expired/invalid token) routes through here so the
  // whole app reacts the same way, not just whichever request happened to fail.
  useEffect(() => {
    onUnauthorized(() => {
      setUser(null);
      queryClient.clear();
      navigate('/login');
    });
  }, [navigate, queryClient]);

  // On startup: if a token is already stored, confirm it's still valid by
  // fetching the current user. Protected routes wait on `initializing` so
  // they never flash before this resolves.
  useEffect(() => {
    let cancelled = false;
    async function init() {
      const token = getToken();
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const currentUser = await authApi.fetchCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) removeToken();
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { token } = await authApi.login({ email, password });
    setToken(token);
    const currentUser = await authApi.fetchCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const signup = useCallback(async (values) => {
    const { token, user: newUser } = await authApi.signup(values);
    setToken(token);
    setUser(newUser);
    return newUser;
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    initializing,
    login,
    signup,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'https://mytrouvepro-production.up.railway.app';
const TOKEN_KEY = 'mytrouvepro_token';
const USER_KEY = 'mytrouvepro_user';

const readStoredUser = () => {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const persistSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const parseResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok || data?.success === false) {
    return {
      success: false,
      error: data?.error || data?.message || 'Request failed',
    };
  }

  return { success: true, data };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = readStoredUser();

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(storedUser);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await parseResponse(response);
      if (!result.success) return result;

      const { token: authToken, user: userData } = result.data || {};
      if (!authToken) {
        return { success: false, error: 'No token returned from server' };
      }

      persistSession(authToken, userData || null);
      setToken(authToken);
      setUser(userData || null);

      return { success: true, user: userData || null };
    } catch (error) {
      return { success: false, error: error?.message || 'Login failed' };
    }
  };

  const register = async (payload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await parseResponse(response);
      if (!result.success) return result;

      const { token: authToken, user: userData } = result.data || {};
      if (!authToken) {
        return { success: false, error: 'No token returned from server' };
      }

      persistSession(authToken, userData || null);
      setToken(authToken);
      setUser(userData || null);

      return { success: true, user: userData || null };
    } catch (error) {
      return { success: false, error: error?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

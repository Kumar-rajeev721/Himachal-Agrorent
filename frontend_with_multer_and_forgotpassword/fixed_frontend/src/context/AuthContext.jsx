import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const AUTH_STORAGE_KEY = 'himachal_agrorent_user';

const normalizeAuthUser = (data) => {
  if (!data) return null;

  const token = data.token || data.accessToken;
  const user = data.user ? { ...data.user, token } : { ...data, token };

  return user.token ? user : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = normalizeAuthUser(JSON.parse(stored));
      if (parsed) {
        setUser(parsed);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    const normalizedUser = normalizeAuthUser(userData);
    if (!normalizedUser) throw new Error('Login response did not include an auth token');

    setUser(normalizedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${normalizedUser.token}`;
    return normalizedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


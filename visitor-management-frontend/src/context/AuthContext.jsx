import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
      // Dummy login for Apps Script integration
      if (email === 'admin@paryatan.org' && password === 'Paryatan@Auth#2026!') {
        localStorage.setItem('token', 'dummy-token');
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials. Please check your email and password.' };
      }

  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

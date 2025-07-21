/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// 1. Erstelle den Context
const AuthContext = createContext();

// 2. Hook für einfachen Zugriff auf den Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Erstelle den Provider - eine Komponente, die den Zustand verwaltet
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token und User aus authService laden beim Start
  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getCurrentUser();
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Login Funktion mit authService
  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      
      if (result.success) {
        setToken(authService.getToken());
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register Funktion mit authService
  const register = async (username, email, password) => {
    try {
      const result = await authService.register(username, email, password);
      
      if (result.success) {
        setToken(authService.getToken());
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout Funktion mit authService
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // Authenticated API Request Helper
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // Im Context bereitstellen:
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    authenticatedFetch,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
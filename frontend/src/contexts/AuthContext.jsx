import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token aus localStorage laden beim Start
  useEffect(() => {
    const savedToken = localStorage.getItem('reelmatch_token');
    const savedUser = localStorage.getItem('reelmatch_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login Funktion
  const login = async (username, password) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Token und User speichern
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('reelmatch_token', data.token);
      localStorage.setItem('reelmatch_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register Funktion
  const register = async (username, email, password) => {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Token und User speichern
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('reelmatch_token', data.token);
      localStorage.setItem('reelmatch_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout Funktion
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('reelmatch_token');
    localStorage.removeItem('reelmatch_user');
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

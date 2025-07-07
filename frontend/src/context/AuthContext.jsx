/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

// 1. Erstelle den Context
const AuthContext = createContext();

// 2. Erstelle den Provider - eine Komponente, die den Zustand verwaltet
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('reelmatch_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Funktion zum "Einloggen" (im MVP nach der Registrierung)
  const login = (userData) => {
    setUser(userData);
    // Optional: User-Daten im localStorage speichern, um Login über Neuladen zu erhalten
    localStorage.setItem('reelmatch_user', JSON.stringify(userData));
  };

  // Funktion zum "Ausloggen"
  const logout = () => {
    setUser(null);
    localStorage.removeItem('reelmatch_user');
  };

  // Im Context bereitstellen:
  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Erstelle einen benutzerdefinierten Hook für einfachen Zugriff
export const useAuth = () => {
  return useContext(AuthContext);
};
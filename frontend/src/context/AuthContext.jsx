import React, { createContext, useState, useContext } from 'react';

// 1. Erstelle den Context
const AuthContext = createContext(null);

// 2. Erstelle den Provider - eine Komponente, die den Zustand verwaltet
export const AuthProvider = ({ children }) => {
  // Wir speichern den User im State. Initial ist niemand eingeloggt (null).
  const [user, setUser] = useState(null);

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

  // Wir geben den User-Zustand und die Login/Logout-Funktionen an alle Kinder weiter
  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Erstelle einen benutzerdefinierten Hook für einfachen Zugriff
export const useAuth = () => {
  return useContext(AuthContext);
};
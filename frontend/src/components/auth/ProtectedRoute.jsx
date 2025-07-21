import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Komponente für geschützte Routen
 * Leitet zur Login-Seite weiter, wenn der Benutzer nicht authentifiziert ist
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Während des Ladens zeigen wir einen Ladeindikator
  if (loading) {
    return (
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="auth-welcome">
            <h2>ReelMatch</h2>
            <p>Loading your experience...</p>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem 0'
          }}>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  // Wenn nicht authentifiziert, zur Login-Seite umleiten
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wenn authentifiziert, die Kinder-Komponenten rendern
  return children;
};

export default ProtectedRoute;

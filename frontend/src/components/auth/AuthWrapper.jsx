import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(location.pathname === '/register');

  useEffect(() => {
    // Aktualisiere den Zustand basierend auf der URL
    setShowRegister(location.pathname === '/register');
  }, [location.pathname]);

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

  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => navigate('/login')} />
    ) : (
      <LoginForm onSwitchToRegister={() => navigate('/register')} />
    );
  }
  
  // Wenn der Benutzer bereits authentifiziert ist und auf login/register zugreift,
  // leite ihn zur Hauptseite weiter
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    navigate('/');
    return null;
  }

  return children;
};

export default AuthWrapper;

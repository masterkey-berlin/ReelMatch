// authService.js - Zentraler Service für Authentifizierungsfunktionen
import apiClient from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class AuthService {
  // Login-Funktion
  async login(username, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('reelmatch_token', response.data.token);
        localStorage.setItem('reelmatch_user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login fehlgeschlagen'
      };
    }
  }

  // Registrierungs-Funktion
  async register(username, email, password) {
    try {
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('reelmatch_token', response.data.token);
        localStorage.setItem('reelmatch_user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registrierung fehlgeschlagen'
      };
    }
  }

  // Logout-Funktion
  logout() {
    localStorage.removeItem('reelmatch_token');
    localStorage.removeItem('reelmatch_user');
  }

  // Aktuellen Benutzer abrufen
  getCurrentUser() {
    const userStr = localStorage.getItem('reelmatch_user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  // Token abrufen
  getToken() {
    return localStorage.getItem('reelmatch_token');
  }

  // Überprüfen, ob der Benutzer eingeloggt ist
  isLoggedIn() {
    return !!this.getToken();
  }
}

export default new AuthService();

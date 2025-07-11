import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await apiClient.post('/auth/register', { username });
      login(response.data); // User direkt einloggen
      setMessage(`Registration successful! Welcome, ${response.data.username}.`);
      navigate('/rooms'); // Nur eine Weiterleitung!
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
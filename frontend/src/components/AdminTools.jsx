import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import './AdminTools.css';

const AdminTools = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser1, setSelectedUser1] = useState('');
  const [selectedUser2, setSelectedUser2] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Versuche Benutzer zu laden...');
        const token = localStorage.getItem('reelmatch_token');
        console.log('Aktuelles Token:', token ? 'Vorhanden' : 'Fehlt');
        
        const response = await apiClient.get('/admin/users');
        console.log('API-Antwort empfangen:', response);
        
        if (response && response.data) {
          console.log('Empfangene Benutzer:', response.data);
          setUsers(response.data);
        } else {
          console.error('Ungültiges Antwortformat:', response);
          setMessage('Ungültiges Antwortformat vom Server');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzer:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        setMessage(`Fehler beim Laden der Benutzer: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const createMatch = async () => {
    console.log('createMatch aufgerufen');
    console.log('selectedUser1:', selectedUser1, 'Type:', typeof selectedUser1);
    console.log('selectedUser2:', selectedUser2, 'Type:', typeof selectedUser2);
    
    if (!selectedUser1 || !selectedUser2) {
      setMessage('Bitte wähle zwei Benutzer aus');
      return;
    }

    if (selectedUser1 === selectedUser2) {
      setMessage('Die Benutzer müssen unterschiedlich sein');
      return;
    }

    const user1Id = parseInt(selectedUser1);
    const user2Id = parseInt(selectedUser2);
    
    console.log('Parsed IDs - user1Id:', user1Id, 'user2Id:', user2Id);
    
    if (isNaN(user1Id) || isNaN(user2Id)) {
      setMessage('Ungültige Benutzer-IDs');
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        user1Id: user1Id,
        user2Id: user2Id
      };
      
      console.log('Sende Match-Request:', requestData);
      
      const response = await apiClient.post('/admin/create-match', requestData);
      
      console.log('Match-Response erhalten:', response);
      
      setMessage(`Match erfolgreich erstellt: ${response.data.message || 'Erfolg'}`);
      
      // Formular zurücksetzen
      setSelectedUser1('');
      setSelectedUser2('');
    } catch (error) {
      console.error('Fehler beim Erstellen des Matches:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Unbekannter Fehler';
      setMessage(`Fehler beim Erstellen des Matches: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-tools">
      <h2>Admin-Tools</h2>
      <div className="admin-section">
        <h3>Match erstellen</h3>
        <div className="match-form">
          <div className="form-group">
            <label>Benutzer 1:</label>
            <select 
              value={selectedUser1} 
              onChange={(e) => setSelectedUser1(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Benutzer auswählen --</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username} (ID: {user.user_id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Benutzer 2:</label>
            <select 
              value={selectedUser2} 
              onChange={(e) => setSelectedUser2(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Benutzer auswählen --</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username} (ID: {user.user_id})
                </option>
              ))}
            </select>
          </div>

          <button 
            className="create-match-btn" 
            onClick={createMatch}
            disabled={loading || !selectedUser1 || !selectedUser2}
          >
            {loading ? 'Wird erstellt...' : 'Match erstellen'}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTools;

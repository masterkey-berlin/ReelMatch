import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './MatchList.css';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log('📋 Fetching matches...');
        const response = await apiClient.get('/matches');
        setMatches(response.data);
        console.log('✅ Matches loaded:', response.data);
      } catch (error) {
        console.error('❌ Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);

  // Funktion zum Schließen eines Match-Cards
  const closeMatch = (matchId) => {
    // Filter das Match aus der Liste
    setMatches(matches.filter(match => match.match_id !== matchId));
  };

  if (loading) {
    return (
      <div className="match-list">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Matches werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matches-container">
      <div className="match-list-header">
        <h2>Deine Matches ({matches.length})</h2>
        <button 
          className="refresh-button" 
          onClick={() => window.location.reload()}
        >
          <span role="img" aria-label="refresh">🔄</span> Aktualisieren
        </button>
      </div>
      
      <div className="matches-list">
        {matches.length === 0 ? (
          <div className="no-matches">
            💔 Noch keine Matches
            <p>Gehe zum Swipen und finde deine ersten Matches!</p>
          </div>
        ) : (
          matches.map(match => (
            <div key={match.match_id} className="match-card">
              {/* Close-Button hinzufügen */}
              <button 
                className="close-match-btn"
                onClick={() => closeMatch(match.match_id)}
              >
                ×
              </button>
              
              <div className="match-avatar">
                {match.partner_username ? match.partner_username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="match-info">
                <h3>{match.partner_username || 'Unbekannt'}</h3>
                <p>Match seit {new Date(match.created_at || Date.now()).toLocaleDateString('de-DE')}</p>
                <button 
                  className="chat-button"
                  onClick={() => navigate(`/chat/${match.partner_id}`)}
                >
                  <span role="img" aria-label="chat">💬</span> Chat starten
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchList;

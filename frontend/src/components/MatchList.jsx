import React, { useState, useEffect } from 'react';
import './MatchList.css';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hook-Problem umgehen - direkt Testdaten setzen
    setTimeout(() => {
      console.log('🧪 Setting test matches...');
      setMatches([{
        match_id: 1,
        partner_id: 1,
        partner_username: "Masterkey",
        partner_video_path: "uploads/introVideo-1751880567232-849988527.mp4",
        created_at: new Date().toISOString()
      }]);
      setLoading(false);
      console.log('✅ Test matches set successfully');
    }, 1000);
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
                <button className="chat-button">
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

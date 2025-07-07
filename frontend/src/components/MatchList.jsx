import React from 'react';
import { useMatches } from '../hooks/useMatches';
import './MatchList.css';

const MatchList = () => {
  const { matches, loading, error, fetchMatches } = useMatches();

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

  if (error) {
    return (
      <div className="match-list">
        <div className="error">
          <p>Fehler beim Laden der Matches: {error}</p>
          <button onClick={fetchMatches} className="retry-btn">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="match-list">
        <div className="no-matches">
          <div className="no-matches-icon">💔</div>
          <h3>Noch keine Matches</h3>
          <p>Gehe zum Swipen und finde deine ersten Matches!</p>
        </div>
      </div>
    );
  }

  const handleStartChat = (match) => {
    // Hier später zur Chat-Funktion weiterleiten
    console.log('Chat mit Match starten:', match);
    // Zum Beispiel: navigate(`/chat/${match.id}`);
  };

  return (
    <div className="match-list">
      <div className="match-list-header">
        <h2>Deine Matches ({matches.length})</h2>
        <button onClick={fetchMatches} className="refresh-btn">
          🔄 Aktualisieren
        </button>
      </div>

      <div className="matches-grid">
        {matches.map((match) => (
          <div key={match.id} className="match-card">
            <div className="match-avatar">
              {match.user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            
            <div className="match-info">
              <h4 className="match-username">
                {match.user?.username || 'Unbekannt'}
              </h4>
              <p className="match-date">
                Match seit {new Date(match.created_at).toLocaleDateString('de-DE')}
              </p>
              {match.user?.bio && (
                <p className="match-bio">{match.user.bio}</p>
              )}
            </div>
            
            <div className="match-actions">
              <button 
                className="chat-btn"
                onClick={() => handleStartChat(match)}
              >
                💬 Chat starten
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchList;

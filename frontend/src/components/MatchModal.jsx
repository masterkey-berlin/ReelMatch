import React from 'react';
import './MatchModal.css';

const MatchModal = ({ match, isOpen, onClose }) => {
  if (!isOpen || !match) return null;

  return (
    <div className="match-modal-overlay" onClick={onClose}>
      <div className="match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="match-celebration">
          <div className="hearts">
            <span className="heart">💖</span>
            <span className="heart">💕</span>
            <span className="heart">💖</span>
          </div>
          
          <h2 className="match-title">It's a Match! 🎉</h2>
          
          <div className="match-users">
            <div className="match-user">
              <div className="user-avatar">
                Du
              </div>
              <span className="user-name">Du</span>
            </div>
            
            <div className="match-connector">
              <div className="heart-connector">❤️</div>
            </div>
            
            <div className="match-user">
              <div className="user-avatar">
                {match.user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">
                {match.user?.username || 'Unbekannt'}
              </span>
            </div>
          </div>
          
          <p className="match-message">
            Ihr habt beide Interesse aneinander gezeigt!
          </p>
          
          <div className="match-actions">
            <button 
              className="btn-secondary"
              onClick={onClose}
            >
              Weiter swipen
            </button>
            <button 
              className="btn-primary"
              onClick={() => {
                // Hier später zur Chat-Funktion weiterleiten
                console.log('Chat mit Match starten:', match);
                onClose();
              }}
            >
              Nachricht senden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;

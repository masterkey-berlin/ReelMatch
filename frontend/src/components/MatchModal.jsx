import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchModal.css';

const MatchModal = ({ match, isOpen, onClose }) => {
  const navigate = useNavigate();
    if (!isOpen || !match) return null;

  // Der Match-Partner wird jetzt als 'matchedUser' übergeben
  const partner = match.matchedUser;

  const handleStartChat = () => {
    if (partner && partner.id) {
      onClose(); // Schließe das Modal
      navigate(`/chat/${partner.id}`); // Leite zum Chat weiter
    } else {
      console.error('Fehler: Match-Partner-ID nicht gefunden.');
      onClose();
    }
  };

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
                {partner?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">
                {partner?.username || 'Unbekannt'}
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
              onClick={handleStartChat}
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

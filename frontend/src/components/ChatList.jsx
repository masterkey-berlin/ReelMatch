import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chatService from '../services/chatService';
import './ChatList.css';

const ChatList = () => {
  const [chatPartners, setChatPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChatPartners = async () => {
      try {
        setLoading(true);
        const data = await chatService.getChatList();
        setChatPartners(data);
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden der Chat-Partner:', err);
        setError('Chat-Partner konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    loadChatPartners();
  }, []);

  const handleChatSelect = (partnerId) => {
    navigate(`/chat/${partnerId}`);
  };

  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Heute
      return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffDays === 1) {
      // Gestern
      return 'Gestern';
    } else if (diffDays < 7) {
      // Wochentag
      return date.toLocaleDateString('de-DE', { weekday: 'long' });
    } else {
      // Datum
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  if (loading) {
    return <div className="chat-list-container loading">Lade Chat-Liste...</div>;
  }

  if (error) {
    return (
      <div className="chat-list-container error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Erneut versuchen</button>
      </div>
    );
  }

  if (chatPartners.length === 0) {
    return (
      <div className="chat-list-container empty">
        <p>Du hast noch keine Chat-Konversationen.</p>
        <p>Matches findest du in deiner Match-Liste!</p>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      <h2 className="chat-list-title">Deine Chats</h2>
      <div className="chat-list">
        {chatPartners.map(partner => (
          <div 
            key={partner.id} 
            className="chat-list-item"
            onClick={() => handleChatSelect(partner.id)}
          >
            <div className="chat-avatar-container">
              <img 
                src={partner.avatar || '/default-avatar.png'} 
                alt={partner.username} 
                className="chat-list-avatar" 
              />
              {partner.unread_count > 0 && (
                <span className="unread-badge">{partner.unread_count}</span>
              )}
            </div>
            <div className="chat-list-content">
              <div className="chat-list-header">
                <h3 className="chat-list-name">{partner.username}</h3>
                <span className="chat-list-time">
                  {formatLastMessageTime(partner.last_message_time)}
                </span>
              </div>
              <div className="chat-list-message">
                {partner.is_last_message_from_me && <span className="sent-indicator">Du: </span>}
                {partner.last_message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

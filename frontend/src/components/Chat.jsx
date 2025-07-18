import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import './Chat.css';

const Chat = () => {
  const { partnerId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Nachrichten nach Datum gruppieren
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at);
      const dateString = date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      
      groups[dateString].push(message);
    });
    
    return groups;
  };
  
  // Konversation laden mit useCallback, um Lint-Fehler zu vermeiden
  const loadConversation = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatService.getConversation(partnerId);
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      setPartner(data.partner);
      setError(null);
    } catch (err) {
      // Nur bei echten Fehlern anzeigen, nicht bei leeren Nachrichten
      if (err?.response && (err.response.status === 403 || err.response.status === 404)) {
        setError('Konversation konnte nicht geladen werden.');
      } else {
        // Bei leeren Nachrichten trotzdem Chat anzeigen
        setMessages([]);
        setPartner({ id: partnerId, username: 'Unbekannt' });
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, [partnerId]);
  
  // Beim ersten Rendern und bei Änderung der Partner-ID Konversation laden
  useEffect(() => {
    if (partnerId) {
      loadConversation();
    }
  }, [partnerId, loadConversation]);
  
  // Scroll zum Ende der Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Nachricht senden
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      // Optimistisches UI-Update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender_id: currentUser.id,
        receiver_id: partnerId,
        content: newMessage,
        created_at: new Date().toISOString(),
        read: false
      };
      
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage('');
      
      // Tatsächliches Senden
      await chatService.sendMessage(partnerId, newMessage);
      
      // Optional: Konversation neu laden, um die tatsächliche Nachricht zu erhalten
      // await loadConversation();
    } catch (err) {
      console.error('Fehler beim Senden der Nachricht:', err);
      setError('Nachricht konnte nicht gesendet werden.');
    }
  };
  
  // Zurück zur Chat-Liste
  const handleBackToList = () => {
    navigate('/chats');
  };
  
  if (loading) {
    return <div className="chat-container loading">Lade Konversation...</div>;
  }
  
  if (error) {
    return (
      <div className="chat-container error">
        <p>{error}</p>
        <button onClick={handleBackToList}>Zurück zur Chat-Liste</button>
      </div>
    );
  }
  
  if (!partner) {
    // Zeige trotzdem das Chat-Fenster, wenn keine Nachrichten existieren
    return (
      <div className="chat-container">
        <div className="chat-header">
          <button className="back-button" onClick={handleBackToList}>
            &larr;
          </button>
          <div className="chat-partner-info">
            <div className="chat-avatar">
              {'U'}
            </div>
            <h2>Unbekannt</h2>
          </div>
        </div>
        <div className="messages-container empty">
          <p>Du hast noch keine Nachrichten ausgetauscht.</p>
        </div>
        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nachricht schreiben..."
            className="message-input"
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!newMessage.trim()}
          >
            Senden
          </button>
        </form>
      </div>
    );
  }
  
  const groupedMessages = groupMessagesByDate(messages);
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={handleBackToList}>
          &larr;
        </button>
        <div className="chat-partner-info">
          <div className="chat-avatar">
            {partner.username.charAt(0).toUpperCase()}
          </div>
          <h2>{partner.username}</h2>
        </div>
      </div>
      
      <div className="messages-container">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="message-date-group">
            <div className="message-date">{date}</div>
            {dateMessages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">{message.content}</div>
                <div className="message-time">
                  {new Date(message.created_at).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht schreiben..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          Senden
        </button>
      </form>
    </div>
  );
};

export default Chat;

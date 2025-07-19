import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import './Chat.css';

const Chat = () => {
  const { partnerId } = useParams();
  const { user: currentUser } = useAuth();
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
      const date = new Date(message.sent_at || message.created_at);
      
      // Prüfe, ob das Datum gültig ist
      const dateString = isNaN(date.getTime()) 
        ? 'Heute' // Fallback für ungültige Daten
        : date.toLocaleDateString('de-DE', {
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
      console.error('Fehler beim Laden der Konversation:', err);
      // Detaillierte Fehlerinformationen anzeigen
      if (err?.response?.data) {
        console.error('Server-Antwort:', err.response.data);
        setError(`Fehler: ${err.response?.data?.message || 'Unbekannter Fehler'}`);
      } else if (err?.response && (err.response.status === 403 || err.response.status === 404)) {
        setError('Konversation konnte nicht geladen werden. Möglicherweise existiert kein Match mit diesem Benutzer.');
      } else {
        // Bei leeren Nachrichten trotzdem Chat anzeigen
        setMessages([]);
        setPartner({ id: partnerId, username: 'Chat-Partner' });
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
  
  // Nachricht löschen
  const handleDeleteMessage = async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      // Konversation neu laden nach dem Löschen
      await loadConversation();
    } catch (error) {
      console.error('Fehler beim Löschen der Nachricht:', error);
      setError('Nachricht konnte nicht gelöscht werden.');
    }
  };

  // Nachricht senden
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const messageToSend = newMessage;
    setNewMessage(''); // Eingabefeld sofort leeren
    
    try {
      console.log('Sende Nachricht:', {
        currentUser: currentUser,
        partnerId: partnerId,
        message: messageToSend
      });
      
      // Nachricht senden
      await chatService.sendMessage(partnerId, messageToSend);
      
      // Konversation neu laden, um die neue Nachricht anzuzeigen
      await loadConversation();
    } catch (err) {
      console.error('Fehler beim Senden der Nachricht:', err);
      // Bei Fehler die Nachricht zurück ins Eingabefeld setzen
      setNewMessage(messageToSend);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Fehler: ${err.response.data.message}`);
      } else {
        setError('Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.');
      }
    }
  };
  
  // Zurück zur Chat-Liste
  const handleBackToList = () => {
    navigate('/chats');
  };
  
  // Debug-Ausgaben (können entfernt werden)
  // console.log('Chat Render - loading:', loading);
  // console.log('Chat Render - error:', error);
  // console.log('Chat Render - partner:', partner);
  // console.log('Chat Render - messages:', messages);
  // console.log('Chat Render - currentUser:', currentUser);
  // console.log('Chat Render - partnerId:', partnerId);

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

  if (!currentUser) {
    return (
      <div className="chat-container loading">
        <p>Lade Benutzerdaten...</p>
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
                key={message.message_id} 
                className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">{message.content}</div>
                <div className="message-footer">
                  <div className="message-time">
                    {(() => {
                      const timestamp = message.sent_at || message.created_at;
                      const date = new Date(timestamp);
                      if (isNaN(date.getTime())) {
                        return 'Jetzt'; // Fallback für ungültige Daten
                      }
                      return date.toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    })()} 
                  </div>
                  {message.sender_id === currentUser.id && (
                    <button 
                      className="delete-message-btn"
                      onClick={() => handleDeleteMessage(message.message_id)}
                      title="Nachricht löschen"
                    >
                      ×
                    </button>
                  )}
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

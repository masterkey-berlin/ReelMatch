import axios from 'axios';

// API-URL aus der Umgebung oder Fallback verwenden
const API_URL = window.env?.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Hilfsfunktion, um den Auth-Header zu erstellen
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Service für Chat-Funktionalitäten
 */
const chatService = {
  /**
   * Sendet eine Nachricht an einen anderen Benutzer
   * @param {number} receiverId - ID des Empfängers
   * @param {string} content - Inhalt der Nachricht
   * @returns {Promise<Object>} Die gesendete Nachricht
   */
  sendMessage: async (receiverId, content) => {
    try {
      const response = await axios.post(
        `${API_URL}/messages/send`,
        { receiverId, content },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      throw error;
    }
  },

  /**
   * Ruft die Konversation mit einem anderen Benutzer ab
   * @param {number} partnerId - ID des Chat-Partners
   * @returns {Promise<Object>} Die Konversation mit Partner-Informationen
   */
  getConversation: async (partnerId) => {
    try {
      const response = await axios.get(
        `${API_URL}/messages/conversation/${partnerId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Fehler beim Abrufen der Konversation:', error);
      throw error;
    }
  },

  /**
   * Ruft die Liste der Chat-Partner ab
   * @returns {Promise<Array>} Liste der Chat-Partner
   */
  getChatList: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/messages/chat-list`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Fehler beim Abrufen der Chat-Liste:', error);
      throw error;
    }
  },

  /**
   * Markiert Nachrichten von einem bestimmten Absender als gelesen
   * @param {number} senderId - ID des Absenders
   * @returns {Promise<Object>} Information über die aktualisierten Nachrichten
   */
  markAsRead: async (senderId) => {
    try {
      const response = await axios.put(
        `${API_URL}/messages/read/${senderId}`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Fehler beim Markieren der Nachrichten als gelesen:', error);
      throw error;
    }
  }
};

export default chatService;

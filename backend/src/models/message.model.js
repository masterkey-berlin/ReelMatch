import db from '../config/db.js';
import * as UserModel from './user.model.js';
import * as MatchModel from './match.model.js';

const MessageModel = {
  /**
   * Erstellt eine neue Nachricht
   * @param {number} senderId - ID des Absenders
   * @param {number} receiverId - ID des Empfängers
   * @param {string} content - Inhalt der Nachricht
   * @returns {Promise<Object>} Die erstellte Nachricht
   */
  async createMessage(senderId, receiverId, content) {
    try {
      // Sicherstellen, dass senderId und receiverId als Integer behandelt werden
      senderId = parseInt(senderId);
      receiverId = parseInt(receiverId);

      console.log('MessageModel.createMessage:', { senderId, receiverId, content });

      // Prüfen, ob ein Match zwischen den Benutzern besteht
      const match = await MatchModel.getMatchBetweenUsers(senderId, receiverId);

      console.log('Match gefunden:', match);

      if (!match) {
        throw new Error('Kein Match zwischen diesen Benutzern');
      }

      const result = await db.query(
        `INSERT INTO messages (match_id, sender_id, content, sent_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING *`,
        [match.match_id, senderId, content]
      );

      console.log('Nachricht erstellt:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Fehler beim Erstellen der Nachricht:', error);
      throw error;
    }
  },

  /**
   * Ruft die Konversation zwischen zwei Benutzern ab
   * @param {number} userId - ID des aktuellen Benutzers
   * @param {number} partnerId - ID des Chat-Partners
   * @returns {Promise<Object>} Die Konversation mit Nachrichten und Partner-Informationen
   */
  async getConversation(userId, partnerId) {
    try {
      // Prüfen, ob ein Match zwischen den Benutzern besteht
      const match = await MatchModel.getMatchBetweenUsers(userId, partnerId);
      if (!match) {
        throw new Error('Kein Match zwischen diesen Benutzern');
      }
      // Nachrichten für dieses Match abrufen
      const messagesResult = await db.query(
        'SELECT * FROM messages WHERE match_id = $1 ORDER BY sent_at ASC',
        [match.match_id]
      );
      // Partner-Informationen abrufen
      const partner = await UserModel.findUserById(partnerId);
      // Wenn keine Nachrichten existieren, trotzdem zurückgeben
      const messages = (messagesResult.rows.length === 0)
        ? []
        : messagesResult.rows.map(msg => ({
            ...msg,
            read: true,
            receiver_id: msg.sender_id === userId ? partnerId : userId
          }));
      return {
        messages,
        partner
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Konversation:', error);
      throw error;
    }
  },

  /**
   * Löscht eine Nachricht (nur vom Sender)
   * @param {number} messageId - ID der zu löschenden Nachricht
   * @param {number} userId - ID des Benutzers, der die Nachricht löschen möchte
   * @returns {Promise<Object>} Information über die gelöschte Nachricht
   */
  async deleteMessage(messageId, userId) {
    try {
      // Prüfen, ob die Nachricht existiert und dem Benutzer gehört
      const checkResult = await db.query(
        'SELECT * FROM messages WHERE message_id = $1 AND sender_id = $2',
        [messageId, userId]
      );
      
      if (checkResult.rows.length === 0) {
        throw new Error('Nachricht nicht gefunden oder keine Berechtigung zum Löschen');
      }
      
      // Nachricht löschen
      const deleteResult = await db.query(
        'DELETE FROM messages WHERE message_id = $1 AND sender_id = $2 RETURNING *',
        [messageId, userId]
      );
      
      return {
        success: true,
        deletedMessage: deleteResult.rows[0]
      };
    } catch (error) {
      console.error('Fehler beim Löschen der Nachricht:', error);
      throw error;
    }
  },

  /**
   * Markiert Nachrichten als gelesen (Dummy-Funktion, da keine read-Spalte vorhanden ist)
   * @param {number} _senderId - ID des Absenders (ungenutzt)
   * @param {number} _receiverId - ID des Empfängers (ungenutzt)
   * @returns {Promise<Object>} Information über die aktualisierten Nachrichten
   */
  async markMessagesAsRead(_senderId, _receiverId) {
    // Da wir keine read-Spalte haben, geben wir einfach ein Dummy-Ergebnis zurück
    return {
      updatedCount: 0,
      updatedMessages: []
    };
  },

  /**
   * Ruft die Anzahl der ungelesenen Nachrichten von einem bestimmten Absender ab
   * (Dummy-Funktion, da keine read-Spalte vorhanden ist)
   * @param {number} _senderId - ID des Absenders (ungenutzt)
   * @param {number} _receiverId - ID des Empfängers (ungenutzt)
   * @returns {Promise<number>} Anzahl der ungelesenen Nachrichten
   */
  async getUnreadCount(_senderId, _receiverId) {
    return 0;
  },

  /**
   * Ruft die Liste der Chat-Partner mit letzter Nachricht ab
   * @param {number} userId - ID des aktuellen Benutzers
   * @returns {Promise<Array>} Liste der Chat-Partner
   */
  async getChatPartners(userId) {
    try {
      // Zuerst holen wir alle Matches des Benutzers
      const matchesResult = await db.query(
        'SELECT * FROM matches WHERE user1_id = $1 OR user2_id = $1',
        [userId]
      );

      const chatPartners = [];

      // Für jedes Match holen wir die letzte Nachricht und den Partner
      for (const match of matchesResult.rows) {
        const partnerId = match.user1_id === userId ? match.user2_id : match.user1_id;

        // Partner-Informationen abrufen
        const partner = await UserModel.findUserById(partnerId);
        if (!partner) continue;

        // Letzte Nachricht für dieses Match abrufen
        const lastMessageResult = await db.query(
          'SELECT * FROM messages WHERE match_id = $1 ORDER BY sent_at DESC LIMIT 1',
          [match.match_id]
        );

        // Wenn es keine Nachrichten gibt, trotzdem Partner anzeigen (Dummy-Eintrag)
        if (lastMessageResult.rows.length === 0) {
          chatPartners.push({
            id: partner.id,
            username: partner.username,
            avatar: partner.avatar,
            last_message: '',
            last_message_time: null,
            is_last_message_from_me: false,
            unread_count: 0,
            is_new_match: true
          });
          continue;
        }

        const lastMessage = lastMessageResult.rows[0];

        chatPartners.push({
          id: partner.id,
          username: partner.username,
          avatar: partner.avatar,
          last_message: lastMessage.content,
          last_message_time: lastMessage.sent_at,
          is_last_message_from_me: lastMessage.sender_id === userId,
          unread_count: 0 // Da wir keine read-Spalte haben, setzen wir immer 0
        });
      }

      // Nach Zeitpunkt der letzten Nachricht sortieren
      return chatPartners.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
    } catch (error) {
      console.error('Fehler beim Abrufen der Chat-Partner:', error);
      throw error;
    }
  }
};

export default MessageModel;

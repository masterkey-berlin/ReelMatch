import MessageModel from '../models/message.model.js';
import MatchModel from '../models/match.model.js';

/**
 * Sendet eine Nachricht an einen anderen Benutzer
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    console.log('Backend empfängt Nachricht:', { senderId, receiverId, content });

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Empfänger-ID und Nachrichteninhalt sind erforderlich'
      });
    }

    // Prüfen, ob ein Match zwischen den Benutzern besteht
    const matchExists = await MatchModel.checkMatchExists(senderId, parseInt(receiverId));

    // Nur Nachrichten zwischen Benutzern mit Match erlauben
    if (!matchExists) {
      console.log(`Kein Match gefunden zwischen Benutzer ${senderId} und ${receiverId}`);
      return res.status(403).json({
        success: false,
        message: 'Du kannst nur Nachrichten an Benutzer senden, mit denen du ein Match hast'
      });
    }

    const message = await MessageModel.createMessage(senderId, receiverId, content);
    return res.status(201).json({
      success: true,
      message: 'Nachricht erfolgreich gesendet',
      data: message
    });
  } catch (error) {
    console.error('Fehler beim Senden der Nachricht:', error);
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler beim Senden der Nachricht'
    });
  }
};

/**
 * Ruft die Konversation mit einem anderen Benutzer ab
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: 'Partner-ID ist erforderlich'
      });
    }

    // Prüfen, ob ein Match zwischen den Benutzern besteht
    const matchExists = await MatchModel.checkMatchExists(userId, partnerId);
    if (!matchExists) {
      return res.status(403).json({
        success: false,
        message: 'Du kannst nur Konversationen mit Benutzern sehen, mit denen du ein Match hast'
      });
    }

    // getConversation liefert bereits Nachrichten und Partner-Informationen
    const conversation = await MessageModel.getConversation(userId, partnerId);
    const { messages, partner } = conversation;

    // Nachrichten als gelesen markieren (Dummy-Funktion, da keine read-Spalte vorhanden ist)
    await MessageModel.markMessagesAsRead(partnerId, userId);

    return res.status(200).json({
      success: true,
      messages,
      partner
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Konversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler beim Abrufen der Konversation'
    });
  }
};

/**
 * Ruft die Liste der Chat-Partner ab
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const getChatList = async (req, res) => {
  try {
    const userId = req.user.id;

    const chatPartners = await MessageModel.getChatPartners(userId);
    return res.status(200).json(chatPartners);
  } catch (error) {
    console.error('Fehler beim Abrufen der Chat-Liste:', error);
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler beim Abrufen der Chat-Liste'
    });
  }
};

/**
 * Markiert Nachrichten von einem bestimmten Absender als gelesen
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const markAsRead = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const { senderId } = req.params;

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: 'Absender-ID ist erforderlich'
      });
    }

    // Verwende die neue Funktion markMessagesAsRead statt markAsRead
    const result = await MessageModel.markMessagesAsRead(senderId, receiverId);
    return res.status(200).json({
      success: true,
      message: `${result.updatedCount} Nachrichten als gelesen markiert`,
      count: result.updatedCount
    });
  } catch (error) {
    console.error('Fehler beim Markieren der Nachrichten als gelesen:', error);
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler beim Markieren der Nachrichten als gelesen'
    });
  }
};

/**
 * Löscht eine Nachricht
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Nachrichten-ID ist erforderlich'
      });
    }

    const result = await MessageModel.deleteMessage(messageId, userId);
    return res.status(200).json({
      success: true,
      message: 'Nachricht erfolgreich gelöscht',
      data: result
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Nachricht:', error);
    if (error.message === 'Nachricht nicht gefunden oder keine Berechtigung zum Löschen') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler beim Löschen der Nachricht'
    });
  }
};

export { sendMessage, getConversation, getChatList, markAsRead, deleteMessage };

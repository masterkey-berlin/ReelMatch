import * as MatchModel from '../models/match.model.js';
import * as UserModel from '../models/user.model.js';

/**
 * Erstellt ein Match zwischen zwei Benutzern
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
export const createMatch = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
      return res.status(400).json({
        success: false,
        message: 'Beide Benutzer-IDs sind erforderlich'
      });
    }

    // Prüfen, ob die Benutzer existieren
    const user1 = await UserModel.findUserById(user1Id);
    const user2 = await UserModel.findUserById(user2Id);

    if (!user1) {
      return res.status(404).json({
        success: false,
        message: `Benutzer mit ID ${user1Id} nicht gefunden`
      });
    }

    if (!user2) {
      return res.status(404).json({
        success: false,
        message: `Benutzer mit ID ${user2Id} nicht gefunden`
      });
    }

    // Prüfen, ob bereits ein Match besteht
    const matchExists = await MatchModel.checkMatchExists(user1Id, user2Id);
    if (matchExists) {
      return res.status(400).json({
        success: false,
        message: 'Ein Match zwischen diesen Benutzern existiert bereits'
      });
    }

    // Match erstellen
    const match = await MatchModel.createMatch(user1Id, user2Id);

    return res.status(201).json({
      success: true,
      message: `Match zwischen ${user1.username} und ${user2.username} erfolgreich erstellt`,
      data: match
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Matches:', error);
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler beim Erstellen des Matches'
    });
  }
};

/**
 * Listet alle Benutzer auf
 * @param {Object} req - Express Request-Objekt
 * @param {Object} res - Express Response-Objekt
 */
export const listUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler beim Abrufen der Benutzer'
    });
  }
};

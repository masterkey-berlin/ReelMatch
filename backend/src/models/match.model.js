import pool from '../config/db.js';

export const createMatch = async (user1Id, user2Id) => {
  const result = await pool.query(
    'INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2) RETURNING *',
    [user1Id, user2Id]
  );
  return result.rows[0];
};

export const findMatchesByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT m.match_id, 
            CASE WHEN m.user1_id = $1 THEN u2.user_id ELSE u1.user_id END AS partner_id,
            CASE WHEN m.user1_id = $1 THEN u2.username ELSE u1.username END AS partner_username,
            CASE WHEN m.user1_id = $1 THEN u2.profile_video_path ELSE u1.profile_video_path END AS partner_video_path
     FROM matches m
     JOIN users u1 ON m.user1_id = u1.user_id
     JOIN users u2 ON m.user2_id = u2.user_id
     WHERE m.user1_id = $1 OR m.user2_id = $1`,
    [userId]
  );
  return result.rows;
};

/**
 * Prüft, ob ein Match zwischen zwei Benutzern besteht
 * @param {number} userId - ID des ersten Benutzers
 * @param {number} partnerId - ID des zweiten Benutzers
 * @returns {Promise<boolean>} true, wenn ein Match besteht, sonst false
 */
export const checkMatchExists = async (userId, partnerId) => {
  // Sicherstellen, dass beide IDs als Integer behandelt werden
  userId = parseInt(userId);
  partnerId = parseInt(partnerId);

  console.log(`Überprüfe Match zwischen Benutzer ${userId} und Partner ${partnerId}`);

  const result = await pool.query(
    'SELECT * FROM matches WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)',
    [userId, partnerId]
  );

  console.log(`Match-Überprüfungsergebnis: ${result.rows.length > 0 ? 'Match gefunden' : 'Kein Match gefunden'}`);
  if (result.rows.length > 0) {
    console.log('Match-Details:', result.rows[0]);
  }

  return result.rows.length > 0;
};

/**
 * Holt ein Match zwischen zwei Benutzern
 * @param {number} userId - ID des ersten Benutzers
 * @param {number} partnerId - ID des zweiten Benutzers
 * @returns {Promise<Object|null>} Das Match-Objekt oder null, wenn kein Match besteht
 */
export const getMatchBetweenUsers = async (userId, partnerId) => {
  const result = await pool.query(
    'SELECT * FROM matches WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)',
    [userId, partnerId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

// Default export für Kompatibilität mit bestehenden Imports
const MatchModel = {
  createMatch,
  findMatchesByUserId,
  checkMatchExists,
  getMatchBetweenUsers
};

export default MatchModel;

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

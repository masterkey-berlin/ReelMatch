import pool from '../config/db.js';

export const createInterest = async (initiatorId, targetId) => {
  const result = await pool.query(
    'INSERT INTO interests (initiator_user_id, target_user_id) VALUES ($1, $2) RETURNING *',
    [initiatorId, targetId]
  );
  return result.rows[0];
};

export const findInterest = async (initiatorId, targetId) => {
  const result = await pool.query(
    'SELECT * FROM interests WHERE initiator_user_id = $1 AND target_user_id = $2',
    [initiatorId, targetId]
  );
  return result.rows[0];
};
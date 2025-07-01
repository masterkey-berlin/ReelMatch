import pool from '../config/db.js';

export const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

export const createUser = async (username) => {
  const result = await pool.query(
    'INSERT INTO users (username) VALUES ($1) RETURNING *',
    [username]
  );
  return result.rows[0];
};

export const updateUserVideoPath = async (userId, videoPath) => {
  const result = await pool.query(
    'UPDATE users SET profile_video_path = $1 WHERE user_id = $2 RETURNING *',
    [videoPath, userId]
  );
  return result.rows[0];
};

// Neue Funktion: User anhand der ID finden
export const findUserById = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};
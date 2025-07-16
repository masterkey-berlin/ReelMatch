import pool from '../config/db.js';

export const findUserByUsername = async (username) => {
  const result = await pool.query(
    'SELECT user_id as id, username, email, password, profile_video_path, short_bio, created_at FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
};

// User anhand Email finden
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT user_id as id, username, email, password, profile_video_path, short_bio, created_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

export const createUser = async (userData) => {
  // Unterstützt sowohl altes Format (nur username) als auch neues Format (Objekt)
  if (typeof userData === 'string') {
    // Alte API-Kompatibilität
    const result = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING user_id as id, username, email, created_at',
      [userData]
    );
    return result.rows[0];
  }

  // Neue JWT-Auth API
  const { username, email, password } = userData;
  const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id as id, username, email, created_at',
    [username, email, password]
  );
  return result.rows[0];
};

export const updateUserVideoPath = async (userId, videoPath) => {
  const result = await pool.query(
    'UPDATE users SET profile_video_path = $1 WHERE user_id = $2 RETURNING user_id as id, username, email, profile_video_path, short_bio, created_at',
    [videoPath, userId]
  );
  return result.rows[0];
};

// User anhand der ID finden
export const findUserById = async (id) => {
  // Flexibel: unterstützt sowohl 'id' als auch 'user_id' Spalte
  const result = await pool.query(
    'SELECT user_id as id, username, email, profile_video_path, short_bio, created_at FROM users WHERE user_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Hier die neue Funktion einfügen:
export const updateUser = async (userId, userData) => {
  // Nimmt ein Objekt mit den zu aktualisierenden Feldern entgegen (z.B. { short_bio: 'neuer text' })
  const fields = Object.keys(userData);
  const values = Object.values(userData);

  const setString = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

  if (fields.length === 0) {
    return findUserById(userId);
  }

  const query = `UPDATE users SET ${setString} WHERE user_id = $1 RETURNING *`;
  const result = await pool.query(query, [userId, ...values]);
  return result.rows[0];
};

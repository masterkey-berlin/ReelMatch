import pool from '../config/db.js';

export const findPostsByRoomId = async (roomId) => {
  // Join mit der users-Tabelle, um den Usernamen mitzuliefern
  const result = await pool.query(
    'SELECT vp.*, u.username FROM video_posts vp JOIN users u ON vp.user_id = u.user_id WHERE vp.room_id = $1 ORDER BY vp.created_at DESC',
    [roomId]
  );
  return result.rows;
};

export const createPost = async ({ userId, roomId, videoPath, textContent }) => {
  const result = await pool.query(
    'INSERT INTO video_posts (user_id, room_id, video_path, text_content) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, roomId, videoPath, textContent]
  );
  return result.rows[0];
};
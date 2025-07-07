import pool from '../config/db.js';

export const findAllRooms = async () => {
  const result = await pool.query('SELECT * FROM theme_rooms ORDER BY name ASC');
  return result.rows;
};

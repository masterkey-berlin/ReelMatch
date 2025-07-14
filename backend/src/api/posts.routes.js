import { Router } from 'express';

const router = Router();

// GET /api/posts
router.get('/', (req, res) => {
  // Dummy response, später mit DB-Daten ersetzen
  res.status(200).json([]);
});

// POST /api/posts
router.post('/', (req, res) => {
  // Dummy response, später mit DB-Logik ersetzen
  const { user_id, room_id, video_path, description } = req.body;
  res.status(201).json({
    post_id: 1,
    user_id,
    room_id,
    video_path,
    description,
  });
});

export default router;

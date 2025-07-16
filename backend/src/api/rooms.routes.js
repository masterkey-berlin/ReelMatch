import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import * as postController from '../controllers/post.controller.js';
import upload from '../middleware/upload.middleware.js';
import { deletePostController } from '../controllers/post.controller.js'; // NEU: Import hinzufügen
import { protectedRoute } from '../middleware/auth.middleware.js'; // Authentifizierungs-Middleware importieren

const router = Router();

// Alle Räume auflisten
router.get('/', roomController.getAllRooms);

// Alle Posts in einem bestimmten Raum auflisten
router.get('/:roomId/posts', roomController.getPostsInRoom);

// Einen neuen Video-Post in einem Raum erstellen (alte Route mit userId im Pfad)
router.post('/:roomId/users/:userId/posts', protectedRoute, upload.single('postVideo'), postController.createVideoPost);

// Neue Route ohne userId im Pfad - verwendet den authentifizierten Benutzer
router.post('/:roomId/posts', protectedRoute, upload.single('postVideo'), postController.createVideoPost);

// NEU: Route zum Löschen eines Posts hinzufügen
router.delete('/:roomId/posts/:postId', deletePostController);

// Dummy-POST-Route für Räume (Testzweck)
router.post('/', (req, res) => {
  const { name, description } = req.body;
  res.status(201).json({
    room_id: 999,
    name,
    description,
  });
});

export default router;

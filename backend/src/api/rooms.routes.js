import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import * as postController from '../controllers/post.controller.js';
import upload from '../middleware/upload.middleware.js';
import { deletePostController } from '../controllers/post.controller.js'; // NEU: Import hinzufügen

const router = Router();

// Alle Räume auflisten
router.get('/', roomController.getAllRooms);

// Alle Posts in einem bestimmten Raum auflisten
router.get('/:roomId/posts', roomController.getPostsInRoom);

// Einen neuen Video-Post in einem Raum erstellen
// Annahme: userId wird irgendwie mitgegeben (z.B. aus einem JWT, hier vereinfacht auch als Param)
router.post('/:roomId/users/:userId/posts', upload.single('postVideo'), postController.createVideoPost);

// NEU: Route zum Löschen eines Posts hinzufügen
router.delete('/:roomId/posts/:postId', deletePostController);

export default router;

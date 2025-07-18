import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import upload from '../middleware/upload.middleware.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = Router();

// Alle User-Routen mit protectedRoute-Middleware schützen
router.post('/:userId/intro-video', protectedRoute, upload.single('introVideo'), userController.uploadIntroVideo);

// Neue GET-Route für das User-Profil
router.get('/:userId/profile', protectedRoute, userController.getProfile);

// Neue Route für das Profil-Update
router.put('/:userId/profile', protectedRoute, userController.updateProfile);

export default router;

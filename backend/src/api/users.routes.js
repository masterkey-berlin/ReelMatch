import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

// 'introVideo' ist der Name des Formularfelds, das die Datei enthält
router.post('/:userId/intro-video', upload.single('introVideo'), userController.uploadIntroVideo);

// Neue GET-Route für das User-Profil
router.get('/:userId/profile', userController.getProfile);

// Neue Route für das Profil-Update
router.put('/:userId/profile', userController.updateProfile);

export default router;

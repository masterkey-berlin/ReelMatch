import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import upload from '../middleware/upload.middleware.js';
import { tempAuthForDev } from '../middleware/auth.middleware.js';

const router = Router();

// Alle User-Routen mit tempAuthForDev-Middleware schützen
// Dies stellt sicher, dass der korrekte Benutzer aus dem X-User-Id Header verwendet wird

// 'introVideo' ist der Name des Formularfelds, das die Datei enthält
router.post('/:userId/intro-video', tempAuthForDev, upload.single('introVideo'), userController.uploadIntroVideo);

// Neue GET-Route für das User-Profil
router.get('/:userId/profile', tempAuthForDev, userController.getProfile);

// Neue Route für das Profil-Update
router.put('/:userId/profile', tempAuthForDev, userController.updateProfile);

export default router;

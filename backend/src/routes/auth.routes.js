import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Öffentliche Routen
router.post('/register', register);
router.post('/login', login);

// Geschützte Routen
router.get('/me', protectedRoute, getCurrentUser);

export default router;

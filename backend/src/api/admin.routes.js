import express from 'express';
import * as AdminController from '../controllers/admin.controller.js';

const router = express.Router();

// Admin-Routen (Auth-Middleware wird in app.js angewendet)
router.post('/create-match', AdminController.createMatch);
router.get('/users', AdminController.listUsers);

export default router;

import { Router } from 'express';
import * as matchController from '../../controllers/match.controller.js'; // ← RICHTIG
import { protectedRoute } from '../../middleware/auth.middleware.js';     // ← RICHTIG

const router = Router();

// Debug-Route
router.get('/test', (req, res) => {
  res.json({ message: 'Match routes are working!' });
});

// Debug: Test likeVideo function availability
router.get('/debug-like-video', (req, res) => {
  res.json({
    message: 'Debug route working',
    likeVideoExists: typeof matchController.likeVideo === 'function'
  });
});

router.post('/interest', protectedRoute, matchController.expressInterest);
router.post('/like-video', protectedRoute, matchController.likeVideo);
router.get('/', protectedRoute, matchController.getMyMatches);

export default router;

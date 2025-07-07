import { Router } from 'express';
import * as matchController from '../../controllers/match.controller.js'; // ← RICHTIG
import { protectedRoute } from '../../middleware/auth.middleware.js';     // ← RICHTIG

const router = Router();

// Debug-Route
router.get('/test', (req, res) => {
  res.json({ message: 'Match routes are working!' });
});

router.post('/interest', protectedRoute, matchController.expressInterest);
router.get('/', protectedRoute, matchController.getMyMatches);

export default router;
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

// Debug: Test DB connection
router.get('/debug-db', async (req, res) => {
  try {
    const pool = (await import('../../config/db.js')).default;
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ 
      message: 'Database connection working',
      currentTime: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Debug: Simple likeVideo ohne Auth
router.post('/debug-like-simple', async (req, res) => {
  try {
    console.log('🧪 Debug like-video called with:', req.body);
    
    // Fake user für Test
    req.user = { id: 2 };
    
    // Call actual likeVideo function
    await matchController.likeVideo(req, res);
  } catch (error) {
    console.error('🧪 Debug like-video error:', error);
    res.status(500).json({
      message: 'Debug like failed',
      error: error.message,
      stack: error.stack
    });
  }
});

router.post('/interest', protectedRoute, matchController.expressInterest);
// Temporär ohne Auth für Debug
router.post('/like-video', (req, res, next) => {
  // Fake user setzen
  req.user = { id: 2 };
  next();
}, matchController.likeVideo);
router.get('/', protectedRoute, matchController.getMyMatches);

export default router;

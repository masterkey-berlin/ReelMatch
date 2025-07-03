import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username required' });

  const user = await db('users').where({ username }).first();
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
});

export default router;
import { Router } from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import * as messageController from '../controllers/message.controller.js';

const router = Router();

// Chat-Partner-Liste für eingeloggten User
router.get('/chat-list', protectedRoute, messageController.getChatList);
// Konversation mit Partner abrufen
router.get('/conversation/:partnerId', protectedRoute, messageController.getConversation);
// Nachricht senden
router.post('/send', protectedRoute, messageController.sendMessage);

export default router;

import express from 'express';
import { sendMessage, getConversation, getChatList, markAsRead } from '../controllers/message.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Alle Routen mit JWT-Authentifizierung schützen
router.use(protectedRoute);

// Nachricht senden
router.post('/send', sendMessage);

// Konversation abrufen
router.get('/conversation/:partnerId', getConversation);

// Chat-Liste abrufen
router.get('/chat-list', getChatList);

// Nachrichten als gelesen markieren
router.put('/read/:senderId', markAsRead);

export default router;

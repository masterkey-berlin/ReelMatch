import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js';

const router = Router();

// Chat-Partner-Liste für eingeloggten User
router.get('/chat-list', messageController.getChatList);
// Konversation mit Partner abrufen
router.get('/conversation/:partnerId', messageController.getConversation);
// Nachricht senden
router.post('/send', messageController.sendMessage);
// Nachricht löschen
router.delete('/delete/:messageId', messageController.deleteMessage);

export default router;

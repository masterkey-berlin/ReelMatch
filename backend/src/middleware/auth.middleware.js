// JWT-Authentifizierung
import { verifyToken } from '../controllers/auth.controller.js';
import * as UserModel from '../models/user.model.js';

// JWT-basierte Authentifizierung
export const protectedRoute = async (req, res, next) => {
  try {
    // Token aus Authorization-Header extrahieren
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔴 Auth Middleware: Kein Authorization-Header gefunden');
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔵 Auth Middleware: Token erhalten');

    // Token verifizieren
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('🔴 Auth Middleware: Ungültiger oder abgelaufener Token');
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    console.log('🔵 Auth Middleware: Token verifiziert, userId:', decoded.userId);

    // Benutzer aus der Datenbank laden
    const user = await UserModel.findUserById(decoded.userId);
    if (!user) {
      console.log('🔴 Auth Middleware: Benutzer nicht gefunden für ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }
    console.log('✅ Auth Middleware: Benutzer gefunden:', user.id, user.username);

    // Benutzer zum Request hinzufügen
    req.user = {
      id: user.id,
      user_id: user.id, // Hinzufügen von user_id als Alias für id
      username: user.username,
      email: user.email
    };

    console.log('✅ Auth Middleware: User object set:', req.user);

    next();
  } catch (error) {
    console.error('🔴 Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Fallback für Development (optional)
export const tempAuthForDev = (req, res, next) => {
  console.log('🔐 TempAuth: Using development auth');

  // Prüfen, ob ein X-User-Id Header vorhanden ist (vom Frontend gesendet)
  const userIdHeader = req.headers['x-user-id'];

  // Benutzer basierend auf dem Header oder Fallback wählen
  let userId = 12; // Fallback auf Jack (ID 12)
  let username = 'Jack';
  let email = 'jack@reelmatch.com';

  if (userIdHeader) {
    // Wenn ein Header vorhanden ist, verwende diesen Benutzer
    userId = parseInt(userIdHeader, 10);

    // Bekannte Benutzer in der Datenbank
    if (userId === 11) {
      username = 'Masterkey';
      email = 'masterkey@reelmatch.com';
    } else if (userId === 13) {
      username = 'TestUser';
      email = 'testuser@reelmatch.com';
    } else if (userId === 14) {
      username = 'Erika';
      email = 'erika@reelmatch.com';
    }
  }

  req.user = {
    id: userId,
    user_id: userId, // Hinzufügen von user_id als Alias für id
    username: username,
    email: email
  };

  console.log('✅ Dev user authenticated:', req.user);
  next();
};

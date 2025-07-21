// JWT-Authentifizierung
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.model.js';

// Nur noch JWT-Authentifizierung, Entwicklermodus entfernt
export const protectedRoute = async (req, res, next) => {
  try {
    // JWT Authentifizierung
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('🔴 Auth Middleware: Kein Authorization-Header gefunden');
      return res.status(401).json({ message: 'Authorization token required' });
    }
    const token = authHeader.replace('Bearer ', '');
    console.log('🔵 Auth Middleware: Token erhalten');
    const { userId } = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('🔵 Auth Middleware: Token verifiziert, userId:', userId);
    const user = await UserModel.findUserById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('✅ Auth Middleware: Benutzer gefunden:', userId, user.username);
    req.user = user;
    console.log('✅ Auth Middleware: User object set:', user);
    next();
  } catch (error) {
    console.error('🔴 Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

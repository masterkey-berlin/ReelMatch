import * as UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT Secret aus Umgebungsvariablen oder Fallback
const JWT_SECRET = process.env.JWT_SECRET || 'reelmatch-dev-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// JWT Token generieren
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required.' });
  }

  try {
    const existingUser = await UserModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await UserModel.createUser({
      username,
      email,
      password: hashedPassword
    });

    // JWT Token generieren
    const token = generateToken(newUser.id);

    // Passwort aus Response entfernen
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering new user.' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await UserModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Passwort überprüfen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // JWT Token generieren
    const token = generateToken(user.id);

    // Passwort aus Response entfernen
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

// Token validieren (für Middleware)
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// Aktuellen Benutzer abrufen
export const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

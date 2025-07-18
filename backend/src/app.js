import express from 'express';
import cors from 'cors';
import path from 'path'; // Wichtig für __dirname
import { fileURLToPath } from 'url'; // Wichtig für __dirname in ES Modules

import authRoutes from './routes/auth.routes.js';
import userRoutes from './api/users.routes.js';
import roomRoutes from './api/rooms.routes.js'; // Neue Zeile
import matchRoutes from './api/matches/routes.js'; // ← Ist das da?
import healthRoutes from './api/health.routes.js'; // Health-Route importieren
import postsRoutes from './api/posts.routes.js'; // Posts-Route importieren
import messageRoutes from './api/messages.routes.js'; // Chat-Nachrichten-Route importieren

// Auth-Middleware importieren
import { protectedRoute } from './middleware/auth.middleware.js';

const app = express();

// Da __dirname in ES Modules nicht direkt verfügbar ist:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // Erlaubt Cross-Origin-Anfragen
app.use(express.json()); // Parsed JSON-Bodies
app.use(express.urlencoded({ extended: true })); // Parsed URL-encoded Bodies

// Statische Dateien bereitstellen (für den Video-Abruf)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routen
app.get('/', (req, res) => {
  res.send('ReelMatch Backend is running!');
});

app.use('/api/v1/auth', authRoutes);

// Alle anderen API-Routen mit protectedRoute-Middleware schützen
app.use('/api/v1/users', protectedRoute, userRoutes);
app.use('/api/v1/rooms', protectedRoute, roomRoutes);
app.use('/api/v1/matches', protectedRoute, matchRoutes);
app.use('/api/health', healthRoutes); // Health-Route ohne Auth
app.use('/api/posts', protectedRoute, postsRoutes);
app.use('/api/v1/messages', protectedRoute, messageRoutes); // Chat-Nachrichten-Route mit Auth

export default app;

import express from 'express';
import cors from 'cors';
import path from 'path'; // Wichtig für __dirname
import { fileURLToPath } from 'url'; // Wichtig für __dirname in ES Modules

import authRoutes from './api/auth.routes.js';
import userRoutes from './api/users.routes.js';
import roomRoutes from './api/rooms.routes.js'; // Neue Zeile

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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes); // Neue Zeile

export default app;
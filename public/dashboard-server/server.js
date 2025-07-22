// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===

// CORS: nur Anfragen vom Frontend erlauben
app.use(cors({
  origin: 'https://dashboard-qhrr.onrender.com',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

// JSON-Parsing für eingehende Requests
app.use(express.json());

// Statische Dateien aus dem übergeordneten public-Verzeichnis
app.use(express.static(path.join(__dirname, '..')));

// === Logging (optional) ===
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// === API-Routen ===
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// === Healthcheck/Diagnose ===
app.get('/api/test-db', async (req, res) => {
  try {
    res.send(`DB-Zugriff erfolgreich – ${new Date().toISOString()}`);
  } catch (err) {
    console.error('Fehler beim DB-Check:', err);
    res.status(500).send('DB-Verbindungsfehler');
  }
});

// === Fallback für SPA (Single Page App) ===
// Nur wenn kein /api/... aufgerufen wird → index.html zurückgeben
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'API-Route nicht gefunden' });
  }
  res.sendFile(path.join(__dirname, '../index.html'));
});

// === Serverstart ===
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});

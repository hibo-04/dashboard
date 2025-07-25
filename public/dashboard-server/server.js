// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===

// CORS – Zugriff vom Frontend erlauben
app.use(cors({
  origin: 'https://dashboard-qhrr.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Set-Cookie']
}));

// Body Parsing & Cookies
app.use(express.json());
app.use(cookieParser());

// Session Setup (Cookie basiert)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,              // Nur via HTTPS (bei Render notwendig)
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 Tage
  }
}));

// Statische Dateien ausliefern (../public)
app.use(express.static(path.join(__dirname, '..')));

// Logging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// === API-Routen ===
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth'); // 🆕 Login, Logout, Me
app.use('/api/users', usersRouter);
app.use('/api', authRouter);

// === Healthcheck ===
app.get('/api/test-db', async (req, res) => {
  try {
    res.send(`DB-Zugriff erfolgreich – ${new Date().toISOString()}`);
  } catch (err) {
    console.error('Fehler beim DB-Check:', err);
    res.status(500).send('DB-Verbindungsfehler');
  }
});

// === Fallback für alle Nicht-API-Routen (SPA-Support) ===
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'API-Route nicht gefunden' });
  }
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serverstart
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});

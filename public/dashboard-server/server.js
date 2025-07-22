// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const pool = require('./db'); // PostgreSQL-Verbindung

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: 'https://dashboard-qhrr.onrender.com',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

app.use(express.json());

// Statische Dateien
app.use(express.static(path.join(__dirname, '..')));

// API-Routen
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Fallback: index.html für alle anderen Routen ausliefern
app.get('*', (req, res) => {
  res.sendFile(path.resolve('../index.html'));
});

// DB-Verbindung testen (optional)
app.get('/api/test-db', async (req, res) => {
  try {
    const now = new Date().toString();
    res.send(`Datenbankverbindung erfolgreich! Zeitstempel: ${now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fehler bei der Verbindung zur Datenbank');
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

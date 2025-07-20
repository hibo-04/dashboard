// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); // Verbindung zur Datenbank

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Für JSON-Parsing bei POST/PUT-Requests

// Benutzer-Router einbinden
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Test-Route
app.get('/', (req, res) => {
  res.send('Backend läuft. API-Endpunkte sind z.B. unter /api/test-db erreichbar.');
});

// Datenbankverbindungs-Test-Route
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

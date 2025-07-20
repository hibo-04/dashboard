// server.js

require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS aktivieren (optional, falls dein Frontend auf einer anderen Domain läuft)
app.use(cors());
app.use(express.json());

// PostgreSQL-Verbindung über Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Für Render wichtig (SSL aktiv)
  },
});

// Test-Route für DB-Verbindung
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Datenbankverbindung erfolgreich! Zeitstempel: ${result.rows[0].now}`);
  } catch (error) {
    console.error('Fehler bei der Verbindung zur Datenbank:', error);
    res.status(500).send('Fehler bei der Verbindung zur Datenbank');
  }
});

// Root-Route (optional)
app.get('/', (req, res) => {
  res.send('Backend läuft. API-Endpunkte sind z.B. unter /api/test-db erreichbar.');
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});

const express = require('express');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Serverfehler');
  }
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Datenbankverbindung erfolgreich! Zeitstempel: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Fehler bei DB-Verbindung:', err);
    res.status(500).send('Fehler bei der Verbindung zur Datenbank.');
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

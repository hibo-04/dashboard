const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/users – alle Benutzer abrufen
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, erstellt_am FROM benutzer ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

router.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO benutzer (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fehler beim Erstellen:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen des Benutzers' });
  }
});


module.exports = router;

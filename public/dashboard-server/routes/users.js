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

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// GET /api/users – alle Benutzer abrufen
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, erstellt_am FROM benutzer ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// POST /api/users – neuen Benutzer erstellen
router.post('/', async (req, res) => {
  const { name, email, passwort } = req.body;
  try {
    const passwort_hash = await bcrypt.hash(passwort, 10);
    const result = await pool.query(
      'INSERT INTO benutzer (name, email, passwort_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, passwort_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fehler beim Erstellen:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id – Benutzer (teilweise) aktualisieren
router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
      updates.push(`name = $${idx++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${idx++}`);
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Keine Felder zum Aktualisieren angegeben.' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE benutzer SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Fehler beim Aktualisieren:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

module.exports = router;

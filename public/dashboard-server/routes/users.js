const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crud = require('../database/crud');

const TABLE = 'benutzer';
const allowedFields = ['name', 'email', 'passwort']; // nur Eingabe-Felder

// GET /api/users – alle Benutzer abrufen
router.get('/', async (req, res) => {
  try {
    const users = await crud.readAll(TABLE, ['id', 'name', 'email', 'erstellt_am']);
    res.json(users);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// POST /api/users – Benutzer erstellen
router.post('/', async (req, res) => {
  try {
    const { name, email, passwort } = req.body;
    const passwort_hash = await bcrypt.hash(passwort, 10);

    const user = await crud.create(TABLE, { name, email, passwort_hash });
    res.status(201).json(user);
  } catch (err) {
    console.error('Fehler beim Erstellen:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id – Benutzer aktualisieren
router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const fields = { ...req.body };

    if (fields.passwort) {
      fields.passwort_hash = await bcrypt.hash(fields.passwort, 10);
      delete fields.passwort;
    }

    const user = await crud.updateById(TABLE, id, fields, ['name', 'email', 'passwort_hash']);
    res.json(user);
  } catch (err) {
    console.error('Fehler beim Aktualisieren:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id – Benutzer löschen
router.delete('/:id', async (req, res) => {
  try {
    await crud.deleteById(TABLE, req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Fehler beim Löschen:', err.message);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crud = require('../database/crud');

const TABLE = 'benutzer';

// Optional: explizit erlaubte Felder für Updates
const allowedUpdateFields = ['name', 'email', 'passwort_hash'];

// GET /api/users – alle Benutzer abrufen
router.get('/', async (req, res) => {
  try {
    const users = await crud.readAll(TABLE, ['id', 'name', 'email', 'erstellt_am']);
    res.json(users);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// POST /api/users – neuen Benutzer erstellen
router.post('/', async (req, res) => {
  try {
    const { name, email, passwort } = req.body;

    if (!name || !email || !passwort) {
      return res.status(400).json({ error: 'Name, E-Mail und Passwort sind erforderlich.' });
    }

    const passwort_hash = await bcrypt.hash(passwort, 10);
    const user = await crud.create(TABLE, { name, email, passwort_hash });

    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// PATCH /api/users/:id – Benutzer bearbeiten
router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    if (data.passwort) {
      data.passwort_hash = await bcrypt.hash(data.passwort, 10);
      delete data.passwort;
    }

    const updatedUser = await crud.updateById(TABLE, id, data, allowedUpdateFields);
    res.json(updatedUser);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// DELETE /api/users/:id – Benutzer löschen
router.delete('/:id', async (req, res) => {
  try {
    await crud.deleteById(TABLE, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;

// dashboard-server/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, passwort } = req.body;
  try {
    const result = await pool.query('SELECT * FROM benutzer WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: 'Benutzer nicht gefunden' });

    const valid = await bcrypt.compare(passwort, user.passwort_hash);
    if (!valid) return res.status(401).json({ error: 'Falsches Passwort' });

    // Session speichern
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({ message: 'Login erfolgreich', user: req.session.user });
  } catch (err) {
    console.error('Login-Fehler:', err);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout-Fehler:', err);
      return res.status(500).json({ error: 'Logout fehlgeschlagen' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout erfolgreich' });
  });
});

// GET /api/me
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Nicht eingeloggt' });
  }
  res.json(req.session.user);
});

module.exports = router;

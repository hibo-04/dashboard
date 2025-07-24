// public/scripts/login.js
import { showNotification } from './utils/notifications.js';

console.log("login.js geladen");

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwortInput = document.getElementById('passwort');
  const email = emailInput.value.trim();
  const passwort = passwortInput.value;

  // 🔎 1. Validierung im Frontend
  if (!email || !passwort) {
    showNotification('Bitte E-Mail und Passwort eingeben.', 'error');
    if (!email) emailInput.classList.add('input-error');
    if (!passwort) passwortInput.classList.add('input-error');
    return;
  }

  // Vorherige Fehlerzustände entfernen
  emailInput.classList.remove('input-error');
  passwortInput.classList.remove('input-error');

  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, passwort })
    });

    if (!res.ok) {
      const err = await res.json();

      // 🧠 Fehlerhinweise differenzieren
      if (err.error?.includes('nicht gefunden')) {
        emailInput.classList.add('input-error');
      } else if (err.error?.includes('Passwort')) {
        passwortInput.classList.add('input-error');
      }

      showNotification(err.error || 'Login fehlgeschlagen', 'error');
      return;
    }

    // ✅ Erfolgreich
    const data = await res.json();
    showNotification(`Willkommen, ${data.user.name}`, 'success');
    setTimeout(() => {
      location.href = '/#dashboard';
    }, 1000);
  } catch (err) {
    console.error('Login-Fehler:', err);
    showNotification('Netzwerkfehler beim Login. Bitte später erneut versuchen.', 'error');
  }
});

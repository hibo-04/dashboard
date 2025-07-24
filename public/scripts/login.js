// public/scripts/login.js
import { showNotification } from './utils/notifications.js';

console.log("login.js geladen");

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const passwort = document.getElementById('passwort').value;

  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, passwort })
    });

    if (!res.ok) {
      const err = await res.json();
      showNotification(err.error || 'Login fehlgeschlagen', 'error');
      return;
    }

    const data = await res.json();
    showNotification(`Willkommen, ${data.user.name}`, 'success');
    setTimeout(() => {
      location.href = '/#dashboard';
    }, 1000);
  } catch (err) {
    console.error('Login-Fehler:', err);
    showNotification('Login fehlgeschlagen: ' + err.message, 'error');
  }
});

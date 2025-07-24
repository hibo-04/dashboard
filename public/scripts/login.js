// scripts/login.js
import { showNotification } from './utils/notifications.js';

console.log("login.js geladen");

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwortInput = document.getElementById('passwort');
const loginButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const passwort = passwortInput.value;

  // Frontend-Validierung
  if (!email || !passwort) {
    showNotification('Bitte E-Mail und Passwort eingeben.', 'error');
    if (!email) emailInput.classList.add('input-error');
    if (!passwort) passwortInput.classList.add('input-error');
    return;
  }

  emailInput.classList.remove('input-error');
  passwortInput.classList.remove('input-error');

  loginButton.disabled = true;
  loginButton.textContent = 'Wird geprüft...';

  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, passwort })
    });

    if (!res.ok) {
      const err = await res.json();
      if (err.error?.includes('nicht gefunden')) emailInput.classList.add('input-error');
      if (err.error?.includes('Passwort')) passwortInput.classList.add('input-error');
      showNotification(err.error || 'Login fehlgeschlagen', 'error');
      loginButton.disabled = false;
      loginButton.textContent = 'Einloggen';
      return;
    }

    const data = await res.json();
    showNotification(`Willkommen, ${data.user.name}`, 'success');
    setTimeout(() => location.href = '/#benutzer', 800);
  } catch (err) {
    showNotification('Netzwerkfehler beim Login.', 'error');
    loginButton.disabled = false;
    loginButton.textContent = 'Einloggen';
  }
});

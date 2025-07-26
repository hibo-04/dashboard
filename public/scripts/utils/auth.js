// scripts/utils/auth.js
import { showNotification } from './notifications.js';

/**
 * Aktuell eingeloggten Benutzer abrufen
 */
export async function loadCurrentUser() {
  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/me', {
      credentials: 'include'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Fehler bei /api/me:', err);
    return null;
  }
}

/**
 * Logout durchführen und zur Login-Seite weiterleiten
 */
export async function logoutUser() {
  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Fehler beim Logout');

    showNotification('Erfolgreich ausgeloggt', 'success');
    setTimeout(() => location.href = '/#login', 500);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

/**
 * Topbar-Name dynamisch aktualisieren
 */
export async function updateUserDisplay() {
  const user = await loadCurrentUser();
  const nameBox = document.getElementById('user-name');

  if (nameBox) {
    nameBox.textContent = user?.name || 'Gast';
    nameBox.classList.toggle('gast', !user);
  }
}

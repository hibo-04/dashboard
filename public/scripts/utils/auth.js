// scripts/utils/auth.js

import { showNotification } from './notifications.js';

export async function loadCurrentUser() {
  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/me', {
      credentials: 'include'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

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

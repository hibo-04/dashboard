async function fetchUserList() {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();

    const container = document.getElementById('user-list');
    if (!container) return;

    container.innerHTML = '';

    users.forEach(user => {
      const userDiv = document.createElement('div');
      userDiv.textContent = `${user.id} – ${user.name} (${user.email})`;
      container.appendChild(userDiv);
    });
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
  }
}

// Beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', fetchUserList);

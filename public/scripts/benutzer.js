// public/scripts/benutzer.js
import { showNotification } from './utils/notifications.js';
import { initFab } from './utils/fab.js';

let currentDeleteId = null;

export function initBenutzerSeite() {
  fetchUserList();

  initFab({
    icon: '＋',
    tooltip: 'Benutzer hinzufügen',
    onClick: () => {
      document.getElementById('create-modal').style.display = 'flex';
    }
  });

  const createForm = document.getElementById('create-form');
  const editForm = document.getElementById('edit-form');

  createForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('create-name').value;
    const email = document.getElementById('create-email').value;
    const passwort = document.getElementById('create-passwort').value;

    try {
      const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, passwort })
      });

      if (!res.ok) throw new Error('Erstellen fehlgeschlagen');
      showNotification('Benutzer erfolgreich erstellt');
      createForm.reset();
      document.getElementById('create-modal').style.display = 'none';
      fetchUserList();
    } catch (err) {
      showNotification('Fehler beim Erstellen: ' + err.message, 'error');
    }
  });

  editForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const passwort = document.getElementById('edit-passwort').value;

    const payload = { name, email };
    if (passwort) payload.passwort = passwort;

    try {
      const res = await fetch(`https://dashboard-server-zm7f.onrender.com/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Update fehlgeschlagen');
      showNotification('Benutzer erfolgreich bearbeitet');
      document.getElementById('edit-modal').style.display = 'none';
      fetchUserList();
    } catch (err) {
      showNotification('Fehler beim Speichern: ' + err.message, 'error');
    }
  });

  document.getElementById('cancel-edit')?.addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });

  document.getElementById('cancel-create')?.addEventListener('click', () => {
    document.getElementById('create-modal').style.display = 'none';
  });

  document.getElementById('cancel-delete')?.addEventListener('click', () => {
    document.getElementById('delete-modal').style.display = 'none';
  });

  document.getElementById('confirm-delete')?.addEventListener('click', async () => {
    try {
      const res = await fetch(`https://dashboard-server-zm7f.onrender.com/api/users/${currentDeleteId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Löschen fehlgeschlagen');
      showNotification('Benutzer erfolgreich gelöscht');
      document.getElementById('delete-modal').style.display = 'none';
      fetchUserList();
    } catch (err) {
      showNotification('Fehler beim Löschen: ' + err.message, 'error');
    }
  });
}

async function fetchUserList() {
  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/users');
    const users = await res.json();

    const listContainer = document.getElementById('user-list');
    listContainer.innerHTML = '';

    if (users.length === 0) {
      listContainer.innerHTML = '<p>Keine Benutzer vorhanden.</p>';
      return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>E-Mail</th>
          <th>Erstellt am</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.erstellt_am || '-'}</td>
            <td>
              <button data-id="${user.id}" data-action="edit">Bearbeiten</button>
              <button data-id="${user.id}" data-name="${user.name}" data-action="delete">Löschen</button>
            </td>
          </tr>`).join('')}
      </tbody>
    `;

    listContainer.appendChild(table);

    table.querySelectorAll('button[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const user = users.find(u => u.id == id);
        document.getElementById('edit-id').value = user.id;
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-passwort').value = '';
        document.getElementById('edit-modal').style.display = 'flex';
      });
    });

    table.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentDeleteId = btn.dataset.id;
        document.getElementById('delete-confirm-text').textContent = `Benutzer "${btn.dataset.name}" wirklich löschen?`;
        document.getElementById('delete-modal').style.display = 'flex';
      });
    });
  } catch (err) {
    document.getElementById('user-list').innerHTML = '<p>Fehler beim Laden der Benutzer.</p>';
  }
}

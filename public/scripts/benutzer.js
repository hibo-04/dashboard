import { showNotification } from './utils/notifications.js';
import { initFab } from './utils/fab.js';

console.log("benutzer.js wurde geladen");

let currentDeleteId = null;

async function fetchUserList() {
  try {
    const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/users/');
    const users = await res.json();

    const listContainer = document.getElementById('user-list');
    if (users.length === 0) {
      listContainer.innerHTML = '<p>Keine Benutzer vorhanden.</p>';
      return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>E-Mail</th>
        <th>Erstellt am</th>
        <th>Aktionen</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    users.forEach(user => {
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = user.id;
      row.appendChild(idCell);

      const nameCell = document.createElement('td');
      nameCell.textContent = user.name;
      row.appendChild(nameCell);

      const emailCell = document.createElement('td');
      emailCell.textContent = user.email;
      row.appendChild(emailCell);

      const erstelltCell = document.createElement('td');
      erstelltCell.textContent = user.erstellt_am || '-';
      row.appendChild(erstelltCell);

      const actionsCell = document.createElement('td');

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Bearbeiten';
      editBtn.addEventListener('click', () => openEditModal(user));
      actionsCell.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Löschen';
      deleteBtn.addEventListener('click', () => openDeleteModal(user));
      actionsCell.appendChild(deleteBtn);

      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    listContainer.innerHTML = '';
    listContainer.appendChild(table);

  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    document.getElementById('user-list').innerHTML =
      '<p>Fehler beim Laden der Benutzer.</p>';
  }
}

function openEditModal(user) {
  document.getElementById('edit-id').value = user.id;
  document.getElementById('edit-name').value = user.name;
  document.getElementById('edit-email').value = user.email;
  document.getElementById('edit-passwort').value = '';
  document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

function openDeleteModal(user) {
  currentDeleteId = user.id;
  document.getElementById('delete-confirm-text').textContent = `Benutzer "${user.name}" wirklich löschen?`;
  document.getElementById('delete-modal').style.display = 'flex';
}

function closeDeleteModal() {
  currentDeleteId = null;
  document.getElementById('delete-modal').style.display = 'none';
}

// ✅ Initialisierung der Benutzer-Seite (wird von index.html aufgerufen)
export function initBenutzerSeite() {
  // Warte, bis der Inhalt im DOM sichtbar ist
  setTimeout(() => {
    document.getElementById('create-form')?.addEventListener('submit', handleCreate);
    document.getElementById('edit-form')?.addEventListener('submit', handleEdit);
    document.getElementById('cancel-edit')?.addEventListener('click', closeEditModal);
    document.getElementById('confirm-delete')?.addEventListener('click', handleDelete);
    document.getElementById('cancel-delete')?.addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-create')?.addEventListener('click', () => {
      document.getElementById('create-modal').style.display = 'none';
    });

    fetchUserList();

    initFab({
      icon: '＋',
      tooltip: 'Benutzer hinzufügen',
      onClick: () => {
        document.getElementById('create-modal').style.display = 'flex';
      }
    });
  }, 0);
}


  document.getElementById('cancel-edit')?.addEventListener('click', closeEditModal);

  document.getElementById('edit-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const passwort = document.getElementById('edit-passwort').value;

    const payload = { name, email };
    if (passwort) payload.passwort = passwort;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Update fehlgeschlagen');
      closeEditModal();
      showNotification('Benutzer erfolgreich bearbeitet');
      fetchUserList();
    } catch (err) {
      showNotification('Fehler beim Speichern: ' + err.message, 'error');
    }
  });

  document.getElementById('cancel-delete')?.addEventListener('click', closeDeleteModal);

  document.getElementById('confirm-delete')?.addEventListener('click', async () => {
    try {
      const res = await fetch(`/api/users/${currentDeleteId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Löschen fehlgeschlagen');
      closeDeleteModal();
      showNotification('Benutzer erfolgreich gelöscht');
      fetchUserList();
    } catch (err) {
      showNotification('Fehler beim Löschen: ' + err.message, 'error');
    }
  });

  document.getElementById('cancel-create')?.addEventListener('click', () => {
    document.getElementById('create-modal').style.display = 'none';
  });

  document.getElementById('create-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('create-name').value;
    const email = document.getElementById('create-email').value;
    const passwort = document.getElementById('create-passwort').value;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, passwort })
      });

      if (!res.ok) throw new Error('Erstellen fehlgeschlagen');
      showNotification('Benutzer erfolgreich erstellt');
      document.getElementById('create-form').reset();
      document.getElementById('create-modal').style.display = 'none';
      fetchUserList();
    } catch (err) {
      showNotification('Fehler beim Erstellen: ' + err.message, 'error');
    }
  });


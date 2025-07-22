import { showNotification } from './utils/notifications.js';

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

// Modal: Bearbeiten
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

document.getElementById('cancel-edit').addEventListener('click', closeEditModal);

document.getElementById('edit-form').addEventListener('submit', async (e) => {
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

    closeEditModal();
    showNotification('Benutzer erfolgreich bearbeitet');
    fetchUserList();
  } catch (err) {
    showNotification('Fehler beim Speichern: ' + err.message, 'error');
  }
});

// Modal: Löschen
function openDeleteModal(user) {
  currentDeleteId = user.id;
  document.getElementById('delete-confirm-text').textContent = `Benutzer "${user.name}" wirklich löschen?`;
  document.getElementById('delete-modal').style.display = 'flex';
}

function closeDeleteModal() {
  currentDeleteId = null;
  document.getElementById('delete-modal').style.display = 'none';
}

document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);

document.getElementById('confirm-delete').addEventListener('click', async () => {
  try {
    const res = await fetch(`https://dashboard-server-zm7f.onrender.com/api/users/${currentDeleteId}`, {
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

// Formular: Neuer Benutzer
document.getElementById('benutzer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const passwort = document.getElementById('passwort').value;

  const response = await fetch('https://dashboard-server-zm7f.onrender.com/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, passwort })
  });

  if (response.ok) {
    showNotification('Benutzer erfolgreich erstellt');
    document.getElementById('benutzer-form').reset();
    fetchUserList();
  } else {
    showNotification('Fehler beim Erstellen', 'error');
  }
});

fetchUserList();

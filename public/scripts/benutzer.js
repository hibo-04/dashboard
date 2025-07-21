// public/scripts/benutzer.js
console.log("benutzer.js wurde geladen");

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
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.erstellt_am || '-'}</td>
        <td>
          <button class="edit-btn" data-id="${user.id}">Bearbeiten</button>
          <button class="delete-btn" data-id="${user.id}">Löschen</button>
        </td>
      `;
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
  alert('Benutzer erfolgreich erstellt');
  document.getElementById('benutzer-form').reset();
  fetchUserList();
  } else {
    alert('Fehler beim Erstellen');
  }
});

fetchUserList();

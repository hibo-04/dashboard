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

      // ID-Zelle
      const idCell = document.createElement('td');
      idCell.textContent = user.id;
      row.appendChild(idCell);

      // Editable Zellen
      row.appendChild(createEditableCell(user.id, 'name', user.name));
      row.appendChild(createEditableCell(user.id, 'email', user.email));

      // Erstellungsdatum
      const erstelltCell = document.createElement('td');
      erstelltCell.textContent = user.erstellt_am || '-';
      row.appendChild(erstelltCell);

      // Aktionen
      const actionsCell = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Löschen';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.dataset.id = user.id;
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

function createEditableCell(userId, field, value) {
  const td = document.createElement('td');
  td.innerHTML = `
    <span class="cell-content">${value}</span>
    <span class="edit-icon" style="cursor:pointer; margin-left: 8px;">✏️</span>
  `;

  td.querySelector('.edit-icon').addEventListener('click', () => {
    const span = td.querySelector('.cell-content');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.classList.add('inline-input');

    td.replaceChild(input, span);
    input.focus();

    input.addEventListener('blur', () => saveInlineEdit(userId, field, input.value, td));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
    });
  });

  return td;
}

async function saveInlineEdit(userId, field, value, td) {
  try {
    const response = await fetch(`https://dashboard-server-zm7f.onrender.com/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    });

    if (!response.ok) throw new Error('Update fehlgeschlagen');
    const data = await response.json();

    td.innerHTML = `
      <span class="cell-content">${data[field]}</span>
      <span class="edit-icon" style="cursor:pointer; margin-left: 8px;">✏️</span>
    `;

    td.querySelector('.edit-icon').addEventListener('click', () => {
      const span = td.querySelector('.cell-content');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = span.textContent;
      input.classList.add('inline-input');
      td.replaceChild(input, span);
      input.focus();
      input.addEventListener('blur', () => saveInlineEdit(userId, field, input.value, td));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
      });
    });

  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    alert('Fehler beim Speichern');
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

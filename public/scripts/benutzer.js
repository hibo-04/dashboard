// public/scripts/benutzer.js
console.log("benutzer.js wurde geladen");

async function fetchUserList() {
  try {
    const res = await fetch('/api/users');
    const users = await res.json();

    const listContainer = document.getElementById('user-list');

    if (users.length === 0) {
      listContainer.innerHTML = '<p>Keine Benutzer vorhanden.</p>';
      return;
    }

    const list = document.createElement('ul');
    users.forEach(user => {
      const item = document.createElement('li');
      item.textContent = `${user.name} (${user.email})`;
      list.appendChild(item);
    });

    listContainer.innerHTML = '';
    listContainer.appendChild(list);

  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    document.getElementById('user-list').innerHTML =
      '<p>Fehler beim Laden der Benutzer.</p>';
  }
}

fetchUserList();

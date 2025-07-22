// Erstellt oder verwendet einen zentralen Container
function getNotificationContainer() {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  return container;
}

// Hauptfunktion
export function showNotification(message, type = 'success') {
  const container = getNotificationContainer();
  const notif = document.createElement('div');
  notif.className = `notification ${type === 'error' ? 'error' : ''}`;
  notif.textContent = message;

  container.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

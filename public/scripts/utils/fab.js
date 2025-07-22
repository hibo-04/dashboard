/**
 * Initialisiert einen Floating Action Button (FAB).
 * @param {Object} config - Konfiguration des FABs
 * @param {string} [config.icon='＋'] - Das Symbol oder HTML-Inhalt des Buttons
 * @param {string} [config.tooltip=''] - Der Tooltip-Text
 * @param {function} config.onClick - Funktion, die beim Klick ausgeführt wird
 */
export function initFab({ icon = '＋', tooltip = '', onClick }) {
  const fab = document.getElementById('fab');

  if (!fab) {
    console.warn('[FAB] Kein Element mit ID "fab" gefunden.');
    return;
  }

  fab.innerHTML = icon;
  fab.title = tooltip;

  if (typeof onClick === 'function') {
    fab.onclick = onClick;
  } else {
    console.warn('[FAB] Keine gültige onClick-Funktion übergeben.');
  }
}

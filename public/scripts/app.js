// public/scripts/app.js

const routes = {
  dashboard: '/pages/dashboard.html',
  dienste: '/pages/dienste.html',
  benutzer: '/pages/benutzer.html',
  berichte: '/pages/berichte.html',
  einstellungen: '/pages/einstellungen.html',
  login: '/pages/login.html'
};

const modules = {
  dashboard: '/scripts/dashboard.js',
  dienste: '/scripts/dienste.js',
  benutzer: '/scripts/benutzer.js',
  berichte: '/scripts/berichte.js',
  einstellungen: '/scripts/einstellungen.js', 
  login: '/scripts/login.js'
};

export async function loadPage(hash) {
  const page = hash.replace('#', '') || 'dashboard';
  const defaultTitle = page.charAt(0).toUpperCase() + page.slice(1);
  const content = document.getElementById('page-content');

  content.classList.add('fade-out');

  setTimeout(async () => {
    if (routes[page]) {
      const res = await fetch(routes[page]);
      const html = await res.text();

      const temp = document.createElement('div');
      temp.innerHTML = html;

      const customTitle = temp.querySelector('[data-title]');
      const pageTitle = customTitle ? customTitle.dataset.title : defaultTitle;
      document.getElementById('page-title').innerText = pageTitle;

      content.innerHTML = html;

      requestAnimationFrame(async () => {
        if (modules[page]) {
          try {
            const mod = await import(`..${modules[page]}`); // wichtig: keine doppelten Slashes
            const initFn = `init${capitalize(page)}Seite`;
            if (typeof mod[initFn] === 'function') {
              mod[initFn]();
            }
          } catch (err) {
            console.error(`Modul ${modules[page]} konnte nicht geladen werden:`, err);
          }
        }
      });

      markActiveMenu(page);

      content.classList.remove('fade-out');
      content.classList.add('fade-in');
      setTimeout(() => content.classList.remove('fade-in'), 200);
    } else {
      document.getElementById('page-title').innerText = 'Seite nicht gefunden';
      content.innerHTML = '<p>Seite nicht gefunden.</p>';
      content.classList.remove('fade-out');
    }
  }, 200);
}

function markActiveMenu(page) {
  const links = document.querySelectorAll('.nav-menu a');
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === page);
  });
}

export async function loadSidebar() {
  try {
    const res = await fetch('/components/sidebar.html'); // absoluter Pfad wichtig
    const html = await res.text();
    document.getElementById('sidebar').innerHTML = html;

    const toggleBtn = document.getElementById('toggle-sidebar');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        const layout = document.querySelector('.layout');
        sidebar.classList.toggle('active');
        layout.classList.toggle('expanded');
      });
    }
  } catch (err) {
    console.error('Sidebar konnte nicht geladen werden:', err);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener('hashchange', () => loadPage(location.hash));
window.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  loadPage(location.hash);
});

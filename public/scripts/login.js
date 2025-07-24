// public/scripts/login.js

console.log("login.js geladen");

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const passwort = document.getElementById('passwort').value;

  const res = await fetch('https://dashboard-server-zm7f.onrender.com/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, passwort })
  });

  const feedback = document.getElementById('login-feedback');

  if (res.ok) {
    feedback.textContent = 'Login erfolgreich. Weiterleitung...';
    setTimeout(() => {
      location.href = '/#dashboard';
    }, 1000);
  } else {
    const err = await res.json();
    feedback.textContent = err.error || 'Login fehlgeschlagen';
  }
});

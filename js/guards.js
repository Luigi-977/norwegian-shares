// ── PAGE GUARD ─────────────────────────────────────────────
// Protects pages from being accessed without login
// Used by: portfolio.html, transactions.html, settings.html
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const loading = document.getElementById('loadingScreen');
  if (loading) loading.style.display = 'none';
  if (!user) { window.location.href = 'login.html'; return; }
  const name = user.displayName || user.email;
  const first = name.split(' ')[0];
  const avatar = document.getElementById('navAvatar');
  const navName = document.getElementById('navName');
  if (avatar) avatar.textContent = first.charAt(0).toUpperCase();
  if (navName) navName.textContent = name;
});

window.handleLogout = function () {
  signOut(auth).then(() => { window.location.href = 'index.html'; });
};

// ── AUTH GUARD ─────────────────────────────────────────────
// Import this on every protected page to redirect if not logged in
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    const loading = document.getElementById('loadingScreen');
    if (loading) loading.style.display = 'none';
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    // Set nav avatar and name on every page
    const name = user.displayName || user.email;
    const first = name.split(' ')[0];
    const avatar = document.getElementById('navAvatar');
    const navName = document.getElementById('navName');
    if (avatar) avatar.textContent = first.charAt(0).toUpperCase();
    if (navName) navName.textContent = name;
    if (callback) callback(user);
  });
}

export function logout() {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  });
}

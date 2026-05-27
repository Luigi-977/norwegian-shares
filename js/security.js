// ── SECURITY ───────────────────────────────────────────────
// Prevents logged-in users from seeing login/register pages
import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  // If already logged in, redirect to dashboard
  if (user) window.location.href = 'dashboard.html';
});

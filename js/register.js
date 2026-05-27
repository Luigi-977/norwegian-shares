// ── REGISTER PAGE LOGIC ────────────────────────────────────
import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

// If already logged in, go straight to dashboard
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = 'dashboard.html';
});

function showAlert(msg, type) {
  const b = document.getElementById('alertBox');
  b.textContent = (type === 'success' ? '✓ ' : '⚠ ') + msg;
  b.className = 'alert show ' + type;
}
function hideAlert() { document.getElementById('alertBox').className = 'alert'; }
function isEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function showErr(id, s) { document.getElementById(id).classList.toggle('show', s); }
function markInput(id, e) { document.getElementById(id).classList.toggle('err', e); }
function setBtn(loading) {
  const b = document.getElementById('registerBtn');
  b.textContent = loading ? 'Creating account...' : 'Create My Account';
  b.disabled = loading;
}
function fbErr(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/unauthorized-domain': 'This domain is not authorised. Add it in Firebase → Authentication → Settings → Authorized Domains.',
    'auth/popup-closed-by-user': 'Google sign-up was closed. Please try again.'
  };
  return map[code] || 'Something went wrong (' + code + '). Please try again.';
}

window.checkStrength = function (val) {
  let s = 0;
  if (val.length >= 8) s++;
  if (/[A-Z]/.test(val)) s++;
  if (/[0-9]/.test(val)) s++;
  if (/[^A-Za-z0-9]/.test(val)) s++;
  const colors = ['#e05555', '#e08855', '#c9a84c', '#4caf82'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  ['s1', 's2', 's3', 's4'].forEach((id, i) => {
    document.getElementById(id).style.background = i < s ? colors[s - 1] : 'rgba(255,255,255,0.1)';
  });
  const lbl = document.getElementById('strengthLabel');
  lbl.textContent = val.length === 0 ? 'Enter a password' : (labels[s - 1] || 'Weak');
  lbl.style.color = val.length === 0 ? 'rgba(255,255,255,0.4)' : (colors[s - 1] || '#e05555');
};

window.handleRegister = function () {
  hideAlert();
  const first = document.getElementById('firstName').value.trim();
  const last = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPass').value;
  let ok = true;
  if (!first) { showErr('firstErr', true); markInput('firstName', true); ok = false; } else { showErr('firstErr', false); markInput('firstName', false); }
  if (!last) { showErr('lastErr', true); markInput('lastName', true); ok = false; } else { showErr('lastErr', false); markInput('lastName', false); }
  if (!isEmail(email)) { showErr('emailErr', true); markInput('email', true); ok = false; } else { showErr('emailErr', false); markInput('email', false); }
  if (pass.length < 8) { showErr('passErr', true); markInput('password', true); ok = false; } else { showErr('passErr', false); markInput('password', false); }
  if (pass !== confirm) { showErr('confirmErr', true); markInput('confirmPass', true); ok = false; } else { showErr('confirmErr', false); markInput('confirmPass', false); }
  if (!ok) return;
  setBtn(true);
  createUserWithEmailAndPassword(auth, email, pass)
    .then(cred => updateProfile(cred.user, { displayName: first + ' ' + last }))
    .then(() => {
      showAlert('Account created! Welcome to Norwegian Shares.', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    })
    .catch(e => { setBtn(false); showAlert(fbErr(e.code), 'error'); });
};

window.handleGoogle = function () {
  hideAlert();
  signInWithPopup(auth, provider)
    .then(() => {
      showAlert('Signed up with Google! Redirecting...', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    })
    .catch(e => { showAlert(fbErr(e.code), 'error'); });
};

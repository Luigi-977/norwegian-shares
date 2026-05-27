// ── LOGIN PAGE LOGIC ───────────────────────────────────────
import { auth } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
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
  const b = document.getElementById('loginBtn');
  b.textContent = loading ? 'Signing in...' : 'Sign In to My Account';
  b.disabled = loading;
}
function fbErr(code) {
  const map = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/unauthorized-domain': 'This domain is not authorised. Add it in Firebase → Authentication → Settings → Authorized Domains.',
    'auth/popup-closed-by-user': 'Google sign-in was closed. Please try again.'
  };
  return map[code] || 'Something went wrong (' + code + '). Please try again.';
}

window.handleLogin = function () {
  hideAlert();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value;
  let ok = true;
  if (!isEmail(email)) { showErr('emailErr', true); markInput('email', true); ok = false; }
  else { showErr('emailErr', false); markInput('email', false); }
  if (!pass) { showErr('passErr', true); markInput('password', true); ok = false; }
  else { showErr('passErr', false); markInput('password', false); }
  if (!ok) return;
  setBtn(true);
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      showAlert('Signed in! Redirecting...', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    })
    .catch(e => { setBtn(false); showAlert(fbErr(e.code), 'error'); });
};

window.handleGoogle = function () {
  hideAlert();
  signInWithPopup(auth, provider)
    .then(() => {
      showAlert('Signed in with Google! Redirecting...', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    })
    .catch(e => { showAlert(fbErr(e.code), 'error'); });
};

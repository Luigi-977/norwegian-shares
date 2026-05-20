import { auth, db } from './firebase.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: `${firstName} ${lastName}`,
        email,
        createdAt: new Date(),
        balance: 0,
        portfolio: []
      });

      window.location.href = 'dashboard.html';

    } catch (error) {
      alert(error.message);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      window.location.href = 'dashboard.html';

    } catch (error) {
      alert(error.message);
    }
  });
}

window.logoutUser = async function() {
  await signOut(auth);
  window.location.href = 'login.html';
}

onAuthStateChanged(auth, (user) => {
  const protectedPages = [
    'dashboard.html',
    'portfolio.html',
    'transactions.html',
    'settings.html'
  ];

  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage) && !user) {
    window.location.href = 'login.html';
  }
});

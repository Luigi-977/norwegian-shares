import { auth, db } from './firebase.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const alertBox = document.getElementById('alertBox');

function showAlert(message, type = 'error') {

  if (!alertBox) return;

  alertBox.innerHTML = message;
  alertBox.className = `alert-box show ${type}`;
}

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

window.handleSignup = async function() {

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!firstName || !lastName) {
    showAlert('Please enter your full name.');
    return;
  }

  if (!isEmail(email)) {
    showAlert('Enter a valid email.');
    return;
  }

  if (password.length < 8) {
    showAlert('Password must be at least 8 characters.');
    return;
  }

  if (password !== confirmPassword) {
    showAlert('Passwords do not match.');
    return;
  }

  try {

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      firstName,
      lastName,
      email,
      createdAt: serverTimestamp(),
      portfolioValue: 0,
      sharesOwned: 0,
      transactions: 0,
      verified: false
    });

    showAlert(
      'Account created successfully. Redirecting...',
      'success'
    );

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);

  } catch (error) {

    console.error(error);

    if (error.code === 'auth/email-already-in-use') {
      showAlert('Email already exists.');
    }
    else {
      showAlert(error.message);
    }
  }
};

window.handleLogin = async function() {

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!isEmail(email)) {
    showAlert('Enter a valid email.');
    return;
  }

  if (!password) {
    showAlert('Enter your password.');
    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    showAlert(
      'Login successful. Redirecting...',
      'success'
    );

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);

  } catch (error) {

    console.error(error);

    if (
      error.code === 'auth/invalid-credential'
    ) {
      showAlert('Incorrect email or password.');
    }
    else {
      showAlert(error.message);
    }
  }
};

window.logoutUser = async function() {

  await signOut(auth);

  window.location.href = 'login.html';
};

onAuthStateChanged(auth, (user) => {

  const protectedPages = [
    'dashboard.html',
    'portfolio.html',
    'transactions.html',
    'settings.html',
    'admin.html'
  ];

  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage) && !user) {

    window.location.href = 'login.html';
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT-Aou7qeoCkMYR6TXrZ5cPjkCWA4aGSQ",
  authDomain: "luigiblvck.firebaseapp.com",
  projectId: "luigiblvck",
  storageBucket: "luigiblvck.firebasestorage.app",
  messagingSenderId: "749834936416",
  appId: "1:749834936416:web:0829759868cfd1082c6305"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const submit = document.getElementById("submit");

submit.addEventListener("click", async (event) => {

  event.preventDefault();

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Login successful");

    window.location.href = "dashboard.html";

  } catch (error) {

    document.getElementById("message").innerHTML =
      error.message;

  }

});

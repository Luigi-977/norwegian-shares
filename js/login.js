import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (event) => {

  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const message = document.getElementById("login-message");

  try {

    await signInWithEmailAndPassword(auth, email, password);

    message.innerHTML = "Login successful!";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {

    message.innerHTML = error.message;

  }

});

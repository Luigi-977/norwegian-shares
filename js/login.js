import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const form = document.getElementById("login-form");

const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);

    message.className = "success-message";

    message.textContent = "Login successful";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {

    message.className = "error-message";

    message.textContent = error.message;

  }

});

import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const form = document.getElementById("register-form");

const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {

    await createUserWithEmailAndPassword(auth, email, password);

    message.className = "success-message";

    message.textContent = "Account created successfully";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {

    message.className = "error-message";

    message.textContent = error.message;

  }

});

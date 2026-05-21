import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// FORM
const loginForm = document.getElementById("loginForm");

// SUBMIT EVENT
loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  // INPUT VALUES
  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  // VALIDATION
  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {

    // LOGIN USER
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Login successful!");

    // REDIRECT
    window.location.href = "dashboard.html";

  } catch (error) {

    alert(error.message);
  }

});

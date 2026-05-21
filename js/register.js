import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// FORM
const registerForm = document.getElementById("registerForm");

// EVENT LISTENER
registerForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  // INPUTS
  const firstName = document.getElementById("firstName").value.trim();

  const lastName = document.getElementById("lastName").value.trim();

  const email = document.getElementById("registerEmail").value.trim();

  const password = document.getElementById("registerPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  // VALIDATION
  if (!firstName || !lastName) {
    alert("Please fill all fields");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {

    // CREATE USER
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    // UPDATE PROFILE
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`
    });

    alert("Account created successfully!");

    // REDIRECT
    window.location.href = "dashboard.html";

  } catch (error) {

    alert(error.message);
  }

});

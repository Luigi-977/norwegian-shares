import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT-Aou7qeoCkMYR6TXrZ5cPjkCWA4aGSQ",
  authDomain: "luigiblvck.firebaseapp.com",
  projectId: "luigiblvck",
  storageBucket: "luigiblvck.firebasestorage.app",
  messagingSenderId: "749834936416",
  appId: "1:749834936416:web:0829759868cfd1082c6305"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

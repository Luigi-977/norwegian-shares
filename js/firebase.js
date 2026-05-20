import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdweu2Y8ZSfilJsh5g0PKPwwiE7GXxoSk",
  authDomain: "norwegian-shares.firebaseapp.com",
  projectId: "norwegian-shares",
  storageBucket: "norwegian-shares.appspot.com",
  messagingSenderId: "43355796470",
  appId: "1:43355796470:web:afa61eb967b0beecc68dd7",
  measurementId: "G-VJJLJCFKDH"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  googleProvider
};

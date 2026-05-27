import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAdweu2Y8ZSfilJsh5g0PKPwwiE7GXxoSk",
  authDomain: "norwegian-shares.firebaseapp.com",
  projectId: "norwegian-shares",
  storageBucket: "norwegian-shares.firebasestorage.app",
  messagingSenderId: "43355796470",
  appId: "1:43355796470:web:afa61eb967b0beecc68dd7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

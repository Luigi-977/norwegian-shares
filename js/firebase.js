  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAdweu2Y8ZSfilJsh5g0PKPwwiE7GXxoSk",
    authDomain: "norwegian-shares.firebaseapp.com",
    projectId: "norwegian-shares",
    storageBucket: "norwegian-shares.firebasestorage.app",
    messagingSenderId: "43355796470",
    appId: "1:43355796470:web:b4c84016620f7d1ac68dd7",
    measurementId: "G-ZTMV5LN4WY"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

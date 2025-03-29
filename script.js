
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAwsGvq4KAnZ5ShTVs4uterBO6ssfL1iQY",
    authDomain: "happy-math-9d7c7.firebaseapp.com",
    projectId: "happy-math-9d7c7",
    storageBucket: "happy-math-9d7c7.appspot.com",
    messagingSenderId: "818534170576",
    appId: "1:818534170576:web:840046d1176a3b6bdac3d5",
    measurementId: "G-Q4XYN06Q59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;

window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("login-form");
    const appDiv = document.getElementById("app");
    const loadingScreen = document.getElementById("loading-screen");

    if (loadingScreen) loadingScreen.style.display = "block";
    if (loginForm) loginForm.style.display = "none";
    if (appDiv) appDiv.style.display = "none";

    let firstCheck = true;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;

        if (loadingScreen) loadingScreen.style.display = "none";

        if (user) {
            if (loginForm) loginForm.style.display = "none";
            if (appDiv) appDiv.style.display = "block";
            const name = localStorage.getItem('userName') || 'مستخدم';
            const nameSpan = document.getElementById("user-display-name");
            const welcomeMsg = document.getElementById("welcome-msg");
            if (nameSpan) nameSpan.textContent = name;
            if (welcomeMsg) welcomeMsg.textContent = `مرحباً يا ${name} 🌸`;
        } else {
            if (loginForm) loginForm.style.display = "block";
            if (appDiv) appDiv.style.display = "none";
        }

        firstCheck = false;
    });
});

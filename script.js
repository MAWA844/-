
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwsGvq4KAnZ5ShTVs4uterBO6ssfL1iQY",
  authDomain: "happy-math-9d7c7.firebaseapp.com",
  projectId: "happy-math-9d7c7",
  storageBucket: "happy-math-9d7c7.appspot.com",
  messagingSenderId: "818534170576",
  appId: "1:818534170576:web:840046d1176a3b6bdac3d5",
  measurementId: "G-Q4XYN06Q59",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const appSection = document.getElementById("app");

  loginForm.style.display = "none";
  appSection.style.display = "none";

  const signupButton = document.getElementById("signupButton");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logout-btn");

  // التحقق من حالة الدخول
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      updateUI(user);
    } else {
      updateUI(null);
    }
  });

  // إنشاء حساب
  signupButton.addEventListener("click", async () => {
    const name = document.getElementById("signupName").value.trim();
    const gender = document.getElementById("signupGender").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    localStorage.setItem("userName", name);
    localStorage.setItem("userGender", gender);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      currentUser = userCredential.user;
      updateUI(currentUser);
    } catch (error) {
      document.getElementById("signupError").textContent = error.message;
    }
  });

  // تسجيل الدخول
  loginButton.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      currentUser = userCredential.user;
      updateUI(currentUser);
    } catch (error) {
      document.getElementById("loginError").textContent = error.message;
    }
  });

  // تسجيل الخروج
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      currentUser = null;
      updateUI(null);
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
    }
  });

  // رسالة محبة
  const showAlertBtn = document.getElementById("showAlertBtn");
  if (showAlertBtn) {
    showAlertBtn.addEventListener("click", showMessage);
  }
});

function updateUI(user) {
    if (user) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("options").style.display = "block"; // ✅ أزرار الألعاب
        document.getElementById("logout-btn").style.display = "inline-block"; // ✅ زر الخروج

        const name = localStorage.getItem('userName') || 'مستخدم';
        document.getElementById("user-display-name").textContent = name;
        document.getElementById("welcome-msg").textContent = `مرحباً يا ${name} 🌸`;

        resetGame(); // علشان الألعاب تظهر صح
    } else {
        document.getElementById("login-form").style.display = "block";
        document.getElementById("app").style.display = "none";
        document.getElementById("options").style.display = "none"; // ✅ نخفيها لما يخرج
        document.getElementById("logout-btn").style.display = "none"; // ✅ نخفي الزر
    }
}


function showMessage() {
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert-message";
  alertDiv.textContent = "اتمنى 💖 لكم التفوق والسعادة";
  document.body.appendChild(alertDiv);

  alertDiv.addEventListener("click", () => {
    alertDiv.style.display = "none";
  });

  setTimeout(() => {
    alertDiv.style.display = "none";
  }, 5000);
}
const azkar = [
    "اللهم اجعلنا من أهل القرآن.",
    "اللهم إني أسألك العفو والعافية.",
    "سبحان الله وبحمده، سبحان الله العظيم.",
    "اللهم أتنا في الدنيا حسنة وفي الآخرة حسنة.",
    "اللهم اغفر لي ولأبوي ولأصحابي ولأصدقائي.",
    "اللهم إني أسالك الهدى والتقى والعفاف والغنى.",
    "يا الله، اجعلنا من أهل الجنة.",
    "اللهم اجعلنا من الذين يذكرونك كثيرًا.",
    "اللهم ارزقنا الفردوس الأعلى بغير حساب.",
    "اللهم اجعلنا من المستغفرين بالأسحار.",
    "اللهم صل على محمد وعلى آل محمد.",
    "اللهم بارك لنا في أرزاقنا وأوقاتنا.",
    "اللهم ارزقنا الإيمان.",
    "اللهم تقبل منا الصلاة والصيام.",
    "اللهم اجعلنا من أهل الصدق.",
    "اللهم اجعلنا من أهل البر.",
    "اللهم أهدنا واهد بنا.",
    "اللهم إنا نسألك علمًا نافعًا.",
    "اللهم اجعلنا من الذين يسيرون على صراطك المستقيم.",
    "اللهم اجعلنا من الذين إذا ذكروا ذكروا.",
    "اللهم اجعلنا من الذين يطمئن قلوبهم بذكرك.",
    "اللهم اجعلنا من أهل العمل الصالح.",
    "اللهم اجعلنا من المخلصين في ديننا.",
    "اللهم اجعلنا من الذين يتبعون الرسول.",
    "اللهم اجعلنا من أهل الجود والكرم.",
    "اللهم اجعلنا من أهل التوبة.",
    "اللهم اجعلنا من أهل الصبر.",
    "اللهم اجعلنا من أهل الشكر.",
    "اللهم اجعلنا من أهل الرضا.",
    "اللهم اجعلنا من أهل الفلاح.",
    "اللهم اجعلنا من أهل السعادة.",
    "اللهم اجعلنا من أهل المغفرة.",
    "اللهم اجعلنا من أهل العفة.",
    "اللهم اجعلنا من أهل الوقار.",
    "اللهم اجعلنا من أهل الأمانة.",
    "اللهم اجعلنا من أهل الاستغفار.",
    "اللهم اجعلنا من أهل الدعاء.",
    "اللهم اجعلنا من أهل الطاعة.",
    "اللهم اجعلنا من أهل الجهاد.",
    "اللهم اجعلنا من أهل التوفيق.",
    "اللهم اجعلنا من أهل المسارعة في الخيرات.",
    "اللهم اجعلنا من أهل الشجاعة.",
    "اللهم اجعلنا من أهل الراحة.",
    "اللهم اجعلنا من أهل الفقر إليك.",
    "اللهم اجعلنا من أهل الاستقامة.",
    "اللهم اجعلنا من أهل الهداية.",
    "اللهم اجعلنا من أهل التسبيح.",
    "اللهم اجعلنا من أهل العافية.",
    "اللهم اجعلنا من أهل البركة في حياتنا.",
    "اللهم اجعلنا من أهل الابتسامة.",
    "اللهم اجعلنا من أهل الدعوة إلى الخير.",
    "اللهم اجعلنا من أهل الكرم.",
    "اللهم اجعلنا من أهل السكينة.",
    "اللهم اجعلنا من أهل الجمال.",
    "اللهم اجعلنا من أهل الصدق.",
    "اللهم اجعلنا من أهل النقاء.",
    "اللهم اجعلنا من أهل الرفق.",
    "اللهم اجعلنا من أهل التقوى.",
    "اللهم اجعلنا من أهل الفرح.",
    "اللهم اجعلنا من أهل الرضا.",
    "اللهم اجعلنا من أهل القوة.",
    "اللهم اجعلنا من أهل النور.",
    "اللهم اجعلنا من أهل الإحسان.",
    "اللهم اجعلنا من أهل العلم.",
    "اللهم اجعلنا من أهل التوفيق.",
    "اللهم اجعلنا من أهل المساواة.",
    "اللهم اجعلنا من أهل الفضل.",
    "اللهم اجعلنا من أهل الكمال.",
    "اللهم اجعلنا من أهل السعادة.",
    "اللهم اجعلنا من أهل العطاء.",
    "اللهم اجعلنا من أهل المحبة.",
    "اللهم اجعلنا من أهل التعاون.",
    "اللهم اجعلنا من أهل السكينة.",
    "اللهم اجعلنا من أهل الفداء.",
    "اللهم اجعلنا من أهل التفكر.",
    "اللهم اجعلنا من أهل العدل.",
    "اللهم اجعلنا من أهل الإخلاص.",
    "اللهم اجعلنا من أهل التسليم.",
    "اللهم اجعلنا من أهل القناعة.",
    "اللهم اجعلنا من أهل السلام.",
    "اللهم اجعلنا من أهل الرحمة.",
    "اللهم اجعلنا من أهل التوكل.",
    "اللهم اجعلنا من أهل الرفعة.",
    "اللهم اجعلنا من أهل التجمل.",
    "اللهم اجعلنا من أهل الجمال.",
    "اللهم اجعلنا من أهل الفخر.",
    "اللهم اجعلنا من أهل الاحترام.",
    "اللهم اجعلنا من أهل التقدير.",
    "اللهم اجعلنا من أهل الدعاء.",
    "اللهم اجعلنا من أهل الشرف.",
    "اللهم اجعلنا من أهل الكرامة.",
    "اللهم اجعلنا من أهل الأمان.",
    "اللهم اجعلنا من أهل التحمل.",
    "اللهم اجعلنا من أهل البر.",
    "اللهم اجعلنا من أهل الولاء."
    ];

    function showAzkar() {
      let randomAzkar = azkar[Math.floor(Math.random() * azkar.length)];
      const alertDiv = document.createElement("div");
      alertDiv.className = "alert-message";
      alertDiv.textContent = randomAzkar;
      document.body.appendChild(alertDiv);
      setTimeout(() => { alertDiv.classList.add("show"); }, 100);
      setTimeout(() => { alertDiv.style.display = "none"; }, 5000);
      alertDiv.addEventListener("click", function() {
        alertDiv.style.display = "none";
      });
    }

    setInterval(showAzkar, 60000);
    showAzkar();
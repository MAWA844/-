
  
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
;
  
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
let num1, num2, ans;
let memoryFirstCard = null, memorySecondCard = null;
let memoryLock = false;
let memoryMatches = 0;
const shapes = [
    { name: "دائرة", symbol: "●" },
    { name: "مربع", symbol: "◼" },
    { name: "مثلث", symbol: "▲" },
    { name: "مستطيل", symbol: "▬" }
];
let currentShape;
let matchingShapes = [];
let selectedShapeItem = null;
let selectedNameItem = null;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("app").style.display = "none";

    let isFirstCheck = true;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;

        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            updateUI(user);
        } else {
            if (!isFirstCheck) {
                localStorage.removeItem("isLoggedIn");
                updateUI(null);
            }
        }

        isFirstCheck = false;
    });
    const signupButton = document.getElementById("signupButton");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logout-btn");
    const submitBtn = document.getElementById("submitBtn");
    const optionsDiv = document.getElementById("options");

   
    if (signupButton) {
        signupButton.addEventListener("click", async () => {
            const name = document.getElementById("signupName").value.trim();
        const gender = document.getElementById("signupGender").value;

// احفظ البيانات
       localStorage.setItem('userName', name);
       localStorage.setItem('userGender', gender);
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                currentUser = userCredential.user;
                updateUI(currentUser);
            } catch (error) {
                document.getElementById("signupError").textContent = error.message;
                console.error("خطأ في إنشاء المستخدم:", error);
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", async () => {
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                currentUser = userCredential.user;
                updateUI(currentUser);
            } catch (error) {
                document.getElementById("loginError").textContent = error.message;
                console.error("خطأ في تسجيل الدخول:", error);
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                await signOut(auth);
                currentUser = null;
                updateUI(null);
            } catch (error) {
                console.error("خطأ في تسجيل الخروج:", error);
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", checkAnswer);
    }

    // ربط أزرار الألعاب بالدوال
    if (optionsDiv) {
        const buttons = optionsDiv.querySelectorAll('button');
        if (buttons.length >= 9) {
            buttons[0].addEventListener('click', () => {
    window.location.href = "addition.html";
});
// جمع
buttons[1].addEventListener('click', () => {
    window.location.href = "subtraction.html";
});
buttons[2].addEventListener('click', () => {
    window.location.href = "multiplication.html";
});
buttons[3].addEventListener('click', () => {
    window.location.href = "memory_game.html";
});                       // لعبة الذاكرة
            buttons[4].addEventListener('click', () => {
                window.location.href = "guessing-game.html";
            });
                                                // تخمين الرقم
            buttons[5].addEventListener('click', () => {
                window.location.href = "division.html";
            });       // قسمة
            buttons[6].addEventListener('click', () => {
                window.location.href = "operations.html";
            });                        // ترتيب العمليات
            buttons[7].addEventListener('click', () => {
                window.location.href = "shape-guess.html";
            });                          // تعرف على الأشكال
            buttons[8].addEventListener('click', () => {
                window.location.href = "tawseel_shapes.html";
            });  
            buttons[9].addEventListener('click', () => {
                window.location.href = "settings.html";
            });
            
        }
    }
});

function updateUI(user) {
    if (user) {
      document.getElementById("login-form").style.display = "none";
      document.getElementById("app").style.display = "block";
  
      const name = localStorage.getItem('userName') || 'مستخدم';
      document.getElementById("user-display-name").textContent = name;
      document.getElementById("welcome-msg").textContent = `مرحباً يا ${name} 🌸`;
  
      resetGame(); // عشان الألعاب تظهر صح
    } else {
      document.getElementById("login-form").style.display = "block";
      document.getElementById("app").style.display = "none";
    }
  }
  
function startShapeNameGame() {
    resetGame();
    document.getElementById('userAnswer').style.display = 'block'; // تأكد من عرض حقل الإدخال
    const shapeNameGameDiv = document.getElementById('shape-name-game');
    if (!shapeNameGameDiv) {
        const contentDiv = document.getElementById('content');
        const newShapeNameGameDiv = document.createElement('div');
        newShapeNameGameDiv.id = 'shape-name-game';
        newShapeNameGameDiv.style.textAlign = 'center';
        newShapeNameGameDiv.style.margin = '20px auto';

        const shapeDisplay = document.createElement('div');
        shapeDisplay.id = 'shape-to-identify';
        shapeDisplay.style.fontSize = '5em';
        shapeDisplay.marginBottom = '20px';
        newShapeNameGameDiv.appendChild(shapeDisplay);

        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'shape-name-options';
        newShapeNameGameDiv.appendChild(optionsContainer);

        contentDiv.appendChild(newShapeNameGameDiv);
    } else {
        shapeNameGameDiv.style.display = 'block';
    }

    const availableShapes = [...shapes]; // نسخة من array الأشكال

    const shapeToIdentify = document.getElementById('shape-to-identify');
    const optionsContainer = document.getElementById('shape-name-options');
    optionsContainer.innerHTML = ''; // مسح الخيارات السابقة

    if (availableShapes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableShapes.length);
        currentShape = availableShapes[randomIndex];
        shapeToIdentify.textContent = currentShape.symbol;

        // إنشاء خيارات عشوائية (الإجابة الصحيحة وثلاثة خيارات خاطئة)
        const options = [currentShape];
        while (options.length < 4) {
            const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
            if (!options.some(shape => shape.name === randomShape.name)) {
                options.push(randomShape);
            }
        }

        // ترتيب الخيارات بشكل عشوائي
        options.sort(() => Math.random() - 0.5);

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.name;
            button.classList.add('shape-option-button');
            button.addEventListener('click', () => checkShapeNameAnswer(option.name));
            optionsContainer.appendChild(button);
        });
    } else {
        shapeToIdentify.textContent = 'لا توجد أشكال متاحة.';
    }
}

function checkShapeNameAnswer(selectedAnswer) {
    console.log('checkShapeNameAnswer called with:', selectedAnswer);
    const resultElem = document.getElementById('result');
    resultElem.style.direction = 'rtl';
    console.log('currentShape in checkAnswer:', currentShape);
    if (currentShape && selectedAnswer === currentShape.name) {
        resultElem.textContent = 'إجابة صحيحة! 👍';
        resultElem.style.color = 'green';
    } else if (currentShape) {
        resultElem.textContent = `إجابة خاطئة. الإجابة الصحيحة هي ${currentShape.name}. 💔`;
        resultElem.style.color = 'red';
    } else {
        resultElem.textContent = 'حدث خطأ.';
        resultElem.style.color = 'orange';
    }

    // يمكنك إضافة منطق هنا للانتقال إلى شكل آخر بعد الإجابة
    setTimeout(startShapeNameGame, 1500); // عرض شكل جديد بعد 1.5 ثانية
}
function resetGame() {
    // إخفاء السؤال وزرار التحقق عند بداية أي لعبة
const question = document.getElementById("question");
const checkBtn = document.getElementById("submitBtn");
if (question) question.textContent = "";
if (checkBtn) checkBtn.style.display = "none";
    const questionElem = document.getElementById('question');
    const resultElem = document.getElementById('result');
    const userAnswerElem = document.getElementById('userAnswer');
    const memoryBoard = document.getElementById('memory-board');
    const shapeNameGame = document.getElementById('shape-name-game');
    const shapeMatchingGame = document.getElementById('shape-matching-game');
    const contentDiv = document.getElementById('content');
    const shapeNameOptions = document.getElementById('shape-name-options');
    const shapeToIdentify = document.getElementById('shape-to-identify');
    const matchingArea = document.getElementById('matching-area');
    const namesArea = document.getElementById('names-area');
    const checkMatchingButton = document.getElementById('check-matching');
    const matchingResult = document.getElementById('matching-result');

    if (questionElem) questionElem.textContent = '';
    if (resultElem) resultElem.textContent = '';
    // حذف العنصر القديم
const oldElem = document.getElementById('userAnswer');
if (oldElem) oldElem.remove();

// إنشاء input جديد
const input = document.createElement("input");
input.type = "text";
input.id = "userAnswer";
input.placeholder = "اكتب الإجابة هنا";
input.style.padding = "12px";
input.style.fontSize = "16px";
input.style.border = "1px solid #ddd";
input.style.borderRadius = "8px";
input.style.margin = "15px auto";
input.style.display = "block";
input.style.textAlign = "center";
input.inputMode = "numeric";

input.addEventListener('input', () => {
    let onlyNumbers = input.value.replace(/[^\d٠-٩]/g, '');
    input.value = convertToArabicNumbers(onlyNumbers);
});

// إضافة العنصر لمكانه
if (contentDiv) {
    contentDiv.appendChild(input);
}

    if (memoryBoard && memoryBoard.parentNode) memoryBoard.parentNode.removeChild(memoryBoard);
    if (shapeNameGame) shapeNameGame.style.display = 'none';
    if (shapeMatchingGame) shapeMatchingGame.style.display = 'none';
    if (contentDiv) contentDiv.style.display = 'block';
    if (shapeNameOptions) shapeNameOptions.innerHTML = '';
    if (shapeToIdentify) shapeToIdentify.textContent = '';
    if (matchingArea) matchingArea.innerHTML = '';
    if (namesArea) namesArea.innerHTML = '';
    if (checkMatchingButton) checkMatchingButton.onclick = null;
    if (matchingResult) matchingResult.textContent = '';

    memoryFirstCard = null;
    memorySecondCard = null;
    memoryLock = false;
    memoryMatches = 0;
    matchingShapes = [];
    selectedShapeItem = null;
    selectedNameItem = null;
}

function convertToArabicNumbers(number) {
    const arabicNumbers = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(number).replace(/\d/g, d => arabicNumbers[d]);
}
const convertToEnglishNumbers = str => str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
function checkAnswer() {
    const userAnswerElement = document.getElementById("userAnswer");
    console.log("User Answer Element Value:", userAnswerElement.value); // أضف هذا السطر
    let userAnswer = parseInt(convertToEnglishNumbers(userAnswerElement.value));
    console.log("Parsed User Answer:", userAnswer); // أضف هذا السطر
    const resultElem = document.getElementById("result");
    resultElem.style.direction = 'rtl';
    console.log("Correct Answer (ans) in checkAnswer:", ans); // أضف هذا السطر

    if (!isNaN(userAnswer)) {
        if (userAnswer === ans) {
            resultElem.textContent = "👌 إجابة صحيحة!";
            resultElem.style.color = "green";
        } else {
            resultElem.textContent = `إجابة خاطئة. الإجابة الصحيحة هي ${convertToArabicNumbers(ans)}.`;
            resultElem.style.color = "red";
        }
    } else {
        resultElem.textContent = "الرجاء كتابة الإجابة.";
        resultElem.style.color = "orange";
    }
}
function generateQuestion(operation) {
    console.log(`generateQuestion called with operation: ${operation}`);
    resetGame();
    console.log('resetGame() called');
    const questionElem = document.getElementById("question");
    questionElem.style.direction = 'rtl';
    let option1, option2, option3;
     num1, num2, ans;
    switch (operation) {
        case 'addition':
            num1 = Math.floor(Math.random() * 10);
            num2 = Math.floor(Math.random() * 10);
            ans = num1 + num2;
            console.log("Generated ans:", ans);
            questionElem.textContent = `احسب: ${convertToArabicNumbers(num1)} + ${convertToArabicNumbers(num2)} = ؟`;

            option1 = ans + Math.floor(Math.random() * 3) - 1;
            option2 = ans + Math.floor(Math.random() * 5) - 2;
            option3 = ans + Math.floor(Math.random() * 7) - 3;
            document.getElementById("submitBtn").style.display = "block";
            break;
           
        case 'subtraction':
            num1 = Math.floor(Math.random() * 10);
            num2 = Math.floor(Math.random() * 10);
            if (num2 > num1) [num1, num2] = [num2, num1];
            ans = num1 - num2;
            console.log("Generated ans:", ans);
            questionElem.textContent = `احسب: ${convertToArabicNumbers(num1)} - ${convertToArabicNumbers(num2)} = ؟`;
            option1 = ans + Math.floor(Math.random() * 3) - 1;
            option2 = ans + Math.floor(Math.random() * 5) - 2;
            option3 = ans + Math.floor(Math.random() * 7) - 3;
            break;
        case 'multiplication':
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
            ans = num1 * num2;
            console.log("Generated ans:", ans);
            questionElem.textContent = `احسب: ${convertToArabicNumbers(num1)} × ${convertToArabicNumbers(num2)} = ؟`;
            option1 = ans + Math.floor(Math.random() * 5) - 2;
            option2 = ans + Math.floor(Math.random() * 7) - 3;
            option3 = ans + Math.floor(Math.random() * 9) - 4;
            break;
            case 'division':
    // نختار الإجابة (الناتج) أولاً لضمان أن القسمة ستكون بدون باقي
    ans = Math.floor(Math.random() * 10) + 1; // ناتج القسمة سيكون بين 1 و 10

    // نختار القاسم بشكل عشوائي
    const divisor = Math.floor(Math.random() * 9) + 1; // القاسم سيكون بين 1 و 9

    // نحسب المقسوم بضرب الناتج في القاسم
    num1 = ans * divisor;

    // القاسم هو الرقم الثاني في عملية القسمة
    num2 = divisor;

    questionElem.textContent = `احسب: ${convertToArabicNumbers(num1)} ÷ ${convertToArabicNumbers(num2)} = ؟`;

    // إنشاء خيارات إجابة أخرى (تأكد من اختلافها عن الإجابة الصحيحة)
    option1 = ans + Math.floor(Math.random() * 3) - 1;
    while (option1 === ans) {
        option1 = ans + Math.floor(Math.random() * 3) - 1;
    }
    option2 = ans + Math.floor(Math.random() * 4) - 2;
    while (option2 === ans || option2 === option1) {
        option2 = ans + Math.floor(Math.random() * 4) - 2;
    }
    option3 = ans + Math.floor(Math.random() * 5) - 3;
    while (option3 === ans || option3 === option1 || option3 === option2) {
        option3 = ans + Math.floor(Math.random() * 5) - 3;
    }
    break;}}
function startGame() {
        resetGame();
        document.getElementById("question").style.direction = 'rtl';
        ans = Math.floor(Math.random() * 1000) + 1; // 👈 بدل 10 خليناه 1000
        document.getElementById("question").textContent = `خمن الرقم بين ${convertToArabicNumbers(1)} و ${convertToArabicNumbers(1000)}.`;
    
        // احذف الـ input القديم لو موجود
        const oldInput = document.getElementById("userAnswer");
        if (oldInput) oldInput.remove();
    
        // اعمل input جديد
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.id = 'userAnswer';
        newInput.placeholder = "اكتب رقمًا بين ١ و ١٠٠٠";
        newInput.style.padding = "12px";
        newInput.style.fontSize = "16px";
        newInput.style.border = "1px solid #ddd";
        newInput.style.borderRadius = "8px";
        newInput.style.margin = "15px auto";
        newInput.style.display = "block";
        newInput.style.textAlign = "center";
        newInput.inputMode = "numeric";
    
        // تحويل تلقائي للعربي
        newInput.addEventListener('input', () => {
            let onlyNumbers = newInput.value.replace(/[^\d٠-٩]/g, '');
            if (onlyNumbers.length > 4) {
                onlyNumbers = onlyNumbers.slice(0, 4); // 4 أرقام فقط
            }
            newInput.value = convertToArabicNumbers(onlyNumbers);
        });
    
        // أضفه في الـ content
        const content = document.getElementById("content");
        content.appendChild(newInput);
    }
    

let memoryCardCount = 4; // أول مستوى: 2 أزواج (4 كروت)

function startMemoryGame() {
    resetGame();
    document.getElementById('userAnswer').style.display = 'none';
    const questionElem = document.getElementById('question');
    questionElem.style.direction = '';
    const resultElem = document.getElementById('result');
    resultElem.style.direction = 'rtl';
    questionElem.textContent = 'طابق البطاقات المتشابهة';
    resultElem.textContent = '';
    memoryFirstCard = null;
    memorySecondCard = null;
    memoryMatches = 0;
    memoryLock = false;

    const values = generateValuesForLevel(memoryCardCount / 2); // 🆕

    const board = document.createElement('div');
    board.id = 'memory-board';
    document.getElementById('content').appendChild(board);

    values.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = value;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = convertToArabicNumbers(value);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        board.appendChild(card);
    });
}

// 🆕 دالة توليد القيم حسب المستوى
function generateValuesForLevel(pairCount) {
    const values = [];
    for (let i = 1; i <= pairCount; i++) {
        values.push(i, i); // زوجين من كل رقم
    }
    return values.sort(() => Math.random() - 0.5);
}

function flipCard() {
    if (memoryLock || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');

    if (!memoryFirstCard) {
        memoryFirstCard = this;
        return;
    }

    memorySecondCard = this;
    memoryLock = true;

    if (memoryFirstCard.dataset.value === memorySecondCard.dataset.value) {
        memoryCardsMatch();
    } else {
        unflipCards();
    }
}

function memoryCardsMatch() {
    memoryFirstCard.classList.add('matched');
    memorySecondCard.classList.add('matched');
    memoryFirstCard.removeEventListener('click', flipCard);
    memorySecondCard.removeEventListener('click', flipCard);
    resetMemoryGameVars();
    memoryMatches++;

    const totalPairs = memoryCardCount / 2;
    if (memoryMatches === totalPairs) {
        document.getElementById('result').textContent = 'أحسنت! لقد طابقت جميع البطاقات. سيتم زيادة التحدي!';
        memoryCardCount += 2; // زوّدي الكروت بعد الفوز
        setTimeout(() => startMemoryGame(), 1500);
    }
}

function unflipCards() {
    setTimeout(() => {
        memoryFirstCard.classList.remove('flipped');
        memorySecondCard.classList.remove('flipped');
        resetMemoryGameVars();
    }, 1000);
}

function resetMemoryGameVars() {
    memoryFirstCard = null;
    memorySecondCard = null;
    memoryLock = false;
}function startOperationsGame() {
    resetGame();
    const questionElem = document.getElementById("question");
    questionElem.style.direction = 'rtl';
    const select = document.getElementById("userAnswer");
    select.type = 'select-one';
    select.innerHTML = `<option value="">اختر الإجابة</option>`;
    select.style.direction = 'rtl';

    let a = Math.floor(Math.random() * 5) + 1;
    let b = Math.floor(Math.random() * 5) + 1;
    let c = Math.floor(Math.random() * 5) + 1;

    const operationType = Math.random() < 0.5 ? 'addMultiply' : 'subtractMultiply';

    if (operationType === 'addMultiply') {
        questionElem.textContent = `احسب: ${convertToArabicNumbers(a)} + ${convertToArabicNumbers(b)} × ${convertToArabicNumbers(c)} = ?`;
        ans = a + (b * c);
    } else {
        questionElem.textContent = `احسب: ${convertToArabicNumbers(a)} - ${convertToArabicNumbers(b)} × ${convertToArabicNumbers(c)} = ?`;
        ans = a - (b * c);
    }}
    
              function startShapeMatchingGame() {
                // امسحي أي خطوط توصيل قديمة
document.querySelectorAll('.connection-line').forEach(line => line.remove());
        resetGame();
        document.getElementById('userAnswer').style.display = 'none';
        const shapeMatchingGameDiv = document.getElementById('shape-matching-game');
        if (!shapeMatchingGameDiv) {
            const contentDiv = document.getElementById('content');
            const newShapeMatchingGameDiv = document.createElement('div');
            newShapeMatchingGameDiv.id = 'shape-matching-game';
            newShapeMatchingGameDiv.style.display = 'flex';
            newShapeMatchingGameDiv.style.flexDirection = 'column';
            newShapeMatchingGameDiv.style.alignItems = 'center';
            newShapeMatchingGameDiv.style.margin = '20px auto';
    
            const matchingContainerDiv = document.createElement('div');
            matchingContainerDiv.id = 'matching-container';
            matchingContainerDiv.style.display = 'flex';
            matchingContainerDiv.style.gap = '30px'; // مسافة بين العمودين
            matchingContainerDiv.style.marginBottom = '20px';
            newShapeMatchingGameDiv.appendChild(matchingContainerDiv);
    
            const matchingAreaDiv = document.createElement('div');
            matchingAreaDiv.id = 'matching-area';
            matchingAreaDiv.style.display = 'flex';
            matchingAreaDiv.style.flexDirection = 'column'; // العناصر عمودية
            matchingAreaDiv.style.alignItems = 'flex-end'; // محاذاة لليمين
            matchingContainerDiv.appendChild(matchingAreaDiv);
    
            const namesAreaDiv = document.createElement('div');
            namesAreaDiv.id = 'names-area';
            namesAreaDiv.style.display = 'flex';
            namesAreaDiv.style.flexDirection = 'column'; // العناصر عمودية
            namesAreaDiv.style.alignItems = 'flex-start'; // محاذاة لليسار
            matchingContainerDiv.appendChild(namesAreaDiv);
    
            const checkButton = document.createElement('button');
            checkButton.id = 'check-matching';
            checkButton.textContent = 'تحقق من التوصيل';
            newShapeMatchingGameDiv.appendChild(checkButton);
    
            const resultParagraph = document.createElement('p');
            resultParagraph.id = 'matching-result';
            resultParagraph.style.marginTop = '10px';
            newShapeMatchingGameDiv.appendChild(resultParagraph);
    
            contentDiv.appendChild(newShapeMatchingGameDiv);
        } else {
            shapeMatchingGameDiv.style.display = 'flex';
        }
    
        matchingShapes = [];
        const availableShapes = [];
        shapes.forEach(shape => {
            availableShapes.push({ ...shape, type: 'symbol' });
            availableShapes.push({ ...shape, type: 'name' });
        });
        availableShapes.sort(() => Math.random() - 0.5);
        const matchingArea = document.getElementById('matching-area');
        const namesArea = document.getElementById('names-area');
        matchingArea.innerHTML = '';
        namesArea.innerHTML = '';
        selectedShapeItem = null;
        selectedNameItem = null;
        const matchingResult = document.getElementById('matching-result');
        matchingResult.textContent = '';
        console.log('startShapeMatchingGame called'); // كونسول
        availableShapes.forEach((shape, index) => {
            const colorClass = `color${shapes.findIndex(s => s.name === shape.name)}`;
        
            const item = document.createElement('div');
            item.textContent = shape.type === 'symbol' ? shape.symbol : shape.name;
            item.classList.add(
                shape.type === 'symbol' ? 'matching-shape-item' : 'matching-name-item',
                colorClass
            );
            item.dataset.shape = shape.name;
        
            if (shape.type === 'symbol') {
                item.addEventListener('click', selectShapeToMatch);
                matchingArea.appendChild(item);
            } else {
                item.addEventListener('click', selectNameToMatch);
                namesArea.appendChild(item);
            }
        });
        
          
    }
        
        function selectShapeToMatch() {
            if (selectedShapeItem) {
                selectedShapeItem.classList.remove('selected');
            }
            this.classList.add('selected');
            selectedShapeItem = this;
            checkIfBothSelected();
        }
        
        function selectNameToMatch() {
            if (selectedNameItem) {
                selectedNameItem.classList.remove('selected');
            }
            this.classList.add('selected');
            selectedNameItem = this;
            checkIfBothSelected();
        }
        
        function checkIfBothSelected() {
            if (selectedShapeItem && selectedNameItem) {
                drawLineBetween(selectedShapeItem, selectedNameItem);
        
                matchingShapes.push({
                    shape: selectedShapeItem.dataset.shape,
                    name: selectedNameItem.dataset.shape
                });
        
                selectedShapeItem.classList.add('matched');
                selectedNameItem.classList.add('matched');
                selectedShapeItem.onclick = null;
                selectedNameItem.onclick = null;
                selectedShapeItem = null;
                selectedNameItem = null;
            }
        }
        
    
    function checkMatching() {
        const matchingResult = document.getElementById('matching-result');
        let correctMatches = 0;
        matchingShapes.forEach(match => {
            if (match.shape === match.name) {
                correctMatches++;
            }
        });
    
        if (correctMatches === shapes.length) {
            matchingResult.textContent = `أحسنت! جميع الأشكال متطابقة بشكل صحيح. (${convertToArabicNumbers(correctMatches)} من ${convertToArabicNumbers(shapes.length)})`;
            matchingResult.style.color = 'green';
        } else {
            matchingResult.textContent = `لديك ${convertToArabicNumbers(correctMatches)} تطابقات صحيحة من ${convertToArabicNumbers(shapes.length)}. حاول مرة أخرى.`;
            matchingResult.style.color = 'red';
        }
    }
    function drawLineBetween(elem1, elem2) {
        const container = document.getElementById('content');
        const line = document.createElement('div');
        line.classList.add('connection-line');
    
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
    
        const x1 = rect1.left + rect1.width / 2 + window.scrollX;
        const y1 = rect1.top + rect1.height / 2 + window.scrollY;
        const x2 = rect2.left + rect2.width / 2 + window.scrollX;
        const y2 = rect2.top + rect2.height / 2 + window.scrollY;
    
        const length = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.top = `${y1}px`;
        line.style.left = `${x1}px`;
    
        container.appendChild(line);
        const checkMatchingButton = document.getElementById('check-matching');
if (checkMatchingButton) {
    checkMatchingButton.onclick = checkMatching;
}
    }
    
// الأذكار/التذكير التي سيتم عرضها
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

// دالة لعرض التنبيه
function showAzkar() {
    // اختيار تذكير عشوائي من الأذكار
    let randomAzkar = azkar[Math.floor(Math.random() * azkar.length)];

    // إنشاء عنصر div جديد للإشعار
    const alertDiv = document.createElement("div");

    // إضافة الكلاس المناسب للإشعار
    alertDiv.className = "alert-message";

    // إضافة النص للإشعار
    alertDiv.textContent = randomAzkar;

    // إضافة الإشعار داخل الـ body
    document.body.appendChild(alertDiv);

    // إضافة كلاس "show" لعرض الإشعار
    setTimeout(() => {
        alertDiv.classList.add("show");
    }, 100);

    // إخفاء الإشعار بعد 5 ثواني
    setTimeout(() => {
        alertDiv.style.display = "none";  // إخفاء الإشعار بعد 5 ثواني
    }, 5000);

    // إضافة حدث لإخفاء الإشعار عند الضغط عليه
    alertDiv.addEventListener("click", function() {
        alertDiv.style.display = "none";  // إخفاء الإشعار عند الضغط عليه
    });
}
setInterval(showAzkar, 60000);


  // عرض التنبيه لأول مرة
  showAzkar();
 
// دالة لعرض الرسالة عند الضغط على زر
// دالة لعرض التنبيه عند الضغط على الزر
// دالة لعرض التنبيه عند الضغط على الزر
// دالة لعرض التنبيه عند الضغط على الزر
function showMessage() {
    // إنشاء عنصر div جديد
    const alertDiv = document.createElement("div");

    // إضافة الكلاس المناسب للرسالة
    alertDiv.className = "alert-message";

    // إضافة النص للرسالة
    alertDiv.textContent = "اتمنى 💖 لكم التفوق والسعادة";

    // إضافة الرسالة داخل الـ body
    document.body.appendChild(alertDiv);

    // إضافة حدث للضغط على الرسالة لإخفائها
    alertDiv.addEventListener("click", function() {
        alertDiv.style.display = "none";  // إخفاء الرسالة عند الضغط عليها
    });
}

// إضافة مستمع الحدث للزرار
document.getElementById("showAlertBtn").addEventListener("click", showMessage);


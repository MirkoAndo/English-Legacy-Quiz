let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Carica le domande dal file JSON esterno
async function loadQuestionsData() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

// Navigazione tra schermi
function goTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if(screenId === 'quiz' && currentQuestionIndex === 0) {
        if(questions.length === 0) {
            loadQuestionsData().then(() => loadQuestion());
        } else {
            loadQuestion();
        }
    }
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('q-text').innerText = q.text;
    document.getElementById('q-icon').innerText = q.icon;
    document.getElementById('feedback-msg').innerText = "";
    document.getElementById('next-btn').style.display = 'none';

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-option';
        btn.innerText = opt.text;
        btn.onclick = () => checkAnswer(btn, opt.correct);
        container.appendChild(btn);
    });
}

function checkAnswer(btn, isCorrect) {
    const allBtns = document.querySelectorAll('.btn-option');
    allBtns.forEach(b => b.disabled = true);

    if(isCorrect) {
        btn.classList.add('correct');
        document.getElementById('feedback-msg').innerText = "Correct! Good job 👏";
        document.getElementById('feedback-msg').style.color = "#27ae60";
        score++;
    } else {
        btn.classList.add('wrong');
        document.getElementById('feedback-msg').innerText = "Wrong answer ⚠️";
        document.getElementById('feedback-msg').style.color = "#c0392b";
    }
    document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('final-score').innerText = `${score} / ${questions.length}`;
    goTo('end');
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    goTo('menu');
}

// Pre-carica i dati all'avvio
loadQuestionsData();
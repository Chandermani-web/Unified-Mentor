// Quiz data with 7 questions
const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Text Modern Language",
    ],
    correct: 0,
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    correct: 2,
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<script>", "<js>", "<javascript>", "<code>"],
    correct: 0,
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Mozilla", "Netscape", "Google", "Microsoft"],
    correct: 1,
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "/* */", "<!-- -->", "#"],
    correct: 0,
  },
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: [
      "var myVariable = 5;",
      "variable myVariable = 5;",
      "v myVariable = 5;",
      "declare myVariable = 5;",
    ],
    correct: 0,
  },
  {
    question: "Which method is used to add an element to the end of an array?",
    options: ["push()", "add()", "append()", "insert()"],
    correct: 0,
  },
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let userAnswers = [];

// DOM elements
const questionContainer = document.getElementById("questionContainer");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const timer = document.getElementById("timer");
const timeLeftElement = document.getElementById("timeLeft");
const progressFill = document.getElementById("progressFill");
const quizForm = document.getElementById("quizForm");
const quizComplete = document.getElementById("quizComplete");
const resultContainer = document.getElementById("resultContainer");
const scoreDisplay = document.getElementById("scoreDisplay");
const scoreMessage = document.getElementById("scoreMessage");
const restartBtn = document.getElementById("restartBtn");

// Initialize quiz
function initQuiz() {
  currentQuestion = 0;
  score = 0;
  timeLeft = 30;
  userAnswers = [];

  quizForm.classList.remove("hide");
  quizComplete.classList.remove("show");
  resultContainer.classList.remove("show");

  loadQuestion();
  startTimer();
  updateProgress();
}

// Load current question
function loadQuestion() {
  const question = quizData[currentQuestion];

  questionNumber.textContent = `Question ${currentQuestion + 1} of ${
    quizData.length
  }`;
  questionText.textContent = question.question;

  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;
    input.id = `option${index}`;

    const label = document.createElement("label");
    label.className = "option-label";
    label.htmlFor = `option${index}`;
    label.textContent = option;

    optionElement.appendChild(input);
    optionElement.appendChild(label);
    optionsContainer.appendChild(optionElement);
  });

  // Update button visibility
  if (currentQuestion === quizData.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
  } else {
    nextBtn.style.display = "block";
    submitBtn.style.display = "none";
  }

  nextBtn.disabled = true;
  submitBtn.disabled = true;
}

// Start timer
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (currentQuestion < quizData.length - 1) {
        nextQuestion();
      } else {
        submitQuiz();
      }
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  timeLeftElement.textContent = timeLeft;

  // Update timer styling based on time left
  timer.className = "timer";
  if (timeLeft <= 10) {
    timer.classList.add("danger");
  } else if (timeLeft <= 15) {
    timer.classList.add("warning");
  }
}

// Update progress bar
function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  progressFill.style.width = `${progress}%`;
}

// Handle option selection
function handleOptionSelect() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    nextBtn.disabled = false;
    submitBtn.disabled = false;
  }
}

// Move to next question
function nextQuestion() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    userAnswers[currentQuestion] = parseInt(selectedOption.value);
  } else {
    userAnswers[currentQuestion] = -1; // No answer selected
  }

  currentQuestion++;
  loadQuestion();
  startTimer();
  updateProgress();
}

// Submit quiz
function submitQuiz() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    userAnswers[currentQuestion] = parseInt(selectedOption.value);
  } else {
    userAnswers[currentQuestion] = -1; // No answer selected
  }

  clearInterval(timerInterval);
  calculateScore();
  showResults();
}

// Calculate final score
function calculateScore() {
  score = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizData[index].correct) {
      score++;
    }
  });
}

// Show results
function showResults() {
  quizForm.classList.add("hide");
  quizComplete.classList.add("show");
  resultContainer.classList.add("show");

  scoreDisplay.textContent = `${score}/${quizData.length}`;

  const percentage = Math.round((score / quizData.length) * 100);
  let message = "";

  if (percentage >= 90) {
    message = "Outstanding! You have excellent knowledge! 🌟";
  } else if (percentage >= 80) {
    message = "Great job! You have very good knowledge! 👏";
  } else if (percentage >= 70) {
    message = "Good work! You have solid knowledge! 👍";
  } else if (percentage >= 60) {
    message = "Not bad! Keep studying to improve! 📚";
  } else {
    message = "Keep practicing! You can do better! 💪";
  }

  scoreMessage.textContent = message;
}

// Restart quiz
function restartQuiz() {
  initQuiz();
}

// Event listeners
optionsContainer.addEventListener("change", handleOptionSelect);
nextBtn.addEventListener("click", nextQuestion);
submitBtn.addEventListener("click", submitQuiz);
restartBtn.addEventListener("click", restartQuiz);

// Initialize quiz when page loads
document.addEventListener("DOMContentLoaded", initQuiz);

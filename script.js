let fontSize = 100;
let highContrast = false;
let currentQuizQuestion = 0;
let quizScore = 0;
let selectedAnswer = null;

// Quiz questions
const quizQuestions = [
  {
    question: "Qual material NÃO deve ser usado na compostagem doméstica?",
    options: [
      "Cascas de frutas",
      "Restos de carne",
      "Folhas secas",
      "Borra de café",
    ],
    correct: 1,
  },
  {
    question: "Qual planta é ideal para iniciantes em hortas urbanas?",
    options: ["Cenoura", "Alface", "Abacate", "Maçã"],
    correct: 1,
  },
  {
    question: "Qual é a melhor forma de economizar água na horta?",
    options: [
      "Regar ao meio-dia",
      "Usar aspersores",
      "Usar cobertura morta (mulch)",
      "Regar diariamente",
    ],
    correct: 2,
  },
];

// Funções de Acessibilidade
function increaseFontSize() {
  if (fontSize < 150) {
    fontSize += 10;
    document.documentElement.style.fontSize = fontSize + "%";
  }
}

function decreaseFontSize() {
  if (fontSize > 80) {
    fontSize -= 10;
    document.documentElement.style.fontSize = fontSize + "%";
  }
}

function toggleHighContrast() {
  highContrast = !highContrast;
  if (highContrast) {
    document.body.classList.add("high-contrast");
  } else {
    document.body.classList.remove("high-contrast");
  }
}

// Calculadora de Água
function calculateWater() {
  const roofArea = Number.parseFloat(document.getElementById("roofArea").value);
  const rainfall = Number.parseFloat(document.getElementById("rainfall").value);

  if (!roofArea || !rainfall) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Fórmula: Volume (L) = Área (m²) × Precipitação (mm) × 0.8 (coeficiente de runoff)
  const volume = Math.round(roofArea * rainfall * 0.8);
  const savings = Math.round((volume / 1000) * 5 * 100) / 100;

  document.getElementById("waterVolume").textContent = volume + " litros";
  document.getElementById(
    "waterSavings"
  ).textContent = `Economia estimada: R$ ${savings} por mês`;
  document.getElementById("waterResult").style.display = "block";
}

// Quiz
function loadQuizQuestion() {
  const question = quizQuestions[currentQuizQuestion];
  document.getElementById("questionNumber").textContent =
    currentQuizQuestion + 1;
  document.getElementById("questionText").textContent = question.question;

  const optionsContainer = document.getElementById("quizOptions");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "quiz-option border rounded p-3 mb-2";
    optionDiv.innerHTML = `
            <input type="radio" name="quizOption" value="${index}" id="option${index}" class="me-2">
            <label for="option${index}" class="w-100 cursor-pointer">${option}</label>
        `;
    optionDiv.addEventListener("click", () => selectQuizOption(index));
    optionsContainer.appendChild(optionDiv);
  });

  document.getElementById("quizButton").textContent = "Responder";
  document.getElementById("quizButton").disabled = true;
}

function selectQuizOption(index) {
  selectedAnswer = index;

  // Remove previous selections
  document.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // Add selection to clicked option
  document.querySelectorAll(".quiz-option")[index].classList.add("selected");
  document.getElementById(`option${index}`).checked = true;

  document.getElementById("quizButton").disabled = false;
}

function handleQuizAction() {
  const button = document.getElementById("quizButton");

  if (button.textContent === "Responder") {
    showQuizAnswer();
  } else if (button.textContent === "Próxima Pergunta") {
    nextQuizQuestion();
  } else if (button.textContent === "Ver Resultado") {
    showQuizResult();
  }
}

function showQuizAnswer() {
  const correctAnswer = quizQuestions[currentQuizQuestion].correct;
  const options = document.querySelectorAll(".quiz-option");

  // Show correct and incorrect answers
  options.forEach((option, index) => {
    if (index === correctAnswer) {
      option.classList.add("correct");
      option.innerHTML +=
        ' <i class="bi bi-check-circle-fill text-success"></i>';
    } else if (index === selectedAnswer && index !== correctAnswer) {
      option.classList.add("incorrect");
      option.innerHTML += ' <i class="bi bi-x-circle-fill text-danger"></i>';
    }
  });

  // Update
  if (selectedAnswer === correctAnswer) {
    quizScore++;
  }

  // Update button
  const button = document.getElementById("quizButton");
  if (currentQuizQuestion < quizQuestions.length - 1) {
    button.textContent = "Próxima Pergunta";
  } else {
    button.textContent = "Ver Resultado";
  }
}

function nextQuizQuestion() {
  currentQuizQuestion++;
  selectedAnswer = null;
  loadQuizQuestion();
}

function showQuizResult() {
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("quizResult").style.display = "block";

  document.getElementById("finalScore").textContent = quizScore;

  const messageElement = document.getElementById("scoreMessage");
  if (quizScore === quizQuestions.length) {
    messageElement.textContent =
      "Parabéns! Você é um especialista em sustentabilidade!";
  } else {
    messageElement.textContent =
      "Continue aprendendo sobre práticas sustentáveis!";
  }
}

function resetQuiz() {
  currentQuizQuestion = 0;
  quizScore = 0;
  selectedAnswer = null;

  document.getElementById("quizContainer").style.display = "block";
  document.getElementById("quizResult").style.display = "none";

  loadQuizQuestion();
}

// Form
function handleContactForm(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Simulate
  alert(
    `Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.`
  );

  // Reset form
  document.getElementById("contactForm").reset();
}

// Smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  // Load first quiz question
  loadQuizQuestion();

  // Initialize smooth scrolling
  initSmoothScrolling();

  // Add form submission handler
  document
    .getElementById("contactForm")
    .addEventListener("submit", handleContactForm);

  // Auto-start carousel
  const testimonialCarousel = document.getElementById("testimonialCarousel");
  if (testimonialCarousel) {
    const carousel = new bootstrap.Carousel(testimonialCarousel, {
      interval: 5000,
      wrap: true,
    });
  }

  console.log("fufando");
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shadow-sm");
  } else {
    navbar.classList.remove("shadow-sm");
  }
});

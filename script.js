// JavaScript for Math Game
const timerSound = new Audio("tick.mp3");
const incorrectSound = new Audio("error_sound.mp3");

// Initialize game variables
let timer;
let score = 0;
let currentQuestion;

window.onload = function () {
  score = -1; // -1 para que ponga un mensaje inicial
  endGame();
};

let maxNumber; // Variable global para controlar el número máximo en las preguntas
let minNumber; // Variable global para controlar el número mínimo en las preguntas
let timerDuration; // Duración del temporizador en segundos
let remainingTime = timerDuration; // Tiempo restante
let lives; // Número inicial de vidas
let num1 = 0;
let num2 = 0;

function generateQuestion() {
  let lastNum1 = num1;
  let lastNum2 = num2;
  // Generar dos números aleatorios entre 1 y maxNumber
  num1 = Math.floor(Math.random() * maxNumber) + minNumber;
  while (num1 === lastNum1) {
    num1 = Math.floor(Math.random() * maxNumber) + minNumber;
  }
  num2 = Math.floor(Math.random() * maxNumber) + minNumber;
  while (num2 === lastNum2) {
    num2 = Math.floor(Math.random() * maxNumber) + minNumber;
  }
  // Elegir entre suma y multiplicación
  const operation = Math.random() > 0.5 ? "+" : "*";
  currentQuestion = operation === "+" ? num1 + num2 : num1 * num2;
  // Actualizar el área de la pregunta con la nueva pregunta
  const questionArea = document.getElementById("questionArea");
  if(operation === "+") {
    if(num2 >= 0) questionArea.textContent = `Calcula ${num1} + ${num2}`;
    else questionArea.textContent = `Calcula ${num1} ${num2}`;
    } 
  else questionArea.textContent = `Calcula (${num1})(${num2})`;

  // Agregar llamada a función para mostrar soldados
  if (operation == "+") displaySSoldiers(num1, num2);
  else displayMSoldiers(num1, num2);
}

function handleInput(input) {
  if (input === currentQuestion) {
    // Comprobar si la respuesta del usuario es correcta
    score++; // Aumentar la puntuación
    if (score % 3 === 0) {
      // cada 3 respuestas correctas aumentar la dificultad
      timerDuration--;
    }
    updateMetrics();
    generateQuestion(); // Generar una nueva pregunta y reiniciar el temporizador
    remainingTime = timerDuration;
  } else {
    lives--; // Restar una vida si la respuesta es incorrecta
    incorrectSound.play();
    updateMetrics();
    if (lives <= 0) {
      // Comprobar si quedan vidas
      endGame(); // Terminar el juego si no quedan vidas
    } else {
      // Opcional: Generar una nueva pregunta y reiniciar el temporizador
      generateQuestion();
      remainingTime = timerDuration;
    }
  }
}

function updateTimer() {
  const timerArea = document.getElementById("timerArea");
  timerArea.textContent = `Tiempo restante: ${remainingTime}s`; // Actualizar el área del temporizador
  if (remainingTime <= 0) {
    // Verificar si el tiempo se ha agotado
    lives--; // Restar una vida
    updateMetrics();
    if (lives <= 0) {
      // Comprobar si quedan vidas
      endGame(); // Terminar el juego si no quedan vidas
    } else {
      // Generar una nueva pregunta y reiniciar el temporizador
      generateQuestion();
      remainingTime = timerDuration;
    }
  }
  remainingTime--; // Disminuir el tiempo restante
  timerSound.play();
}

function startGame() {
  // Reiniciar todas las variables del juego
  score = 0;
  lives = 3;
  maxNumber = 20;
  minNumber = -10;
  timerDuration = 22;
  remainingTime = timerDuration;
  // Limpiar los mensajes y el área de estado
  const statusArea = document.getElementById("statusArea");
  statusArea.innerHTML = "";
  const userInput = document.getElementById("userInput");
  userInput.value = "";
  // Iniciar el temporizador
  timer = setInterval(updateTimer, 1000); // Llama a updateTimer cada segundo
  // Generar la primera pregunta
  generateQuestion();
}

function endGame() {
  clearInterval(timer); // Detener el temporizador
  const statusArea = document.getElementById("statusArea"); // Mostrar el puntaje final
  if (score >= 0)
    statusArea.innerHTML = `Juego terminado. Tu puntuación final es: ${score}`;
  if (score < 0) {
    // Opcionales: Mostrar mensajes según el desempeño, botón de reinicio, etc.
    statusArea.innerHTML += "<br>¡Presiona el botón para iniciar!";
  } else if (score < 15) {
    statusArea.innerHTML += "<br>¡Sigue practicando!";
  } else if (score < 25) {
    statusArea.innerHTML += "<br>¡Casi lo logras, inténtalo de nuevo!";
  } else {
    statusArea.innerHTML += "<br>¡Buen trabajo!";
  }
  if (score >= 0) {
    // Botón de reinicio
    statusArea.innerHTML +=
      '<br><button onclick="startGame()">Jugar de nuevo</button>';
  } else
    statusArea.innerHTML += '<br><button onclick="startGame()">Jugar</button>';
}

let currentInput = ""; // Variable global para almacenar la entrada del usuario

function appendToInput(value) {
  if (score < 0 || lives <= 0) return;
  currentInput += value; // Añadir el valor al input actual
  const userInput = document.getElementById("userInput"); // Actualizar el campo de entrada en el HTML
  userInput.value = currentInput;
}

function submitInput() {
  if (score < 0 || lives <= 0) return;
  const numericalInput = parseFloat(currentInput); // Convertir la entrada del usuario a un número
  handleInput(numericalInput); // Pasar la entrada a handleInput para su verificación
  currentInput = ""; // Limpiar el campo de entrada para la próxima pregunta
  const userInput = document.getElementById("userInput");
  userInput.value = currentInput;
}

function updateMetrics() {
  const scoreArea = document.getElementById("scoreArea");
  scoreArea.textContent = `Puntuación: ${score}`;
  const difficultyArea = document.getElementById("difficultyArea");
  if (score <= 10) {
    difficultyArea.textContent = "Nivel: Principiante";
  } else if (score <= 20) {
    difficultyArea.textContent = "Nivel: Fácil";
  } else if (score <= 30) {
    difficultyArea.textContent = "Nivel: Intermedio";
  } else if (score <= 40) {
    difficultyArea.textContent = "Nivel: Difícil";
  } else {
    difficultyArea.textContent = "Experto";
  }
  const livesArea = document.getElementById("livesArea");
  livesArea.textContent = `Vidas: ${lives}`;
}

function deleteLastInput() {
  currentInput = currentInput.slice(0, -1); // Eliminar el último carácter de la entrada actual
  const userInput = document.getElementById("userInput"); // Actualizar el campo de entrada en el HTML
  userInput.value = currentInput;
}

function displaySSoldiers(num1, num2) {
  const matrix1 = createSoldierMatrix(num1, num2);
  const matrix2 = createSoldierMatrix(num2, num1);
  const area1 = document.getElementById("area1");
  const area2 = document.getElementById("area2");
  area1.innerHTML = matrix1;
  area2.innerHTML = matrix2;
}

function displayMSoldiers(num1, num2) {
  const matrixR = createRectangle(num1, num2, 1);
  const area1 = document.getElementById("area1");
  const area2 = document.getElementById("area2");
  area1.innerHTML = matrixR;
  area2.innerHTML = "";
}

function createRectangle(num1, num2, size) {
  let matrixHTML = "";
  const isPositive = num1 * num2 >= 0;
  const soldierImage = isPositive ? "positivo.gif" : "negativo.gif";
  for (let i = 0; i < Math.abs(num1); i++) {
    for (let i = 0; i < Math.abs(num2); i++) {
      matrixHTML += `<img src="${soldierImage}" alt="Soldado" id="soldierImage${size}">`;
    }
    matrixHTML += '<br />';
  }
  return matrixHTML;
}

function createSoldierMatrix(num, oposite) {
  let matrixHTML = "";
  const isPositive = num >= 0;
  let soldierImage = isPositive ? "positivo.gif" : "negativo.gif";
  // Determinar el número de soldados a cambiar para la cancelación
  let numToCancel = Math.min(Math.abs(num), Math.abs(oposite));
  if (Math.sign(num) == Math.sign(oposite)) numToCancel = 0;
  for (let i = 0; i < Math.abs(num); i++) {
    // Cambiar la imagen para los soldados que se van a cancelar
    if (i >= Math.abs(num) - numToCancel) {
      soldierImage = isPositive ? "positivo_vanish.gif" : "negativo_vanish.gif";
    }
    matrixHTML += `<img src="${soldierImage}" alt="Soldado" id="soldierImage4">`;
  }
  return matrixHTML;
}


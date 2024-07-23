
// Set language function
function setLanguage(language) {
  document.querySelectorAll("[data-en]").forEach((element) => {
    element.textContent = element.getAttribute(`data-${language}`);
  });

  // Update dynamic elements
  document.getElementById("score").textContent = translations[
    language
  ].score.replace("0", score);
  pauseResumeButton.textContent = gamePaused
    ? translations[language].resume
    : translations[language].pause;
}

// Language buttons
document
  .getElementById("en-button")
  .addEventListener("click", () => setLanguage("en"));
document
  .getElementById("ua-button")
  .addEventListener("click", () => setLanguage("ua"));

// Ball properties
let ballPosition = {
  x: 50,
  y: 80,
  vy: 0,
  isJumping: false,
};
let ballSpeed = 3;
let gravity = 1;
let jumpPower = 24.5;
let doubleScoreMultiplier = 1;

let score = 0;
const scoreDisplay = document.getElementById("score");

let gamePaused = false;
let moveLeft = false;
let moveRight = false;

const ball = document.getElementById("ball");
const pointsContainer = document.getElementById("points-container");
const pauseResumeButton = document.getElementById("pause-resume-button");

// Move ball function
function moveBall() {
  if (!gamePaused) {
    if (moveLeft) ballPosition.x -= ballSpeed;
    if (moveRight) ballPosition.x += ballSpeed;

    ballPosition.vy += gravity;
    ballPosition.y += ballPosition.vy;

    // Prevent ball from moving outside the box
    if (ballPosition.y >= 280) {
      ballPosition.y = 280;
      ballPosition.vy = 0;
      ballPosition.isJumping = false;
    }
    if (ballPosition.y <= 0) {
      ballPosition.y = 0;
      ballPosition.vy = 0;
    }
    if (ballPosition.x <= 0) ballPosition.x = 0;
    if (ballPosition.x >= 380) ballPosition.x = 380;

    ball.style.left = `${ballPosition.x}px`;
    ball.style.top = `${ballPosition.y}px`;

    checkPointCollection();
  }

  requestAnimationFrame(moveBall);
}
function updateSpeed(newSpeed) {
  ballSpeed = newSpeed;
}

// Event listener for speed adjustment in settings
document.getElementById("speed-slider").addEventListener("input", (event) => {
  const newSpeed = parseFloat(event.target.value);
  updateSpeed(newSpeed);
});
// Spawn points
function spawnPoint() {
  const point = document.createElement("div");
  point.classList.add("point");
  point.style.left = `${Math.random() * 380}px`;
  point.style.top = `${Math.random() * 280}px`;
  point.style.backgroundColor = pointColor;
  pointsContainer.appendChild(point);

  setTimeout(() => point.remove(), 3000);
}

// Start point spawning
function startPointSpawning() {
  setInterval(spawnPoint, 2000);
}

// Check if ball collected points
function checkPointCollection() {
  const points = document.querySelectorAll(".point");
  points.forEach((point) => {
    const pointRect = point.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    if (
      ballRect.x < pointRect.x + pointRect.width &&
      ballRect.x + ballRect.width > pointRect.x &&
      ballRect.y < pointRect.y + pointRect.height &&
      ballRect.height + ballRect.y > pointRect.y
    ) {
      point.remove();
      score += 1 * doubleScoreMultiplier;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  });
}

// Pause/Resume game
pauseResumeButton.addEventListener("click", () => {
  gamePaused = !gamePaused;
  pauseResumeButton.textContent = gamePaused ? "Resume" : "Pause";
});

// Shop modal
document.getElementById("shop-button").addEventListener("click", () => {
  document.getElementById("shop-modal").style.display = "block";
});

// Help modal
document.getElementById("help-button").addEventListener("click", () => {
  document.getElementById("help-modal").style.display = "block";
});

// Settings modal
document.getElementById("settings-button").addEventListener("click", () => {
  document.getElementById("settings-modal").style.display = "block";
});

// Close modals
document.querySelectorAll(".close-button").forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.parentElement.style.display = "none";
  });
});

// Upgrade abilities
let speedUpgradeCost = 5;
let jumpUpgradeCost = 5;

document
  .getElementById("increase-speed-button")
  .addEventListener("click", () => {
    if (score >= speedUpgradeCost) {
      ballSpeed += 1;
      score -= speedUpgradeCost;
      speedUpgradeCost += 5;
      scoreDisplay.textContent = `Score: ${score}`;
    } else {
      alert("Not enough points to upgrade speed.");
    }
  });

document
  .getElementById("increase-jump-button")
  .addEventListener("click", () => {
    if (score >= jumpUpgradeCost) {
      jumpPower += 2;
      score -= jumpUpgradeCost;
      jumpUpgradeCost += 5;
      scoreDisplay.textContent = `Score: ${score}`;
    } else {
      alert("Not enough points to upgrade jump power.");
    }
  });

// Background and border color customization
document
  .getElementById("background-color-picker")
  .addEventListener("input", (event) => {
    document.body.style.backgroundColor = event.target.value;
  });

document
  .getElementById("border-color-picker")
  .addEventListener("input", (event) => {
    document.getElementById("game-container").style.borderColor =
      event.target.value;
  });

document
  .getElementById("box-background-color-picker")
  .addEventListener("input", (event) => {
    document.getElementById("game-container").style.backgroundColor =
      event.target.value;
  });

// Ball and point color customization
let pointColor = "#00ff00";

document
  .getElementById("ball-color-picker")
  .addEventListener("input", (event) => {
    ball.style.backgroundColor = event.target.value;
  });

document
  .getElementById("point-color-picker")
  .addEventListener("input", (event) => {
    pointColor = event.target.value;
  });

// Movement controls
const moveLeftButton = document.getElementById("move-left-button");
const moveRightButton = document.getElementById("move-right-button");
const jumpButton = document.getElementById("jump-button");

moveLeftButton.addEventListener("touchstart", () => {
  moveLeft = true;
  moveRight = false;
});

moveLeftButton.addEventListener("touchend", () => {
  moveLeft = false;
});

moveRightButton.addEventListener("touchstart", () => {
  moveRight = true;
  moveLeft = false;
});

moveRightButton.addEventListener("touchend", () => {
  moveRight = false;
});

jumpButton.addEventListener("touchstart", () => {
  if (!ballPosition.isJumping) {
    ballPosition.vy = -jumpPower;
    ballPosition.isJumping = true;
  }
});

// Keyboard controls (optional)
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveLeft = true;
  if (event.key === "ArrowRight") moveRight = true;
  if (event.key === "ArrowUp") {
    if (!ballPosition.isJumping) {
      ballPosition.vy = -jumpPower;
      ballPosition.isJumping = true;
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") moveLeft = false;
  if (event.key === "ArrowRight") moveRight = false;
});

// Start game
moveBall();
startPointSpawning();
// Initialize points from localStorage
// Initialize points and code used flag from localStorage
let points = parseInt(localStorage.getItem('points')) || 0;
let inWorkCodeUsed = localStorage.getItem('inWorkCodeUsed') === 'true';

// Display elements
const pointsDisplay = document.getElementById('score');
const codePanel = document.getElementById('code-panel');
const codeInput = document.getElementById('code-input');
const codeSubmit = document.getElementById('code-submit');
const codeMessage = document.getElementById('code-message');
const pointGenerator = document.getElementById('point-generator');

// Function to update the points display
function updatePointsDisplay() {
    pointsDisplay.textContent = `Points: ${points}`;
}

// Function to add points
function addPoints(amount) {
    points += amount;
    localStorage.setItem('points', points); // Save updated points to localStorage
    updatePointsDisplay();
}

// Function to reveal the point generator
function revealPointGenerator() {
    pointGenerator.style.display = "block";
}

// Handle code submission
codeSubmit.addEventListener("click", () => {
  const enteredCode = codeInput.value.trim();
  if (enteredCode === "ANDRII2013W") {
    codePanel.style.display = "none";
    revealPointGenerator();
    codeMessage.textContent = "Point generator unlocked!";
  } else if (enteredCode === "InWork!") {
    if (inWorkCodeUsed) {
      codeMessage.textContent = "You already used this code!";
    } else {
      addPoints(50); // Add 50 points
      localStorage.setItem("inWorkCodeUsed", "true"); // Set flag to indicate code has been used
      inWorkCodeUsed = true;
      codeMessage.textContent = "You received 50 points!";
    }
  } else {
    codeMessage.textContent = "Invalid code. Please try again.";
  }
});
// Update points display on load
updatePointsDisplay();

// Rocket properties
const rocket = document.getElementById("rocket");
rocket.style.display = "none"; // Initially hidden

// Check if ball collected points
function checkPointCollection() {
  const points = document.querySelectorAll(".point");
  points.forEach((point) => {
    const pointRect = point.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    if (
      ballRect.x < pointRect.x + pointRect.width &&
      ballRect.x + ballRect.width > pointRect.x &&
      ballRect.y < pointRect.y + pointRect.height &&
      ballRect.height + ballRect.y > pointRect.y
    ) {
      point.remove();
      score += 1 * doubleScoreMultiplier;
      scoreDisplay.textContent = `Score: ${score}`;
      
      // Display rocket if score is 100
      if (score >= 100) {
        rocket.style.display = "block";
      }
    }
  });
}
document.getElementById("rocket").addEventListener("click", () => {
  window.location.href = "./2world.html";
});

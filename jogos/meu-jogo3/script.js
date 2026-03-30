// ==========================
// 🎯 ESTADO GLOBAL
// ==========================
const puzzle = document.getElementById("puzzle");

let size = 6;
let pieces = [];
let dragged = null;
let touchPiece = null;
let selectedImage = null;

let startTime = null;
let timerInterval = null;
let gameFinished = false;
let touchStartPiece = null;
let touchCurrentTarget = null;
let ghostPiece = null;

const moveSound = new Audio("sounds/move.mp3");
moveSound.volume = 0.4;

const winSound = new Audio("sounds/win.mp3");
winSound.volume = 0.5;


// ==========================
// 🧭 NAVEGAÇÃO
// ==========================
function goToImageSelect() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("imageSelect").classList.remove("hidden");
}

function backToMenu() {
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("imageSelect").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");

  document.getElementById("winScreen").classList.remove("show");
}


// ==========================
// ⚙️ OPÇÕES
// ==========================
function toggleOptions() {
  const options = document.getElementById("options");

  options.classList.toggle("hidden");

  // 🔥 se abriu, rola até ele
  if (!options.classList.contains("hidden")) {
    setTimeout(() => {
      options.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  }
}


// ==========================
// ▶️ INICIAR JOGO
// ==========================
function startGameWithImage(img) {
  selectedImage = img.src;

  gameFinished = false;
  stopTimer();
  startTimer();

  // desbloqueia áudio
  moveSound.play().then(() => {
    moveSound.pause();
    moveSound.currentTime = 0;
  }).catch(() => {});

  document.getElementById("imageSelect").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  createPuzzle();
}


// ==========================
// 🧩 CRIAR PUZZLE
// ==========================
function createPuzzle() {
  puzzle.innerHTML = "";

  puzzle.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  puzzle.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  pieces = [];

  for (let i = 0; i < size * size; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece");

    const x = i % size;
    const y = Math.floor(i / size);

    piece.style.backgroundImage = `url(${selectedImage})`;
    piece.style.backgroundSize = `${size * 100}% ${size * 100}%`;

    piece.style.backgroundPosition =
      `${(x / (size - 1)) * 100}% ${(y / (size - 1)) * 100}%`;

    piece.setAttribute("data-index", i);

    // DESKTOP
    piece.draggable = true;
    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragover", dragOver);
    piece.addEventListener("drop", drop);

    // MOBILE
    piece.addEventListener("touchstart", touchStart);
    piece.addEventListener("touchmove", touchMove);
    piece.addEventListener("touchend", touchEnd);

    pieces.push(piece);
  }

  shuffle(pieces);
  pieces.forEach(p => puzzle.appendChild(p));
}


// ==========================
// 🔀 EMBARALHAR
// ==========================
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}


// ==========================
// 🔄 TROCA DE PEÇAS (UNIFICADO)
// ==========================
function swapPieces(a, b) {
  if (!a || !b || a === b) return;

  const aNext = a.nextSibling;
  const bNext = b.nextSibling;

  puzzle.insertBefore(a, bNext);
  puzzle.insertBefore(b, aNext);

  // som
  const sound = moveSound.cloneNode();
  sound.play();
}


// ==========================
// 🖱 DESKTOP (DRAG)
// ==========================
function dragStart(e) {
  dragged = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  const target = e.target;

  if (!target.classList.contains("piece") || target === dragged) return;

  swapPieces(dragged, target);
  checkWin();
}


// ==========================
// 📱 MOBILE (TOUCH)
// ==========================
function touchStart(e) {
  const touch = e.touches[0];

  touchStartPiece = e.target;

  // cria ghost
  ghostPiece = e.target.cloneNode(true);
  ghostPiece.classList.add("drag-ghost");

  // pega tamanho real da peça
  const rect = e.target.getBoundingClientRect();

  ghostPiece.style.width = rect.width + "px";
  ghostPiece.style.height = rect.height + "px";

  document.body.appendChild(ghostPiece);

  // 🔥 posiciona CENTRALIZADO no dedo
  ghostPiece.style.left = (touch.clientX - rect.width / 2) + "px";
  ghostPiece.style.top = (touch.clientY - rect.height / 2) + "px";
}

function touchMove(e) {
  e.preventDefault();

  const touch = e.touches[0];

  if (ghostPiece) {
    const rect = ghostPiece.getBoundingClientRect();

    ghostPiece.style.left = (touch.clientX - rect.width / 2) + "px";
    ghostPiece.style.top = (touch.clientY - rect.height / 2) + "px";
  }

  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (target && target.classList.contains("piece")) {
    touchCurrentTarget = target;
  }
}

function touchEnd() {
  if (
    touchStartPiece &&
    touchCurrentTarget &&
    touchStartPiece !== touchCurrentTarget
  ) {
    swapPieces(touchStartPiece, touchCurrentTarget);
    checkWin();
  }

  // remove ghost
  if (ghostPiece) {
    ghostPiece.remove();
    ghostPiece = null;
  }

  touchStartPiece = null;
  touchCurrentTarget = null;
}


// ==========================
// 🏆 VITÓRIA
// ==========================
function checkWin() {
  if (gameFinished) return;

  const current = [...puzzle.children];

  const isCorrect = current.every((piece, index) => {
    return piece.getAttribute("data-index") == index;
  });

  if (isCorrect) {
    gameFinished = true;

    stopTimer();

    const finalTime = document.getElementById("timer").textContent;

    showWinScreen(finalTime);
  }
}

function showWinScreen(time) {
  winSound.play();

  document.getElementById("finalTime").textContent = `⏱ ${time}`;
  document.getElementById("finalDifficulty").textContent =
    `🎯 ${getDifficultyName()}`;

  document.getElementById("winScreen").classList.add("show");
}

function playAgain() {
  document.getElementById("winScreen").classList.remove("show");

  gameFinished = false;
  stopTimer();
  startTimer();

  createPuzzle();
}


// ==========================
// ⏱ TIMER
// ==========================
function startTimer() {
  startTime = Date.now();

  timerInterval = setInterval(() => {
    const diff = Date.now() - startTime;

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 60000);

    document.getElementById("timer").textContent =
      `⏱ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 500);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}


// ==========================
// 🔄 RESET
// ==========================
function resetGame() {
  gameFinished = false;
  stopTimer();
  startTimer();
  createPuzzle();
}


// ==========================
// 🎯 DIFICULDADE
// ==========================
function getDifficultyName() {
  if (size === 4) return "Fácil";
  if (size === 6) return "Médio";
  if (size === 8) return "Difícil";
  return "Personalizado";
}

function setDifficulty(newSize, btn) {
  size = newSize;

  document.querySelectorAll(".levels button").forEach(b => {
    b.classList.remove("active");
  });

  btn.classList.add("active");
}
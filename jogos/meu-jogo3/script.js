// ==========================
// 🎯 ESTADO GLOBAL
// ==========================
const puzzle = document.getElementById("puzzle");
const galleryImages = [
  "img/dudu1.jpg",
  "img/dudu2.jpg",
  "img/dudu3.jpg",
  "img/dudu4.jpg",
  "img/dudu5.jpg",
  "img/dudu6.jpg",
   "img/sunset.png",
   "img/lagoa.png",
   "img/pizzaria.png",
   "img/papagaio.png",
   "img/super.png",
   "img/queda.png",
];

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
let offsetX = 0;
let offsetY = 0;
let unlockedNow = false; // 🔥 controle global

const moveSound = new Audio("sounds/move.mp3");
moveSound.volume = 0.4;

const winSound = new Audio("sounds/win.mp3");
winSound.volume = 0.5;


// ==========================
// 🧭 NAVEGAÇÃO
// ==========================
function goToImageSelect() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("galleryScreen").classList.add("hidden"); // 🔥 ESSENCIAL
  document.getElementById("imageSelect").classList.remove("hidden");
}

function backToMenu() {
  document.getElementById("menu").classList.remove("hidden");

  document.getElementById("imageSelect").classList.add("hidden");
  document.getElementById("galleryScreen").classList.add("hidden"); // 🔥 IMPORTANTE
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
document.getElementById("referenceImage").src = img.src;
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
  const piece = e.target;

  touchStartPiece = piece;

  const rect = piece.getBoundingClientRect();

  // 🔥 calcula offset do dedo dentro da peça
  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;

  // cria ghost
  ghostPiece = piece.cloneNode(true);
  ghostPiece.classList.add("drag-ghost");

  ghostPiece.style.width = rect.width + "px";
  ghostPiece.style.height = rect.height + "px";

  document.body.appendChild(ghostPiece);

  // posição inicial
  ghostPiece.style.left = (touch.clientX - offsetX) + "px";
  ghostPiece.style.top = (touch.clientY - offsetY) + "px";
}

function touchMove(e) {
  e.preventDefault();

  const touch = e.touches[0];

  if (ghostPiece) {
    ghostPiece.style.left = (touch.clientX - offsetX) + "px";
    ghostPiece.style.top = (touch.clientY - offsetY) + "px";
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
  puzzle.classList.add("completed");
  if (gameFinished) return;

  const current = [...puzzle.children];

  const isCorrect = current.every((piece, index) => {
    return piece.getAttribute("data-index") == index;
  });

 if (isCorrect) {
  gameFinished = true;

  stopTimer();

  unlockedNow = false;

  if (size >= 6) {
    const unlocked = JSON.parse(localStorage.getItem("unlocked") || "[]");
const normalized = normalizeImagePath(selectedImage);

if (size >= 6 && !unlocked.includes(normalized)) {
  unlockImage(selectedImage);
  unlockedNow = true;
} else {
  unlockedNow = false;
}
  }

  const finalTime = document.getElementById("timer").textContent;
  showWinScreen(finalTime);
}
}



function showWinScreen(time) {
  winSound.play();

  document.getElementById("finalTime").textContent = `⏱ ${time}`;
  document.getElementById("finalDifficulty").textContent =
    `🎯 ${getDifficultyName()}`;

  const msg = document.getElementById("unlockMessage");

  if (unlockedNow) {
    msg.textContent = "🏆 Nova imagem desbloqueada!";
    msg.classList.remove("hidden");
  } else {
    msg.classList.add("hidden");
  }

  document.getElementById("winScreen").classList.add("show");
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

function closeWinScreen() {
  document.getElementById("winScreen").classList.remove("show");
}

function unlockImage(imgSrc) {
  const normalized = normalizeImagePath(imgSrc);

  let unlocked = JSON.parse(localStorage.getItem("unlocked") || "[]");

  if (!unlocked.includes(normalized)) {
    unlocked.push(normalized);
    localStorage.setItem("unlocked", JSON.stringify(unlocked));
  }
}

function openGallery() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("galleryScreen").classList.remove("hidden");

  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";

  const unlocked = JSON.parse(localStorage.getItem("unlocked") || "[]");

galleryImages.forEach(src => {
  const normalized = normalizeImagePath(src);

  const img = document.createElement("img");
  img.src = src;
  img.classList.add("gallery-item");

  if (unlocked.includes(normalized)) {
    img.classList.add("unlocked");
    img.onclick = () => openImageModal(src);
  } else {
    img.classList.add("locked");
  }

  grid.appendChild(img);
});
}

function openImageModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");

  img.src = src;
  modal.classList.remove("hidden");
}

const modal = document.getElementById("imageModal");

if (modal) {
  modal.onclick = () => {
    modal.classList.add("hidden");
  };
}

function normalizeImagePath(src) {
  const parts = src.split("/");
  return "img/" + parts[parts.length - 1];
}

function playAgain() {
  document.getElementById("winScreen").classList.remove("show");

  if (!selectedImage) return;

  gameFinished = false;
  puzzle.classList.remove("completed");

  stopTimer();
  startTimer();

  createPuzzle();
}
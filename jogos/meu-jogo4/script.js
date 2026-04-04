// ==========================
// 🎯 ESTADO GLOBAL
// ==========================
let theme = null;
let bot = null;

let cards = [];
let flipped = [];
let lock = false;
let playerTurn = true;

let playerScore = 0;
let botScore = 0;

let botMemory = {};
let memoryQueue = [];
let memoryLimit = 4;

let botSmartness = 0.5;

// ⏱ CONTROLE
let revealTimeout = null;
let revealDelay = 2000;
let allowSkip = false;

// ==========================
// 🔊 SONS
// ==========================
const flipSound = new Audio("sounds/flip.mp3");
const winSound = new Audio("sounds/win.mp3");
const failSound = new Audio("sounds/failed.mp3");
const correctSound = new Audio("sounds/certo.mp3");
const clickSound = new Audio("sounds/click.mp3");
const duduCorrect = new Audio("sounds/dada.mp3");
const bubuCorrect = new Audio("sounds/tata.mp3");

const bgMusic = new Audio("sounds/background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

// ==========================
// 🔊 SOM UI
// ==========================
function playClick() {
  playSound(clickSound);
}

// ==========================
// 🧭 NAVEGAÇÃO
// ==========================
function nextStep(n) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById("step" + n).classList.remove("hidden");
}

function prevStep(n) {
  playClick();

  if (n === 2) theme = null;
  if (n === 3) bot = null;

  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById("step" + n).classList.remove("hidden");
}

function selectTheme(t) {
  playClick();

  theme = t;

  // 🔥 ATIVA BACKGROUND ROMÂNTICO
  const game = document.getElementById("game");
  game.classList.remove("romantico");

  if (t === "romantico") {
    game.classList.add("romantico");
  }

  nextStep(3);
}

function selectBot(b) {
  playClick();

  bot = b;
  setBotState("normal");

  // 🔥 ATUALIZA NOME NO SCORE
  const name = b === "dudu" ? "Dudu" : "Bubu";
  document.getElementById("botName").textContent = name;

  nextStep(4);
}

// ==========================
// 📱 RESPONSIVO
// ==========================
function isMobile() {
  return window.innerWidth < 768;
}

function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

// ==========================
// 🎯 START
// ==========================
function startGame(difficulty) {
  playClick();

  playerScore = 0;
  botScore = 0;
  botMemory = {};
  memoryQueue = [];
  playerTurn = true;

  let pairCount;

  if (difficulty === "easy") {
    pairCount = 8;
    botSmartness = 0.4;
    memoryLimit = 4;
  }

  if (difficulty === "medium") {
    pairCount = 12;
    botSmartness = 0.6;
    memoryLimit = 5;
  }

  if (difficulty === "hard") {
    pairCount = 12;
    botSmartness = 0.8;
    memoryLimit = 6;
  }

  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById("game").classList.remove("hidden");

  updateScore();
  setBotState("normal");

  playBackgroundMusic();
  setupBoard(pairCount);
}

// ==========================
// 🎵 MÚSICA
// ==========================
function playBackgroundMusic() {
  try {
    bgMusic.currentTime = 0;
    bgMusic.play();
  } catch {}
}

function stopBackgroundMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

// ==========================
// 🧠 GRID
// ==========================
function getGrid(total) {

  if (isMobile()) {

    if (isLandscape()) {
      if (total === 16) return { cols: 4 };
      if (total === 24) return { cols: 6 };
    } else {
      if (total === 16) return { cols: 4 };
      if (total === 24) return { cols: 4 };
    }

  }

  if (total === 16) return { cols: 4 };
  if (total === 24) return { cols: 6 };

  return { cols: 4 };
}

// ==========================
// 🧩 BOARD
// ==========================
function setupBoard(pairCount) {
  const board = document.getElementById("board");

  let total = pairCount * 2;
  let { cols } = getGrid(total);

  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  let values = [];

  for (let i = 1; i <= pairCount; i++) {
    values.push(i, i);
  }

  values.sort(() => Math.random() - 0.5);

  board.innerHTML = "";
  cards = [];

  values.forEach((v, i) => {
    const div = document.createElement("div");

    div.classList.add("card", "hiddenCard");
    div.dataset.value = v;
    div.dataset.index = i;

    div.onclick = () => flipCard(div);

    board.appendChild(div);
    cards.push(div);
  });
}

// ==========================
// 🃏 CARTAS
// ==========================
function flipCard(card) {
  if (!playerTurn || lock) return;
  if (!card.classList.contains("hiddenCard")) return;
  if (card.classList.contains("matched")) return;

  playSound(flipSound);

  showCard(card);
  flipped.push(card);

  if (flipped.length === 2) {
    lock = true;

    let [a, b] = flipped;

    if (a.dataset.value === b.dataset.value) {
      setTimeout(checkMatch, 200);
    } else {
      allowSkip = true;
      showSkipButton(true);
      revealTimeout = setTimeout(checkMatch, revealDelay);
    }
  }
}

function skipReveal() {
  if (!allowSkip) return;

  clearTimeout(revealTimeout);
  allowSkip = false;
  showSkipButton(false);

  checkMatch();
}

function showSkipButton(show) {
  document.getElementById("skipBtn").style.display = show ? "block" : "none";
}

function showCard(card) {
  if (card.querySelector("img")) return;

  let img = document.createElement("img");
  img.src = `img/cartas/${theme}/${card.dataset.value}.jpg`;

  card.appendChild(img);
  card.classList.remove("hiddenCard");

  remember(card.dataset.value, card.dataset.index);
}

function hideCard(card) {
  if (card.classList.contains("matched")) return;

  card.innerHTML = "";
  card.classList.add("hiddenCard");
}

// ==========================
// 🧠 MEMÓRIA LIMITADA
// ==========================
function remember(value, index) {
  if (!botMemory[value]) botMemory[value] = [];

  if (!botMemory[value].includes(index)) {
    botMemory[value].push(index);
    memoryQueue.push({ value, index });
  }

  while (memoryQueue.length > memoryLimit) {
    let removed = memoryQueue.shift();

    let arr = botMemory[removed.value];
    if (arr) {
      botMemory[removed.value] = arr.filter(i => i !== removed.index);

      if (botMemory[removed.value].length === 0) {
        delete botMemory[removed.value];
      }
    }
  }
}

// ==========================
// 🎯 MATCH
// ==========================
function checkMatch() {
  showSkipButton(false);
  allowSkip = false;
  clearTimeout(revealTimeout);

  let [a, b] = flipped;

  if (a.dataset.value === b.dataset.value) {
    a.classList.add("matched");
    b.classList.add("matched");

    setTimeout(() => {
      a.style.visibility = "hidden";
      b.style.visibility = "hidden";
    }, 200);

    sendToCollection("player", a.dataset.value);

    playSound(correctSound);

    playerScore++;
    updateScore();
    checkGameEnd();

    flipped = [];
    lock = false;

  } else {
    playerTurn = false;

    setTimeout(() => {
      hideCard(a);
      hideCard(b);

      flipped = [];
      lock = false;

      botTurn();
    }, 600);
  }
}

// ==========================
// 📊 SCORE
// ==========================
function updateScore() {
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("botScore").textContent = botScore;
}

// ==========================
// 🤖 BOT
// ==========================
function botTurn() {
  setTimeout(() => {
    let move = findKnownPair();

    if (!move || Math.random() > botSmartness) {
      move = randomMove();
    }

    if (!move) {
      playerTurn = true;
      return;
    }

    playBot(move[0], move[1]);
  }, 800);
}

function findKnownPair() {
  for (let value in botMemory) {
    let valid = botMemory[value].filter(index => {
      let c = cards[index];
      return c && !c.classList.contains("matched");
    });

    if (valid.length >= 2) return valid.slice(0, 2);
  }
  return null;
}

function randomMove() {
  let hidden = cards.filter(c =>
    c.classList.contains("hiddenCard") &&
    !c.classList.contains("matched")
  );

  if (hidden.length < 2) return null;

  hidden.sort(() => Math.random() - 0.5);

  return [
    hidden[0].dataset.index,
    hidden[1].dataset.index
  ];
}

function playBot(i1, i2) {
  let c1 = cards[i1];
  let c2 = cards[i2];

  if (!c1 || !c2) return;

  playSound(flipSound);

  showCard(c1);
  showCard(c2);

  setTimeout(() => {

    if (c1.dataset.value === c2.dataset.value) {

      c1.classList.add("matched");
      c2.classList.add("matched");

      setTimeout(() => {
        c1.style.visibility = "hidden";
        c2.style.visibility = "hidden";
      }, 200);

      sendToCollection("bot", c1.dataset.value);

      if (bot === "dudu") playSound(duduCorrect);
      if (bot === "bubu") playSound(bubuCorrect);

      botScore++;
      updateScore();
      checkGameEnd();

      setBotTemporaryState("feliz");

      setTimeout(botTurn, 800);

    } else {

      setBotTemporaryState("triste");

      setTimeout(() => {
        hideCard(c1);
        hideCard(c2);
        playerTurn = true;
      }, 600);
    }

  }, 1000);
}

// ==========================
// 🎭 BOT VISUAL
// ==========================
function setBotState(state) {
  let img = document.getElementById("botAvatar");
  if (!img) return;

  img.src = `img/personagens/${bot}_${state}.png`;
}

function setBotTemporaryState(state) {
  setBotState(state);
  setTimeout(() => setBotState("normal"), 800);
}

// ==========================
// 🎯 COLEÇÃO
// ==========================
function sendToCollection(owner, value) {
  const container = document.getElementById(owner + "Collection");

  const wrapper = document.createElement("div");
  wrapper.classList.add("mini-pair");

  for (let i = 0; i < 2; i++) {
    const img = document.createElement("img");
    img.src = `img/cartas/${theme}/${value}.jpg`;
    wrapper.appendChild(img);
  }

  container.appendChild(wrapper);
}

// ==========================
// 🏁 FIM
// ==========================
function checkGameEnd() {
  let totalPairs = cards.length / 2;

  if (playerScore + botScore === totalPairs) {

    stopBackgroundMusic();

    let text;

    if (playerScore > botScore) {
      text = "🏆 Você venceu!";
      playSound(winSound);
    } else if (botScore > playerScore) {
      text = bot === "dudu" ? "🐻 O Dudu venceu!" : "🐼 A Bubu venceu!";
      playSound(failSound);
    } else {
      text = "🤝 Empate!";
    }

    document.getElementById("winnerText").textContent = text;
    document.getElementById("winScreen").classList.add("show");
  }
}

// ==========================
// 🔊 SOM
// ==========================
function playSound(sound) {
  try {
    const s = sound.cloneNode();
    s.volume = 0.5;
    s.play();
  } catch {}
}

// ==========================
// 🔄 RESET
// ==========================
function resetGame() {
  stopBackgroundMusic();

  document.getElementById("playerCollection").innerHTML = "";
  document.getElementById("botCollection").innerHTML = "";

  document.getElementById("board").innerHTML = "";

  flipped = [];
  lock = false;
  playerTurn = true;
  botMemory = {};
  memoryQueue = [];

  document.getElementById("winScreen").classList.remove("show");

  nextStep(1);
}
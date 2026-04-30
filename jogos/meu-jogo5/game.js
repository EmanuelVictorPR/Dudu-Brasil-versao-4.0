// =====================================================
// DUDU & BUBU RACING
// GAME.JS COMPLETO COM DIFICULDADE
// =====================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const speedDisplay = document.getElementById("speed");
const lapDisplay = document.getElementById("lap");

const menu = document.getElementById("menu");
const winScreen = document.getElementById("winScreen");

const controlsLeft = document.querySelector(".controls-left");
const controlsRight = document.querySelector(".controls-right");

// =====================================================
// DIFICULDADE
// =====================================================
let difficulty = "normal";

// =====================================================
// SUBSTITUA APENAS O OBJETO difficultyConfig NO SEU JS
// =====================================================

const difficultyConfig = {

  easy: {
    maxVel: 80,
    accelTime: 5,

    // horizonte mais alto = vê curva antes
    horizon: 0.44,

    curveForce: 0.0012
  },

  normal: {
    maxVel: 100,
    accelTime: 4,

    horizon: 0.52,

    curveForce: 0.0020
  },

  hard: {
    maxVel: 115,
    accelTime: 3.2,

    // horizonte alto também, mas menos que easy
    horizon: 0.48,

    curveForce: 0.0027
  }
};

// =====================================================
// ESTADOS
// =====================================================
let moveLeft = false;
let moveRight = false;
let acelerando = false;
let freando = false;

let gameStarted = false;
let countdownActive = false;
let countdown = 3;
let countdownTimer = 0;
let lastCount = 4;

let venceu = false;
let bgOffset = 0;
let lastTime = 0;

// =====================================================
// PLAYER
// =====================================================
const player = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  velocidade: 0,
  z: 0
};

// =====================================================
// CANVAS
// =====================================================
function resizeGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let size;

  if (canvas.width < 900) {
    size = Math.min(canvas.width, canvas.height) * 0.19;
  } else {
    size = Math.min(canvas.width, canvas.height) * 0.14;
  }

  player.width = size;
  player.height = size;
  player.y = canvas.height - size - 10;
}
window.addEventListener("resize", resizeGame);
resizeGame();

// =====================================================
// IMAGENS
// =====================================================
const bg = new Image();
bg.src = "assets/imagens/ceu.png";

const grama = new Image();
grama.src = "assets/imagens/grama.png";

const carroReto = new Image();
carroReto.src = "assets/imagens/carro_reto.png";

const carroEsq = new Image();
carroEsq.src = "assets/imagens/carro_esquerda.png";

const carroDir = new Image();
carroDir.src = "assets/imagens/carro_direita.png";

const poeiraImg = new Image();
poeiraImg.src = "assets/imagens/poeira.png";

let gramaOk = false;
grama.onload = () => gramaOk = true;
grama.onerror = () => gramaOk = false;

// =====================================================
// AUDIO
// =====================================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioStarted = false;
let sounds = {};

function startAudio() {
  if (!audioStarted) {
    audioCtx.resume();
    audioStarted = true;
  }
}

async function loadSound(url) {
  const r = await fetch(url);
  const a = await r.arrayBuffer();
  return await audioCtx.decodeAudioData(a);
}

function createLoop(buffer) {
  const src = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();

  src.buffer = buffer;
  src.loop = true;
  gain.gain.value = 0;

  src.connect(gain);
  gain.connect(audioCtx.destination);

  return { source: src, gain, started: false };
}

function startLoop(s) {
  if (!s.started) {
    s.source.start(0);
    s.started = true;
  }
}

function fade(sound, target, speed = 0.08) {
  sound.gain.gain.value +=
    (target - sound.gain.gain.value) * speed;
}

function playBuffer(buffer, volume = 1) {
  if (!buffer) return;

  const src = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();

  gain.gain.value = volume;
  src.buffer = buffer;

  src.connect(gain);
  gain.connect(audioCtx.destination);
  src.start(0);
}

Promise.all([
  loadSound("assets/sons/aceleration.mp3"),
  loadSound("assets/sons/motor.mp3"),
  loadSound("assets/sons/inercia.mp3"),
  loadSound("assets/sons/freio.mp3"),
  loadSound("assets/sons/fora.mp3"),
  loadSound("assets/sons/wait.mp3"),
  loadSound("assets/sons/win.mp3"),
  loadSound("assets/sons/cont.mp3"),
  loadSound("assets/sons/go.mp3")
]).then(([acel,motor,inercia,freio,fora,wait,win,cont,go]) => {
  sounds.acel = createLoop(acel);
  sounds.motor = createLoop(motor);
  sounds.inercia = createLoop(inercia);
  sounds.freio = createLoop(freio);
  sounds.fora = createLoop(fora);
  sounds.wait = createLoop(wait);

  sounds.win = win;
  sounds.cont = cont;
  sounds.go = go;
});

// =====================================================
// PISTA
// =====================================================
const segmentLength = 200;
const roadScale = 1.18;
let segments = [];

function addSegment(curve, count) {
  for (let i = 0; i < count; i++) {
    segments.push({ curve });
  }
}

addSegment(0, 220);
addSegment(4.5, 130);
addSegment(0, 180);
addSegment(-5.5, 150);
addSegment(0, 220);

const trackLength = segments.length * segmentLength;
const finishSegment = 5;

// =====================================================
// VOLTAS
// =====================================================
const totalLaps = 3;
let lap = 1;
let jaContou = false;

// =====================================================
// CONTROLES
// =====================================================
function bindPress(id, on, off) {
  const el = document.getElementById(id);

  el.ontouchstart = e => {
    e.preventDefault();
    on();
  };

  el.ontouchend = off;

  el.onmousedown = on;
  el.onmouseup = off;
}

bindPress("btnLeft", () => moveLeft = true, () => moveLeft = false);
bindPress("btnRight", () => moveRight = true, () => moveRight = false);
bindPress("btnAccelerate", () => acelerando = true, () => acelerando = false);
bindPress("btnBrake", () => freando = true, () => freando = false);

window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
  if (e.key === "ArrowUp") acelerando = true;
  if (e.key === "ArrowDown") freando = true;
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
  if (e.key === "ArrowUp") acelerando = false;
  if (e.key === "ArrowDown") freando = false;
});

// =====================================================
// MENU
// =====================================================
canvas.style.display = "none";
controlsLeft.style.display = "none";
controlsRight.style.display = "none";
speedDisplay.style.display = "none";
lapDisplay.style.display = "none";

document.getElementById("btnStart").onclick = () => {
  difficulty =
    document.getElementById("difficulty")?.value || "normal";

  menu.classList.add("hidden");

  canvas.style.display = "block";
  controlsLeft.style.display = "flex";
  controlsRight.style.display = "flex";
  speedDisplay.style.display = "block";
  lapDisplay.style.display = "block";

  resetGame();
  startAudio();
  iniciarCountdown();
};

document.getElementById("btnRestart").onclick = () => {
  winScreen.classList.add("hidden");
  resetGame();
  iniciarCountdown();
};

// =====================================================
// RESET
// =====================================================
function resetGame() {
  player.x = 0;
  player.z = 0;
  player.velocidade = 0;

  lap = 1;
  jaContou = false;
  venceu = false;

  bgOffset = 0;

  gameStarted = false;
  countdownActive = false;
}

// =====================================================
// COUNTDOWN
// =====================================================
function iniciarCountdown() {
  countdown = 3;
  countdownTimer = 0;
  countdownActive = true;
  gameStarted = false;
  lastCount = 4;
}

// =====================================================
// PROJEÇÃO
// =====================================================
function project(z, x, curveOffset) {

  const cfg = difficultyConfig[difficulty];

  const scale = 1 / (z * 0.002 + 1);

  return {
    x: canvas.width / 2 + (curveOffset - x) * scale,
    y: canvas.height * cfg.horizon + scale * canvas.height * 0.40,
    w: scale * canvas.width * roadScale
  };
}

// =====================================================
// COLISÃO REAL
// =====================================================
function carroForaDaPista() {
  let baseIndex = Math.floor(player.z / segmentLength);

  let x = 0;
  let dx = 0;

  for (let n = 0; n < 2; n++) {
    const index = (baseIndex + n) % segments.length;
    const seg = segments[index];

    dx += seg.curve * 0.18;
    x += dx;
  }

  const p = project(0, player.x * 1200, x);

  const pistaEsq = p.x - p.w / 2;
  const pistaDir = p.x + p.w / 2;

  const carroEsq = canvas.width / 2 - player.width / 2;
  const carroDir = canvas.width / 2 + player.width / 2;

  return carroEsq < pistaEsq || carroDir > pistaDir;
}

// =====================================================
// DESENHAR ESTRADA
// =====================================================
function desenharEstrada() {

  let baseIndex = Math.floor(player.z / segmentLength);
  let x = 0;
  let dx = 0;
  let prev = null;

  for (let n = 0; n < 220; n++) {

    const index = (baseIndex + n) % segments.length;
    const seg = segments[index];

    const z =
      n * segmentLength -
      (player.z % segmentLength);

    dx += seg.curve * 0.18;
    x += dx;

    const p = project(z, player.x * 1200, x);

    if (prev) {

      // areia esquerda
      ctx.fillStyle = "#d9c08c";
      ctx.beginPath();
      ctx.moveTo(0, prev.y);
      ctx.lineTo(prev.x - prev.w/2 - 10, prev.y);
      ctx.lineTo(p.x - p.w/2 - 10, p.y);
      ctx.lineTo(0, p.y);
      ctx.closePath();
      ctx.fill();

      // areia direita
      ctx.beginPath();
      ctx.moveTo(prev.x + prev.w/2 + 10, prev.y);
      ctx.lineTo(canvas.width, prev.y);
      ctx.lineTo(canvas.width, p.y);
      ctx.lineTo(p.x + p.w/2 + 10, p.y);
      ctx.closePath();
      ctx.fill();

      // bordas
      ctx.fillStyle = "#fff";

      ctx.beginPath();
      ctx.moveTo(prev.x - prev.w/2 - 8, prev.y);
      ctx.lineTo(prev.x - prev.w/2, prev.y);
      ctx.lineTo(p.x - p.w/2, p.y);
      ctx.lineTo(p.x - p.w/2 - 8, p.y);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(prev.x + prev.w/2, prev.y);
      ctx.lineTo(prev.x + prev.w/2 + 8, prev.y);
      ctx.lineTo(p.x + p.w/2 + 8, p.y);
      ctx.lineTo(p.x + p.w/2, p.y);
      ctx.closePath();
      ctx.fill();

      // pista
      ctx.fillStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(prev.x - prev.w/2, prev.y);
      ctx.lineTo(prev.x + prev.w/2, prev.y);
      ctx.lineTo(p.x + p.w/2, p.y);
      ctx.lineTo(p.x - p.w/2, p.y);
      ctx.closePath();
      ctx.fill();

      if (index === finishSegment) {
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle =
            i % 2 === 0 ? "#fff" : "#000";

          ctx.fillRect(
            prev.x - prev.w/2 + (prev.w/10)*i,
            prev.y - 10,
            prev.w/10,
            10
          );
        }
      }
    }

    prev = p;
  }
}

// =====================================================
// SONS
// =====================================================
function atualizarSons() {

  if (!audioStarted || !sounds.wait) return;

  Object.values(sounds).forEach(s => {
    if (s.source) {
      startLoop(s);
      fade(s,0);
    }
  });

  if (countdownActive || player.velocidade <= 0) {
    fade(sounds.wait,1);
    return;
  }

  const maxVel = difficultyConfig[difficulty].maxVel;

  if (acelerando && player.velocidade < maxVel)
    fade(sounds.acel,1);
  else if (player.velocidade >= maxVel - 1)
    fade(sounds.motor,1);
  else if (!acelerando && !freando)
    fade(sounds.inercia,1);

  if (freando && player.velocidade > 0)
    fade(sounds.freio,1);

  if (carroForaDaPista() && player.velocidade > 10)
    fade(sounds.fora,1);
}

// =====================================================
// LOOP
// =====================================================
function gameLoop(time) {

  const delta = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (menu.classList.contains("hidden")) {

    const cfg = difficultyConfig[difficulty];

    const maxVel = cfg.maxVel;
    const acel = maxVel / (cfg.accelTime * 60);
    const desac = maxVel / (7 * 60);

    const baseIndex =
      Math.floor(player.z / segmentLength) %
      segments.length;

    const curvaAtual =
      segments[baseIndex].curve;

    if (player.velocidade > 0.5) {
      bgOffset +=
        curvaAtual *
        0.08 *
        (player.velocidade/maxVel);
    }

    bgOffset =
      ((bgOffset % canvas.width)+canvas.width) %
      canvas.width;

    // CÉU LOOP PERFEITO
    const skyH = canvas.height * 0.6;
    const skyX = Math.round(bgOffset);

    ctx.drawImage(bg,-skyX,0,canvas.width+2,skyH);
    ctx.drawImage(bg,canvas.width-skyX-1,0,canvas.width+2,skyH);

    desenharEstrada();

    // COUNTDOWN
    if (countdownActive) {

      countdownTimer += delta;

      const current =
        Math.ceil(3 - countdownTimer);

      if (current > 0 && current !== lastCount) {
        countdown = current;
        lastCount = current;
        playBuffer(sounds.cont,0.75);
      }

      if (countdownTimer >= 3 && lastCount !== 0) {
        lastCount = 0;
        playBuffer(sounds.go,0.38);
      }

      if (countdownTimer >= 3.5) {
        countdownActive = false;
        gameStarted = true;
      }
    }

    // GAMEPLAY
    if (gameStarted && !venceu) {

      if (acelerando) player.velocidade += acel;
      else if (!freando) player.velocidade -= desac;

      if (freando)
        player.velocidade -= desac * 3;

      player.velocidade =
        Math.max(0, Math.min(maxVel, player.velocidade));

      player.z += player.velocidade;

      player.x -=
        curvaAtual *
        cfg.curveForce *
        (player.velocidade / maxVel);

      if (player.velocidade > 5) {
        if (moveLeft) player.x -= 0.006;
        if (moveRight) player.x += 0.006;
      }

      player.x = Math.max(-1, Math.min(1, player.x));

      if (carroForaDaPista())
        player.velocidade *= 0.97;

      if (player.z >= trackLength && !jaContou) {
        player.z -= trackLength;
        lap++;
        jaContou = true;
      }

      if (player.z < trackLength * 0.9)
        jaContou = false;

      if (lap > totalLaps) {
        venceu = true;
        playBuffer(sounds.win);
        winScreen.classList.remove("hidden");
      }
    }

    atualizarSons();

    speedDisplay.innerText =
      Math.floor(player.velocidade);

    lapDisplay.innerText =
      `Lap ${Math.min(lap,totalLaps)}/${totalLaps}`;

    // POEIRA
    if (carroForaDaPista() && player.velocidade > 5) {

      const px = canvas.width/2 - player.width/2;
      const py = player.y;

      ctx.drawImage(
        poeiraImg,
        px + player.width*0.02,
        py + player.height*0.72,
        player.width*0.30,
        player.height*0.30
      );

      ctx.drawImage(
        poeiraImg,
        px + player.width*0.68,
        py + player.height*0.72,
        player.width*0.30,
        player.height*0.30
      );
    }

    // CARRO
    let sprite = carroReto;
    if (moveLeft) sprite = carroEsq;
    if (moveRight) sprite = carroDir;

    ctx.drawImage(
      sprite,
      canvas.width/2 - player.width/2,
      player.y,
      player.width,
      player.height
    );

    // VISUAL COUNTDOWN
    if (countdownActive) {
      ctx.fillStyle = "#fff";
      ctx.font = "80px Arial";
      ctx.textAlign = "center";

      const txt =
        countdownTimer < 3 ? countdown : "GO!";

      ctx.fillText(
        txt,
        canvas.width/2,
        canvas.height/2
      );
    }
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
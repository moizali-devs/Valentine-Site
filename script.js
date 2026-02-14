const landing = document.getElementById("landing");
const surprise = document.getElementById("surprise");
const openBtn = document.getElementById("openSurprise");
const smilesBtn = document.getElementById("smilesBtn");
const blushBtn = document.getElementById("blushBtn");
const bouquet = document.getElementById("bouquet");
const floatLayer = document.getElementById("floatLayer");
const soundToggle = document.getElementById("soundToggle");

let soundEnabled = false;
let audioCtx;

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
}

function playPop() {
  if (!soundEnabled || !audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(460, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(210, audioCtx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.13);
}

function spawnHeart(x, y, symbol = "❤") {
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = symbol;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${12 + Math.random() * 11}px`;
  heart.style.animationDuration = `${1800 + Math.random() * 1400}ms`;
  floatLayer.appendChild(heart);

  window.setTimeout(() => heart.remove(), 3200);
}

function heartBurst(originEl, forMs = 2000) {
  const rect = originEl.getBoundingClientRect();
  const start = performance.now();

  const id = window.setInterval(() => {
    const now = performance.now();
    if (now - start > forMs) {
      window.clearInterval(id);
      return;
    }

    for (let i = 0; i < 4; i += 1) {
      const x = rect.left + rect.width * (0.15 + Math.random() * 0.7);
      const y = rect.top + rect.height * (0.35 + Math.random() * 0.5);
      const symbol = Math.random() > 0.4 ? "❤" : "✦";
      spawnHeart(x, y, symbol);
    }
  }, 120);
}

function gentleFloatingHearts() {
  if (prefersReduced) return;
  window.setInterval(() => {
    if (surprise.hidden) return;
    const x = window.innerWidth * (0.12 + Math.random() * 0.76);
    const y = window.innerHeight * (0.6 + Math.random() * 0.26);
    spawnHeart(x, y, "❤");
  }, 1400);
}

openBtn.addEventListener("click", () => {
  playPop();
  landing.classList.add("leave");

  window.setTimeout(() => {
    landing.hidden = true;
    surprise.hidden = false;
    document.body.classList.add("show-surprise");
    smilesBtn.focus();
  }, prefersReduced ? 10 : 620);
});

smilesBtn.addEventListener("click", () => {
  playPop();
  heartBurst(smilesBtn, 2000);
});

blushBtn.addEventListener("click", () => {
  playPop();
  document.body.classList.add("blush");
  bouquet.classList.remove("wiggle");
  void bouquet.offsetWidth;
  bouquet.classList.add("wiggle");

  window.setTimeout(() => {
    document.body.classList.remove("blush");
  }, 2200);
});

soundToggle.addEventListener("click", () => {
  initAudio();
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute(
    "aria-label",
    soundEnabled ? "Disable click sounds" : "Enable click sounds"
  );
  if (soundEnabled) playPop();
});

gentleFloatingHearts();

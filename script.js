document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing");
  const surprise = document.getElementById("surprise");
  const openBtn = document.getElementById("openSurprise");
  const bouquet = document.getElementById("bouquet");
  const floatLayer = document.getElementById("floatLayer");

  const HEART = "\u2764";
  const STAR = "\u2726";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function spawnHeart(x, y, symbol = HEART) {
    if (!floatLayer) return;
    const el = document.createElement("span");
    el.className = "float-heart";
    el.textContent = symbol;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${12 + Math.random() * 12}px`;
    el.style.animationDuration = `${1800 + Math.random() * 1400}ms`;
    floatLayer.appendChild(el);
    window.setTimeout(() => el.remove(), 3200);
  }

  function burstAtElement(originEl, forMs = 1600) {
    if (!originEl) return;
    const rect = originEl.getBoundingClientRect();
    const start = performance.now();

    const id = window.setInterval(() => {
      const now = performance.now();
      if (now - start > forMs) {
        window.clearInterval(id);
        return;
      }

      for (let i = 0; i < 4; i += 1) {
        const x = rect.left + rect.width * (0.1 + Math.random() * 0.8);
        const y = rect.top + rect.height * (0.25 + Math.random() * 0.55);
        const symbol = Math.random() > 0.35 ? HEART : STAR;
        spawnHeart(x, y, symbol);
      }
    }, 120);
  }

  function gentleFloatingHearts() {
    if (prefersReduced) return;
    window.setInterval(() => {
      if (!surprise || surprise.hidden) return;
      const x = window.innerWidth * (0.14 + Math.random() * 0.72);
      const y = window.innerHeight * (0.62 + Math.random() * 0.22);
      spawnHeart(x, y, HEART);
    }, 1400);
  }

  function focusBouquet() {
    if (!bouquet) return;
    bouquet.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "center"
    });

    bouquet.classList.remove("wiggle");
    bouquet.classList.remove("spotlight");
    void bouquet.offsetWidth;
    bouquet.classList.add("wiggle");
    bouquet.classList.add("spotlight");
    burstAtElement(bouquet, 1600);

    window.setTimeout(() => {
      bouquet.classList.remove("spotlight");
    }, 1700);
  }

  if (openBtn && landing && surprise) {
    openBtn.addEventListener("click", () => {
      landing.classList.add("leave");
      window.setTimeout(() => {
        landing.hidden = true;
        surprise.hidden = false;
        document.body.classList.add("show-surprise");
        focusBouquet();
      }, prefersReduced ? 10 : 620);
    });
  }

  gentleFloatingHearts();
});

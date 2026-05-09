/* ========================================
   ROMANTIC CONFESS WEBSITE — script.js
   Clean Vanilla JS | No Frameworks
   ======================================== */

"use strict";

// ============================================================
//  THREE.JS BACKGROUND — 3D Starfield
// ============================================================
(function initThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.prepend(renderer.domElement);
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '0';
  renderer.domElement.style.pointerEvents = 'none';

  // Simple Particles (Awal Tadi)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 3000;
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i+=3) {
    posArray[i]   = (Math.random() - 0.5) * 1500;
    posArray[i+1] = (Math.random() - 0.5) * 1500;
    posArray[i+2] = (Math.random() - 0.5) * 1500;

    const color = Math.random() > 0.5 ? new THREE.Color(0x800000) : new THREE.Color(0xD4AF37);
    colorArray[i]   = color.r;
    colorArray[i+1] = color.g;
    colorArray[i+2] = color.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Lighting
  const pLight = new THREE.PointLight(0xffffff, 2, 2000);
  pLight.position.set(0, 200, 500);
  scene.add(pLight);
  const aLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(aLight);

  camera.position.z = 500;

  // Scattered 3D Card Animation — float only, no mouse movement
  const reasonCards = document.querySelectorAll('.cards-grid .reason-card');

  // Fixed scattered positions (left%, top%) and rotations for each card
  const scatterLayout = [
    { left: '2%',  top: '5%',   rot: -6 },
    { left: '32%', top: '0%',   rot:  4 },
    { left: '62%', top: '8%',   rot: -3 },
    { left: '5%',  top: '48%',  rot:  5 },
    { left: '38%', top: '44%',  rot: -7 },
  ];

  const cardData = Array.from(reasonCards).map((card, i) => {
    const layout = scatterLayout[i] || { left: `${(i%3)*32}%`, top: `${Math.floor(i/3)*50}%`, rot: 0 };
    card.style.left = layout.left;
    card.style.top  = layout.top;
    return {
      el: card,
      baseRot: layout.rot,
      offset: i * 1.3,
      speed: 0.4 + i * 0.1
    };
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    particlesMesh.rotation.y += 0.0005;

    cardData.forEach(data => {
      if (!data.el.classList.contains('card-visible')) return;
      const floatY = Math.sin(time * data.speed + data.offset) * 10;
      const floatX = Math.cos(time * 0.5 * data.speed + data.offset) * 6;
      data.el.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotateZ(${data.baseRot}deg)`;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ============================================================
//  SECTION NAVIGATION
// ============================================================
function goToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  // Hide all sections
  document.querySelectorAll('.section-page').forEach(sec => {
    sec.classList.remove('visible');
  });

  // Show target section
  target.classList.add('visible');

  // Trigger section-specific logic
  if (sectionId === 'tentang')  initCardObserver();
  if (sectionId === 'confess')  startConfess();
  if (sectionId === 'answer')   initNoButton();
}

// ============================================================
//  MUSIC TOGGLE
// ============================================================
(function initMusic() {
  const btn   = document.getElementById('musicBtn');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  audio.volume = 0.35;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
    }
    playing = !playing;
  });
})();


// ============================================================
//  TYPING EFFECT — Welcome Section
// ============================================================
(function initTyping() {
  const el    = document.getElementById('typingText');
  const text  = 'Haii, aku punya sesuatu buat kamu :)';
  let   i     = 0;
  let   started = false;

  // Create cursor span
  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  el.appendChild(cursor);

  function typeChar() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(typeChar, 55 + Math.random() * 40);
    }
  }

  // Start after brief delay
  setTimeout(typeChar, 900);
})();


// ============================================================
//  CARD SCROLL OBSERVER — Tentang Dia Section
// ============================================================
function initCardObserver() {
  const cards = document.querySelectorAll('.reason-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('card-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}


// ============================================================
//  MINI GAME — Catch The Heart
// ============================================================
let gameActive    = false;
let score         = 0;
let timeLeft      = 30;
let gameTimer     = null;
let heartInterval = null;
let specialShown  = false;

function startGame() {
  const overlay    = document.getElementById('gameOverlay');
  const gameArea   = document.getElementById('gameArea');
  const scoreEl    = document.getElementById('scoreDisplay');
  const timerEl    = document.getElementById('timerDisplay');
  const gameMsg    = document.getElementById('gameMessage');
  const gameResult = document.getElementById('gameResult');

  // Reset
  score       = 0;
  timeLeft    = 30;
  specialShown = false;
  gameActive  = true;
  gameMsg.classList.add('hidden');
  gameResult.classList.add('hidden');
  scoreEl.textContent = '0';
  timerEl.textContent = '30';

  overlay.classList.add('hide');

  // Remove leftover hearts
  gameArea.querySelectorAll('.falling-heart').forEach(h => h.remove());

  // Countdown timer
  gameTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);

  // Spawn hearts
  heartInterval = setInterval(() => spawnHeart(gameArea, scoreEl), 600);
}

function spawnHeart(area, scoreEl) {
  if (!gameActive) return;

  const heart  = document.createElement('div');
  heart.classList.add('falling-heart');
  const gems = ['💎', '✨', '🍷', '⭐', '🌟'];
  const gem = gems[Math.floor(Math.random() * gems.length)];
  heart.innerHTML = gem;
  const left     = Math.random() * (area.offsetWidth - 50) + 10;
  const duration = 2.0 + Math.random() * 2.5;

  heart.style.left = left + 'px';
  heart.style.animationDuration = duration + 's';

  heart.addEventListener('click', () => {
    if (!gameActive) return;
    score++;
    scoreEl.textContent = score;
    heart.style.transform = 'scale(1.8)';
    heart.style.opacity   = '0';
    heart.style.transition = 'all 0.2s ease';
    setTimeout(() => heart.remove(), 200);

    // Early exit at score 10
    if (score >= 10) {
      endGame();
    }
  });

  // Touch support
  heart.addEventListener('touchstart', (e) => {
    e.preventDefault();
    heart.click();
  }, { passive: false });

  area.appendChild(heart);
  setTimeout(() => {
    if (heart.parentNode) heart.remove();
  }, (duration + 0.2) * 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(gameTimer);
  clearInterval(heartInterval);

  const gameArea = document.getElementById('gameArea');
  gameArea.querySelectorAll('.falling-heart').forEach(h => h.remove());

  const resultEl   = document.getElementById('gameResult');
  const resultText = document.getElementById('gameResultText');

  let msg;
  if (score >= 20)      msg = `Wow, score kamu ${score}! Kamu keren banget ✨`;
  else if (score >= 10) msg = `Score ${score}! Kayaknya kamu memang spesial 💎`;
  else if (score >= 5)  msg = `Score kamu ${score} — lumayan! Tapi kamu udah spesial kok 🍷`;
  else                  msg = `Haha score ${score}, nggak apa-apa, kamu tetap yang paling spesial ✨`;

  resultText.textContent = msg;
  resultEl.classList.remove('hidden');
}


// ============================================================
//  CONFESS SECTION — Typing Animation
// ============================================================
function startConfess() {
  // Trigger confetti
  triggerConfetti(document.getElementById('confettiContainer'), 80);

  const lines = [
    { id: 'cLine1', text: 'Sebenarnya… aku udah lama suka sama kamu.' },
    { id: 'cLine2', text: 'Ada sesuatu dari kamu yang bikin aku susah lupain.' },
    { id: 'cLine3', text: 'Aku nyaman sama kamu, dan itu nggak mudah aku temuin.' },
    { id: 'cLine4', text: 'Dan aku ingin jujur tentang perasaan ini.' },
  ];

  lines.forEach((line, idx) => {
    setTimeout(() => {
      const el = document.getElementById(line.id);
      el.classList.add('revealed');
      typeIntoElement(el, line.text, 42);
    }, idx * 1800);
  });
}

function typeIntoElement(el, text, speed) {
  let i = 0;
  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  el.innerHTML = '';
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, speed + Math.random() * 20);
    } else {
      setTimeout(() => cursor.remove(), 800);
    }
  }
  type();
}


// ============================================================
//  CONFETTI EFFECT
// ============================================================
function triggerConfetti(container, count) {
  if (!container) return;
  container.innerHTML = '';
  const colors = [
    '#800000', '#4A0404', '#D4AF37', '#F9E2AF',
    '#A52A2A', '#ffffff', '#FFD700', '#5D001E'
  ];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    piece.innerHTML = ['💎', '✨', '🍷', '⭐'][Math.floor(Math.random() * 4)];

    const color    = colors[Math.floor(Math.random() * colors.length)];
    const left     = Math.random() * 100;
    const delay    = Math.random() * 2;
    const duration = 2 + Math.random() * 3;
    const size     = 5 + Math.random() * 8;
    const rotate   = Math.random() > 0.5 ? '2px' : '50%';

    piece.style.cssText = `
      left: ${left}%;
      top: -10px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${rotate};
      animation: confettiFall ${duration}s ${delay}s ease-in forwards;
    `;
    container.appendChild(piece);
  }
}


// ============================================================
//  NO BUTTON — Runs Away
// ============================================================
function initNoButton() {
  const btn     = document.getElementById('btnNo');
  const wrapper = document.getElementById('answerButtons');
  if (!btn || !wrapper) return;

  const FLEE_DISTANCE = 140;

  function fleeTo() {
    const wRect = wrapper.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();

    const maxX = window.innerWidth  - bRect.width  - 16;
    const maxY = window.innerHeight - bRect.height - 16;

    const newX = Math.min(Math.max(16, Math.random() * maxX), maxX);
    const newY = Math.min(Math.max(16, Math.random() * maxY), maxY);

    btn.style.position = 'fixed';
    btn.style.left     = newX + 'px';
    btn.style.top      = newY + 'px';
    btn.style.zIndex   = '999';
    btn.style.transition = 'left 0.25s ease, top 0.25s ease';
  }

  // Desktop: mouseover
  btn.addEventListener('mouseover', fleeTo);
  // Mobile: touchstart
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    fleeTo();
  }, { passive: false });
}


// ============================================================
//  YES BUTTON
// ============================================================
function handleYes() {
  const popup    = document.getElementById('yesPopup');
  const confetti = document.getElementById('popupConfetti');

  popup.classList.remove('hidden');
  triggerConfetti(confetti, 120);

  // Hide no button if it's floating around
  const noBtn = document.getElementById('btnNo');
  if (noBtn) noBtn.style.display = 'none';
}


// ============================================================
//  GENERAL SCROLL OBSERVER (for section visibility)
// ============================================================
(function initScrollObserver() {
  const sections = document.querySelectorAll('.section-page');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const id = el.id;
        el.classList.remove('hidden-section');
        requestAnimationFrame(() => el.classList.add('visible'));

        // Trigger per-section inits
        if (id === 'tentang') initCardObserver();
        if (id === 'confess') startConfess();
        if (id === 'answer')  initNoButton();

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
})();

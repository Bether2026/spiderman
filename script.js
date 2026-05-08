/* ═══════════════════════════════════════════
   BETHER STUDIO — SPIDERMAN BDAY — script.js
   ═══════════════════════════════════════════ */

// ── CONFIG ──────────────────────────────────
const PARTY_DATE = new Date('2026-06-25T17:00:00-03:00');
const VILLAIN_IMG_SRC = 'Villano1.png';

// ── GLOBALS ──────────────────────────────────
let musicPlaying = false;
const audio = document.getElementById('bgMusic');

// ══════════════════════════════════════════════
// 1. OPENING — Web canvas + animated lines
// ══════════════════════════════════════════════
(function initWebCanvas() {
  const canvas = document.getElementById('webCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [];

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Spider-web nodes
  function genNodes(n) {
    nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }
  }
  genNodes(30);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(200,216,240,${0.12 * (1 - d / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    // dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,216,240,0.3)';
      ctx.fill();
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ══════════════════════════════════════════════
// 2. OPENING → MAIN TRANSITION
// ══════════════════════════════════════════════
document.getElementById('btnStart').addEventListener('click', function () {
  // Web shot effect on button
  webShotEffect(this);

  const overlay = document.getElementById('transitionOverlay');
  overlay.classList.add('active');

  setTimeout(() => {
    document.getElementById('opening').classList.remove('active');
    document.getElementById('opening').style.display = 'none';
    document.getElementById('mainExperience').classList.remove('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('floatingMusic').style.display = 'flex';
    overlay.classList.remove('active');
    overlay.style.display = 'none';

    // Start scroll observer
    initScrollReveal();
    // Hero spidey entrance
    heroSpideyEntrance();
  }, 1800);
});

function webShotEffect(el) {
  const rect = el.getBoundingClientRect();
  const shot = document.createElement('div');
  shot.className = 'web-shot';
  shot.textContent = '🕸';
  shot.style.left = (rect.left + rect.width / 2) + 'px';
  shot.style.top  = (rect.top  + rect.height / 2) + 'px';
  document.body.appendChild(shot);
  setTimeout(() => shot.remove(), 600);
}

// ══════════════════════════════════════════════
// 3. HERO SPIDEY ENTRANCE ANIMATION
// ══════════════════════════════════════════════
function heroSpideyEntrance() {
  const s = document.getElementById('heroSpidey');
  s.style.transform = 'translateX(120%) rotate(15deg)';
  s.style.opacity = '0';
  s.style.transition = 'transform 1.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease';
  requestAnimationFrame(() => {
    setTimeout(() => {
      s.style.transform = '';
      s.style.opacity = '1';
    }, 200);
  });
}

// ══════════════════════════════════════════════
// 4. SCROLL REVEAL
// ══════════════════════════════════════════════
function initScrollReveal() {
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  sections.forEach(s => obs.observe(s));
}

// ══════════════════════════════════════════════
// 5. COUNTDOWN
// ══════════════════════════════════════════════
function updateCountdown() {
  const now  = new Date();
  const diff = PARTY_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').querySelector('.cd-num').textContent  = '00';
    document.getElementById('cd-hours').querySelector('.cd-num').textContent = '00';
    document.getElementById('cd-mins').querySelector('.cd-num').textContent  = '00';
    document.getElementById('cd-secs').querySelector('.cd-num').textContent  = '00';
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  const fmt = n => String(n).padStart(2, '0');

  function setAndPulse(id, val) {
    const el  = document.getElementById(id);
    const num = el.querySelector('.cd-num');
    if (num.textContent !== fmt(val)) {
      num.textContent = fmt(val);
      el.style.transform = 'scale(1.15)';
      setTimeout(() => { el.style.transform = ''; }, 200);
    }
  }

  setAndPulse('cd-days',  days);
  setAndPulse('cd-hours', hours);
  setAndPulse('cd-mins',  mins);
  setAndPulse('cd-secs',  secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ══════════════════════════════════════════════
// 6. MINI GAME — ATRAPA VILLANOS
// ══════════════════════════════════════════════
(function initGame() {
  const arena     = document.getElementById('gameArena');
  const canvas    = document.getElementById('gameCanvas');
  const ctx       = canvas.getContext('2d');
  const overlay   = document.getElementById('gameOverlay');
  const endScreen = document.getElementById('gameEnd');
  const scoreEl   = document.getElementById('gameScore');
  const timerEl   = document.getElementById('gameTimer');
  const livesEl   = document.getElementById('gameLives');
  const finalEl   = document.getElementById('finalScore');
  const crosshair = document.getElementById('gameCrosshair');

  let villains = [], score = 0, lives = 3, timeLeft = 30;
  let running = false, raf, interval;
  const villainImg = new Image();
  villainImg.src = VILLAIN_IMG_SRC;

  // canvas sizing
  function resizeCanvas() {
    canvas.width  = arena.clientWidth;
    canvas.height = arena.clientHeight;
  }

  // Villain factory
  function spawnVillain() {
    const size = 55 + Math.random() * 30;
    villains.push({
      x:     Math.random() * (canvas.width  - size),
      y:     Math.random() * (canvas.height - size),
      w:     size,
      h:     size,
      life:  2000 + Math.random() * 2000,
      born:  Date.now(),
      vx:    (Math.random() - 0.5) * 1.8,
      vy:    (Math.random() - 0.5) * 1.8,
      alpha: 1,
    });
  }

  function drawFrame() {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background web
    ctx.strokeStyle = 'rgba(200,216,240,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const now = Date.now();
    villains = villains.filter(v => {
      const age = now - v.born;
      if (age > v.life) {
        // Escaped — lose a life
        if (running) {
          lives = Math.max(0, lives - 1);
          updateLives();
          if (lives === 0) endGame();
        }
        return false;
      }

      // fade near end
      v.alpha = age > v.life * 0.7 ? 1 - (age - v.life * 0.7) / (v.life * 0.3) : 1;

      // move
      v.x += v.vx;
      v.y += v.vy;
      if (v.x < 0 || v.x + v.w > canvas.width)  v.vx *= -1;
      if (v.y < 0 || v.y + v.h > canvas.height)  v.vy *= -1;

      // draw
      ctx.save();
      ctx.globalAlpha = Math.max(0, v.alpha);
      if (villainImg.complete && villainImg.naturalWidth > 0) {
        ctx.drawImage(villainImg, v.x, v.y, v.w, v.h);
      } else {
        // fallback
        ctx.fillStyle = '#E8012E';
        ctx.beginPath();
        ctx.arc(v.x + v.w/2, v.y + v.h/2, v.w/2, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `${v.w * 0.5}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👿', v.x + v.w/2, v.y + v.h/2);
      }

      // warning ring
      if (v.alpha < 0.6) {
        ctx.strokeStyle = `rgba(232,1,46,${1 - v.alpha})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(v.x - 4, v.y - 4, v.w + 8, v.h + 8);
      }
      ctx.restore();
      return true;
    });

    if (running) raf = requestAnimationFrame(drawFrame);
  }

  function updateLives() {
    livesEl.textContent = '❤️'.repeat(lives) || '💔';
  }

  function startGame() {
    score = 0; lives = 3; timeLeft = 30;
    villains = [];
    running = true;
    overlay.style.display = 'none';
    endScreen.style.display = 'none';
    scoreEl.textContent = 0;
    timerEl.textContent = 30;
    updateLives();

    // Spawn loop
    const spawnLoop = setInterval(() => {
      if (!running) { clearInterval(spawnLoop); return; }
      const count = Math.min(1 + Math.floor((30 - timeLeft) / 8), 3);
      for (let i = 0; i < count; i++) spawnVillain();
    }, 900);

    // Timer
    interval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0 || !running) {
        clearInterval(interval);
        clearInterval(spawnLoop);
        endGame();
      }
    }, 1000);

    raf = requestAnimationFrame(drawFrame);
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(raf);
    finalEl.textContent = score;
    endScreen.style.display = 'flex';
    // Fireworks if good score
    if (score >= 5) launchFireworks();
  }

  // Click / tap to catch villain
  function handleHit(e) {
    if (!running) return;
    const rect = arena.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    for (let i = villains.length - 1; i >= 0; i--) {
      const v = villains[i];
      if (cx >= v.x && cx <= v.x + v.w && cy >= v.y && cy <= v.y + v.h) {
        // HIT!
        hitEffect(rect.left + v.x + v.w/2, rect.top + v.y + v.h/2);
        villains.splice(i, 1);
        score++;
        scoreEl.textContent = score;
        break;
      }
    }
  }

  arena.addEventListener('click',      handleHit);
  arena.addEventListener('touchstart', handleHit, { passive: true });

  // Crosshair
  arena.addEventListener('mousemove', e => {
    const r = arena.getBoundingClientRect();
    crosshair.style.left = (e.clientX - r.left) + 'px';
    crosshair.style.top  = (e.clientY - r.top)  + 'px';
  });

  document.getElementById('btnStartGame').addEventListener('click', startGame);
  document.getElementById('btnRestartGame').addEventListener('click', startGame);

  function hitEffect(x, y) {
    const el = document.createElement('div');
    el.textContent = '🕸';
    el.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      font-size:2rem; pointer-events:none;
      z-index:9999; transform:translate(-50%,-50%);
      animation: webShot 0.5s forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }
})();

// ══════════════════════════════════════════════
// 7. RSVP FORM
// ══════════════════════════════════════════════
(function initRSVP() {
  let count = 1, attending = 'yes';

  document.getElementById('btnMinus').addEventListener('click', () => {
    if (count > 1) count--;
    document.getElementById('counterVal').textContent = count;
  });
  document.getElementById('btnPlus').addEventListener('click', () => {
    if (count < 10) count++;
    document.getElementById('counterVal').textContent = count;
  });

  document.getElementById('btnYes').addEventListener('click', function () {
    attending = 'yes';
    this.classList.add('active');
    document.getElementById('btnNo').classList.remove('active');
  });
  document.getElementById('btnNo').addEventListener('click', function () {
    attending = 'no';
    this.classList.add('active');
    document.getElementById('btnYes').classList.remove('active');
  });

  document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    if (!name) return;

    // WhatsApp pre-fill
    const msg = attending === 'yes'
      ? `¡Hola! Soy ${name} y confirmo asistencia al cumple de Benjamín 🕷 Somos ${count} persona${count>1?'s':''}. ¡Nos vemos el 25 de junio!`
      : `¡Hola! Soy ${name}, lamentablemente no voy a poder ir al cumple de Benjamín 😔 ¡Muchos saludos!`;

    // Show success
    this.style.display = 'none';
    document.getElementById('rsvpSuccess').style.display = 'block';
    launchFireworks();

    // Open WhatsApp after short delay
    setTimeout(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }, 1000);
  });
})();

// ══════════════════════════════════════════════
// 8. MUSIC
// ══════════════════════════════════════════════
function toggleMusic() {
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
    document.getElementById('musicLabel').textContent = '🔇 Activar Música';
    document.getElementById('floatingMusic').textContent = '🔇';
  } else {
    audio.volume = 0.4;
    audio.play().catch(() => {});
    musicPlaying = true;
    document.getElementById('musicLabel').textContent = '🔊 Música ON';
    document.getElementById('floatingMusic').textContent = '🎵';
  }
}

document.getElementById('btnMusic').addEventListener('click', toggleMusic);
document.getElementById('floatingMusic').addEventListener('click', toggleMusic);

// ══════════════════════════════════════════════
// 9. FIREWORKS
// ══════════════════════════════════════════════
function launchFireworks() {
  const fw = document.getElementById('fireworks');
  const colors = ['#E8012E','#FFD700','#0A1E5E','#FFFFFF','#C8D8F0','#FF6B6B'];

  for (let b = 0; b < 5; b++) {
    setTimeout(() => {
      const cx = 15 + Math.random() * 70;
      const cy = 10 + Math.random() * 60;
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'firework-particle';
        const angle = (i / 20) * Math.PI * 2;
        const speed = 60 + Math.random() * 80;
        const tx = Math.cos(angle) * speed;
        const ty = Math.sin(angle) * speed;
        const dur = 1 + Math.random() * 0.8;
        const delay = Math.random() * 0.3;
        p.style.cssText = `
          left:${cx}%; top:${cy}%;
          background:${colors[Math.floor(Math.random()*colors.length)]};
          --tx:${tx}px; --ty:${ty}px;
          --dur:${dur}s; --delay:${delay}s;
        `;
        fw.appendChild(p);
        setTimeout(() => p.remove(), (dur + delay) * 1000 + 200);
      }
    }, b * 400);
  }
}

// ══════════════════════════════════════════════
// 10. CLOSE SECTION — Auto fireworks on visible
// ══════════════════════════════════════════════
(function () {
  const closeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        launchFireworks();
        // Close spidey swing-in
        const cs = document.getElementById('closeSpidey');
        cs.style.transform = 'translateX(120%) rotate(-20deg)';
        cs.style.opacity = '0';
        cs.style.transition = 'transform 1.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.8s ease';
        setTimeout(() => {
          cs.style.transform = '';
          cs.style.opacity = '1';
        }, 100);
        closeObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  // Observe once mainExperience loads
  const wait = setInterval(() => {
    const el = document.getElementById('closeSection');
    if (el) { closeObs.observe(el); clearInterval(wait); }
  }, 300);
})();

// ══════════════════════════════════════════════
// 11. CURSOR WEB TRAIL
// ══════════════════════════════════════════════
(function () {
  let lastTrail = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrail < 80) return;
    lastTrail = now;
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;
      left:${e.clientX}px;
      top:${e.clientY}px;
      width:6px; height:6px;
      background:rgba(232,1,46,0.5);
      border-radius:50%;
      pointer-events:none;
      z-index:9998;
      transform:translate(-50%,-50%);
      animation:webShot 0.8s forwards;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
  });
})();

// ══════════════════════════════════════════════
// 12. PARALLAX on hero section
// ══════════════════════════════════════════════
window.addEventListener('scroll', () => {
  const spidey = document.getElementById('heroSpidey');
  if (!spidey) return;
  const scrollY = window.scrollY;
  spidey.style.transform = `translateY(${scrollY * 0.15}px)`;
});

console.log('🕷 Bether Studio — Cumple Benjamín 2026 — ¡Con grandes poderes vienen grandes fiestas!');

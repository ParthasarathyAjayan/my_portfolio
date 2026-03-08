/* ===================================================================
   PARTHASARATHY A — PORTFOLIO  |  script.js
   =================================================================== */

'use strict';

/* ───────────────────────────────────────────────────
   1. PROGRESS BAR (top scroll indicator)
   ─────────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / total) * 100}%`;
});

/* ───────────────────────────────────────────────────
   2. NAVBAR — scroll state + hamburger
   ─────────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ───────────────────────────────────────────────────
   3. ACTIVE NAV LINK (intersection-based)
   ─────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ───────────────────────────────────────────────────
   4. SCROLL REVEAL
   ─────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

// Stagger siblings
document.querySelectorAll('.skills-grid, .projects-grid, .cert-list, .timeline, .about-grid, .contact-grid')
  .forEach(parent => {
    [...parent.querySelectorAll('.reveal')].forEach((el, idx) => {
      el.dataset.delay = idx * 90;
    });
  });

revealEls.forEach(el => revealObserver.observe(el));

/* ───────────────────────────────────────────────────
   5. TYPING ANIMATION
   ─────────────────────────────────────────────────── */
const phrases = [
  'Production-Grade AI Systems',
  'RAG Pipelines & LLM Workflows',
  'Multi-Agent Architectures',
  'Semantic Search Solutions',
  'Python Automation Frameworks',
  'Cloud-Native GenAI Apps'
];

const typedEl = document.getElementById('typedText');
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let paused    = false;

function typeLoop() {
  if (paused) { setTimeout(typeLoop, 1800); paused = false; return; }

  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; paused = true; }
    setTimeout(typeLoop, 65);
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(typeLoop, 35);
  }
}

typeLoop();

/* ───────────────────────────────────────────────────
   6. COUNTER ANIMATION (hero stats)
   ─────────────────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;

  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current < target) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  tick();
}

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

/* ───────────────────────────────────────────────────
   7. PROFICIENCY BARS ANIMATION
   ─────────────────────────────────────────────────── */
const profFills = document.querySelectorAll('.prof-fill');
const profObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const targetWidth = el.style.getPropertyValue('--w');
      // Animate by setting width
      el.style.width = targetWidth;
      profObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

profFills.forEach(el => {
  el.style.width = '0%'; // reset before observe
  profObserver.observe(el);
});

/* ── Skill-level bars (per-card proficiency) ────────────────────────── */
const skillBars = document.querySelectorAll('.skill-level-bar');
const skillBarObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const level = bar.dataset.level || 80;
      const fill = bar.querySelector('.skill-level-fill');
      if (fill) {
        setTimeout(() => {
          fill.style.width = level + '%';
          bar.closest('.skill-card').classList.add('bar-animated');
        }, 200);
      }
      skillBarObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });

skillBars.forEach(bar => {
  const fill = bar.querySelector('.skill-level-fill');
  if (fill) fill.style.width = '0%';
  skillBarObserver.observe(bar);
});

/* ───────────────────────────────────────────────────
   8. PARTICLE CANVAS
   ─────────────────────────────────────────────────── */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let W, H;

  const PARTICLE_COUNT = 70;
  const MAX_DIST       = 130;
  const ACCENT         = '0,212,255';
  const ACCENT2        = '124,58,237';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? ACCENT : ACCENT2;
  }
  Particle.prototype.move = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.move();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},0.25)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < MAX_DIST) {
          const alpha = 1 - dist / MAX_DIST;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${p.color},${alpha * 0.06})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ───────────────────────────────────────────────────
   9. CONTACT FORM (local feedback — no backend)
   ─────────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = contactForm.querySelector('button[type=submit]');
    const orig = btn.innerHTML;

    btn.innerHTML  = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML  = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}

/* ───────────────────────────────────────────────────
   10. SMOOTH ANCHOR SCROLL (offset for navbar)
   ─────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH   = document.getElementById('navbar').offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ───────────────────────────────────────────────────
   11. CURSOR GLOW (subtle mouse trail)
   ─────────────────────────────────────────────────── */
(function cursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
  });
})();

/* ───────────────────────────────────────────────────
   12. NAV LINK ACTIVE STYLE (injected CSS)
   ─────────────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--accent-1) !important;
  }
  .nav-links a.active::after {
    transform: scaleX(1) !important;
    transform-origin: left !important;
  }
`;
document.head.appendChild(style);

/* ───────────────────────────────────────────────────
   13. AUTO-SCROLL (slow, pauses on user interaction)
   ─────────────────────────────────────────────────── */
(function () {
  const SPEED = 0.6;          // pixels per animation frame (~0.6px @ 60fps)
  const PAUSE_MS = 4000;      // pause 4s after user scrolls/touches
  const START_DELAY = 3000;   // wait 3s before beginning

  let autoScrolling = true;
  let pauseTimer    = null;
  let rafId         = null;
  let started       = false;

  function step() {
    if (autoScrolling) {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (window.scrollY < maxScroll) {
        window.scrollBy(0, SPEED);
      } else {
        // reached bottom — stop
        return;
      }
    }
    rafId = requestAnimationFrame(step);
  }

  function pause() {
    autoScrolling = false;
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => {
      autoScrolling = true;
    }, PAUSE_MS);
  }

  // Pause on any user scroll or touch
  window.addEventListener('wheel',      pause, { passive: true });
  window.addEventListener('touchstart', pause, { passive: true });
  window.addEventListener('keydown',    (e) => {
    const scrollKeys = ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '];
    if (scrollKeys.includes(e.key)) pause();
  });

  // Also pause permanently if user manually scrolls up (user is browsing intentionally)
  let lastY = 0;
  window.addEventListener('scroll', () => {
    if (window.scrollY < lastY - 10) {
      // scrolled up significantly — stop auto-scroll permanently
      autoScrolling = false;
      cancelAnimationFrame(rafId);
      clearTimeout(pauseTimer);
    }
    lastY = window.scrollY;
  }, { passive: true });

  // Start after delay
  setTimeout(() => {
    started = true;
    rafId = requestAnimationFrame(step);
  }, START_DELAY);
})();

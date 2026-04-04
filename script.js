/* ================================================================
   DEEP SPACE TERMINAL — Portfolio JavaScript
   Author: Replace with your name
   ================================================================

   CONTENTS
   1.  Custom Cursor
   2.  Navigation: scroll state + mobile menu + active links
   3.  Hero Typing Animation
   4.  Particle System (Hero)
   5.  Scroll Reveal (Intersection Observer)
   6.  Skill Bars Animation
   7.  Animated Counters (About stats)
   8.  Contact Form
   9.  Smooth Anchor Scrolling
   10. Initialise Everything

================================================================ */

'use strict';

/* ================================================================
   1. NAVIGATION
================================================================ */
function initNav() {
  const nav     = document.getElementById('mainNav');
  const burger  = document.getElementById('navBurger');
  const links   = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav__link');

  if (!nav) return;

  /* ---- Scroll: add .scrolled class ---- */
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  /* ---- Mobile burger toggle ---- */
  if (burger && links) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      links.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));

      /* Prevent body scroll when menu is open */
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close menu when a link is clicked */
    navLinkEls.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        burger.classList.remove('open');
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Active link highlighting based on scroll position ---- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    const scrollY = window.scrollY + 120; // offset for nav height

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
}

/* ================================================================
   3. HERO TYPING ANIMATION
   REPLACE: The 'phrases' array below with your own job titles.
================================================================ */
function initTyping() {
  const el = document.getElementById('heroTyping');
  if (!el) return;

  /* ============================================================
     REPLACE: Add your own titles / phrases here
     ============================================================ */
  const phrases = [
    'full-stack apps.',
    'sleek interfaces.',
    'scalable APIs.',
    'great experiences.',
    'open-source tools.',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPausing   = false;

  const TYPING_SPEED   = 80;   // ms per character while typing
  const DELETING_SPEED = 45;   // ms per character while deleting
  const PAUSE_AFTER    = 1800; // ms to wait at end of phrase
  const PAUSE_BEFORE   = 400;  // ms to wait before typing next phrase

  function tick() {
    const phrase = phrases[phraseIndex];

    if (isPausing) {
      isPausing = false;
      setTimeout(tick, isDeleting ? PAUSE_BEFORE : PAUSE_AFTER);
      return;
    }

    if (!isDeleting) {
      /* Typing forward */
      el.textContent = phrase.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        isDeleting = true;
        isPausing  = true;
      }
    } else {
      /* Deleting */
      el.textContent = phrase.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting   = false;
        isPausing    = true;
        phraseIndex  = (phraseIndex + 1) % phrases.length;
      }
    }

    const delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    setTimeout(tick, delay);
  }

  /* Small initial delay so it doesn't fire instantly */
  setTimeout(tick, 1000);
}

/* ================================================================
   4. PARTICLE SYSTEM (Hero)
================================================================ */
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const PARTICLE_COUNT = 28;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    /* Random size 2–5px */
    const size = Math.random() * 3 + 2;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';

    /* Random horizontal position */
    p.style.left = Math.random() * 100 + '%';

    /* Start at random vertical position within lower 60% */
    p.style.top = (40 + Math.random() * 60) + '%';

    /* Vary the colour between cyan and violet */
    p.style.background = Math.random() > 0.5 ? '#00f5d4' : '#b14aed';
    p.style.opacity    = '0';

    /* Random animation duration and delay */
    const duration = 6 + Math.random() * 10;
    const delay    = Math.random() * 8;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay   = delay + 's';

    container.appendChild(p);
  }
}

/* ================================================================
   5. SCROLL REVEAL (Intersection Observer)
================================================================ */
function initScrollReveal() {
  const revealChildren = document.querySelectorAll('.reveal__child');
  console.log('Found reveal children:', revealChildren.length);
  
  const options = {
    root:      null,
    threshold: 0,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Element visible:', entry.target);
        entry.target.classList.add('visible');
        /* For skill bars, trigger the fill animation */
        const skillBars = entry.target.querySelectorAll
          ? entry.target.querySelectorAll('.skill-bar__fill')
          : [];
        skillBars.forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        /* For stats, trigger counter */
        const statNums = entry.target.querySelectorAll
          ? entry.target.querySelectorAll('.stat__num')
          : [];
        statNums.forEach(num => {
          if (!num.dataset.animated) animateCounter(num);
        });
      }
    });
  }, options);

  /* Observe all .reveal__child elements */
  revealChildren.forEach(el => {
    console.log('Observing element:', el);
    observer.observe(el);
  });
}

/* ================================================================
   6. SKILL BARS ANIMATION
   Each .skill-bar div gets a label + track built dynamically.
================================================================ */
function buildSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const label = bar.dataset.skill || 'Skill';
    const pct   = bar.dataset.pct   || '80';

    /* Label row */
    const labelRow = document.createElement('div');
    labelRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:0.45rem;';

    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    labelEl.style.cssText = 'font-size:0.88rem;color:var(--text);';

    const pctEl = document.createElement('span');
    pctEl.textContent = pct + '%';
    pctEl.style.cssText = 'font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);';

    labelRow.appendChild(labelEl);
    labelRow.appendChild(pctEl);

    /* Track */
    const track = document.createElement('div');
    track.classList.add('skill-bar__track');

    const fill = document.createElement('div');
    fill.classList.add('skill-bar__fill');
    fill.dataset.pct = pct;
    fill.style.width = '0';

    track.appendChild(fill);
    bar.innerHTML = '';
    bar.appendChild(labelRow);
    bar.appendChild(track);
  });
}

/* ================================================================
   7. ANIMATED COUNTERS (About Section)
================================================================ */
function animateCounter(el) {
  el.dataset.animated = 'true';
  const target   = parseInt(el.dataset.count, 10);
  const duration = 1500; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    /* Ease out cubic */
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ================================================================
   8. CONTACT FORM
   REPLACE: The form submission logic below to connect to your
   backend, a service like Formspree, EmailJS, or similar.
================================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const message = document.getElementById('formMessage');
  const submit  = document.getElementById('contactSubmit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Basic client-side validation */
    const name    = form.querySelector('#contactName').value.trim();
    const email   = form.querySelector('#contactEmail').value.trim();
    const subject = form.querySelector('#contactSubject').value.trim();
    const body    = form.querySelector('#contactMessage').value.trim();

    if (!name || !email || !subject || !body) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    /* Disable button during submission */
    submit.disabled = true;
    submit.querySelector('.btn__text').textContent = 'Sending…';

    try {
      /* ============================================================
         REPLACE: Replace this block with your actual form submission.
         Examples:
           - Formspree:  fetch('https://formspree.io/f/YOUR_FORM_ID', ...)
           - EmailJS:    emailjs.send(serviceId, templateId, params)
           - Your API:   fetch('/api/contact', { method:'POST', ... })

         The simulated delay below is for demo purposes only.
         ============================================================ */
      await simulateSend({ name, email, subject, body });

      showMessage('✓ Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
    } catch (err) {
      showMessage('Something went wrong. Please try again or email me directly.', 'error');
      console.error('Form submission error:', err);
    } finally {
      submit.disabled = false;
      submit.querySelector('.btn__text').textContent = 'Send Message';
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className   = 'form-message ' + type;
    message.style.marginTop = '0.5rem';
    /* Auto-clear after 6 seconds */
    setTimeout(() => {
      message.textContent = '';
      message.className   = 'form-message';
    }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
     REMOVE this function once you connect your real form endpoint.
     It's only here so the demo UI works without a backend.
     ============================================================ */
  function simulateSend(data) {
    console.log('Form data (demo — not actually sent):', data);
    return new Promise(resolve => setTimeout(resolve, 1400));
  }
}

/* ================================================================
   9. SMOOTH ANCHOR SCROLLING
   Handles clicks on all href="#section" links.
================================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id     = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ================================================================
   10. INITIALISE EVERYTHING
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTyping();
  initParticles();
  buildSkillBars();  /* must run before initScrollReveal */
  initScrollReveal();
  initContactForm();
  initSmoothScroll();

  /* Immediately reveal elements that are visible on page load */
  setTimeout(() => {
    document.querySelectorAll('.reveal__child').forEach(el => {
      const rect = el.getBoundingClientRect();
      // If element is in viewport (top is above bottom of viewport, bottom is below top)
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        console.log('Making visible on load:', el);
        el.classList.add('visible');
        // Trigger animations for skill bars and counters
        el.querySelectorAll && el.querySelectorAll('.skill-bar__fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        el.querySelectorAll && el.querySelectorAll('.stat__num').forEach(num => {
          if (!num.dataset.animated) animateCounter(num);
        });
      }
    });
  }, 100);
});

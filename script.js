/* ============================================================
   SAKIR VEKARIYA — Portfolio Scripts v3
   Features: Typing Effect, Stats Counter, Scroll Reveal,
             Navbar, Form Handling, Smooth Scroll
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('navList');
  const navItems = document.querySelectorAll('.nav-item');
  const scrollTopBtn = document.getElementById('scrollTop');
  const yearSpan = document.getElementById('year');
  const revealEls = document.querySelectorAll('.reveal');

  // Set current year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ==================== TYPING EFFECT ====================
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'Python Developer',
      'Django & FastAPI Developer',
      'Full-Stack Web Developer'
    ];
    let idx = 0, char = 0, deleting = false;

    function type() {
      const phrase = phrases[idx];
      if (deleting) {
        typingEl.textContent = phrase.substring(0, char - 1);
        char--;
      } else {
        typingEl.textContent = phrase.substring(0, char + 1);
        char++;
      }

      if (!deleting && char === phrase.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      if (deleting && char === 0) {
        deleting = false;
        idx = (idx + 1) % phrases.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, deleting ? 30 : 75);
    }
    setTimeout(type, 800);
  }

  // ==================== STAT COUNTER ====================
  const statNums = document.querySelectorAll('.stat-num');
  let statsCounted = false;

  function countStats() {
    if (statsCounted) return;
    statsCounted = true;

    statNums.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 1500;
      const step = Math.max(1, Math.floor(target / 40));
      let current = 0;

      const increment = () => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          return;
        }
        el.textContent = current;
        requestAnimationFrame(() => setTimeout(increment, 30));
      };
      increment();
    });
  }

  // Observe stats section for counter trigger
  const statsRow = document.querySelector('.hero-stats');
  if (statsRow && statNums.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsRow);
  }

  // ==================== HAMBURGER MENU ====================
  if (hamburger && navList) {
    function closeMenu() {
      hamburger.classList.remove('active');
      navList.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function toggleMenu() {
      const open = navList.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    navItems.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navList.classList.contains('active')) closeMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!header.contains(e.target) && navList.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // ==================== NAVBAR SCROLL ====================
  function handleScroll() {
    const y = window.scrollY;
    if (y > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      const h = s.offsetHeight;
      if (y >= top && y < top + h) current = s.getAttribute('id');
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
    });

    // Scroll to top button
    if (scrollTopBtn) {
      if (y > 400) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }
  }

  // Initial state
  requestAnimationFrame(() => {
    handleScroll();
  });
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Scroll to top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== SCROLL REVEAL ====================
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add small random delay for staggered feel
          const delay = Math.random() * 150;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // ==================== SMOOTH SCROLL (anchor links) ====================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.offsetTop - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==================== CONTACT FORM ====================
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('cf-email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');
      const submitBtn = this.querySelector('button[type="submit"]');

      // Validate
      let valid = true;
      [name, email, message].forEach(f => {
        f.style.borderColor = '';
        if (!f.value.trim()) {
          f.style.borderColor = 'var(--accent)';
          valid = false;
        }
      });

      if (!valid) {
        // Shake animation
        this.style.animation = 'shake 0.4s ease';
        setTimeout(() => { this.style.animation = ''; }, 500);
        return;
      }

      // Show sending state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Open mailto
      const s = encodeURIComponent(subject.value || 'Portfolio Contact');
      const b = encodeURIComponent(
        `Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`
      );

      setTimeout(() => {
        window.location.href = `mailto:vekariyasakir02@gmail.com?subject=${s}&body=${b}`;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }, 600);
    });

    // Reset validation on input
    form.querySelectorAll('input, textarea').forEach(f => {
      f.addEventListener('input', () => {
        f.style.borderColor = '';
      });
    });
  }

  // Add shake keyframe if not in CSS
  if (!document.querySelector('#shakeKeyframes')) {
    const style = document.createElement('style');
    style.id = 'shakeKeyframes';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }
});

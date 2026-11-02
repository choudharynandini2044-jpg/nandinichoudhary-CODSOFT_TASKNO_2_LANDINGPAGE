(function () {
  'use strict';

  // Navbar scroll state
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => revealObserver.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => counterObserver.observe(c));

  // Contact form validation
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name (min 2 chars).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email.',
    subject: (v) => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.',
    message: (v) => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
  };
  function showError(field, msg) {
    const group = field.closest('.form-group');
    group.classList.toggle('invalid', !!msg);
    const err = group.querySelector('.error');
    if (err) err.textContent = msg;
  }
  function validateField(field) {
    const fn = validators[field.name];
    if (!fn) return true;
    const msg = fn(field.value);
    showError(field, msg);
    return !msg;
  }
  form.querySelectorAll('input, textarea').forEach((f) => {
    f.addEventListener('blur', () => validateField(f));
    f.addEventListener('input', () => {
      if (f.closest('.form-group').classList.contains('invalid')) validateField(f);
    });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('input, textarea').forEach((f) => {
      if (!validateField(f)) ok = false;
    });
    if (!ok) {
      status.textContent = 'Please fix the errors above.';
      status.className = 'form-status error';
      return;
    }
    status.textContent = 'Sending...';
    status.className = 'form-status';
    // Frontend demo: simulate submission
    setTimeout(() => {
      status.textContent = 'Message sent successfully! We will get back to you soon.';
      status.className = 'form-status success';
      form.reset();
      form.querySelectorAll('.form-group').forEach((g) => g.classList.remove('invalid'));
      form.querySelectorAll('.error').forEach((e) => (e.textContent = ''));
    }, 900);
  });
})();

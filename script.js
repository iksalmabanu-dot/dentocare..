/* ═══════════════════════════════════════════════════════
   D CARE DENTAL — script.js
════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Navbar: scroll + active link ─── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveLink();
    updateBackToTop();
  }, { passive: true });

  updateNavbar();

  /* ─── Hamburger mobile menu ─── */
  const hamburger  = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinksEl.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ─── Back to top ─── */
  const backToTop = document.getElementById('backToTop');

  function updateBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Smooth scrolling for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Contact Form Validation & Submission ─── */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const btnText     = submitBtn.querySelector('.btn-text');
  const btnLoading  = submitBtn.querySelector('.btn-loading');
  const successAlert = document.getElementById('successAlert');
  const errorAlert  = document.getElementById('errorAlert');

  /* Field helpers */
  function showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (input) input.classList.add('error');
    if (error) error.textContent = msg;
  }

  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
  }

  /* Validators */
  function validateName(val) {
    if (!val.trim()) return 'Full name is required.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return null;
  }

  function validatePhone(val) {
    const digits = val.replace(/\D/g, '');
    if (!val.trim()) return 'Phone number is required.';
    if (!/^[6-9]\d{9}$/.test(digits)) return 'Enter a valid 10-digit Indian mobile number.';
    return null;
  }

  function validateEmail(val) {
    if (!val.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
    return null;
  }

  function validateMessage(val) {
    if (!val.trim()) return 'Please enter a message.';
    if (val.trim().length < 10) return 'Message must be at least 10 characters.';
    return null;
  }

  /* Live validation on blur */
  [
    { id: 'name',    fn: validateName    },
    { id: 'phone',   fn: validatePhone   },
    { id: 'email',   fn: validateEmail   },
    { id: 'message', fn: validateMessage },
  ].forEach(({ id, fn }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => {
      const err = fn(el.value);
      err ? showError(id, err) : clearError(id);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const err = fn(el.value);
        err ? showError(id, err) : clearError(id);
      }
    });
  });

  function validateAll() {
    const fields = [
      { id: 'name',    fn: validateName    },
      { id: 'phone',   fn: validatePhone   },
      { id: 'email',   fn: validateEmail   },
      { id: 'message', fn: validateMessage },
    ];
    let valid = true;
    fields.forEach(({ id, fn }) => {
      const el = document.getElementById(id);
      const err = fn(el ? el.value : '');
      if (err) { showError(id, err); valid = false; }
      else { clearError(id); }
    });
    return valid;
  }

  /* Form submission */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous alerts
    successAlert.style.display = 'none';
    errorAlert.style.display   = 'none';

    if (!validateAll()) return;

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display   = 'none';
    btnLoading.style.display = 'flex';

    const payload = {
      name:    document.getElementById('name').value.trim(),
      phone:   document.getElementById('phone').value.trim(),
      email:   document.getElementById('email').value.trim(),
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        successAlert.style.display = 'block';
        form.reset();
        // Scroll to success message
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(data.message || 'Server error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      errorAlert.style.display = 'block';
      errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      submitBtn.disabled = false;
      btnText.style.display   = 'inline';
      btnLoading.style.display = 'none';
    }
  });

  /* ─── Intersection Observer for subtle card reveals ─── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.review-card, .about-card-main').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

})();

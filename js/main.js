// ═══════════════════════════════════════════
// PRELOADER
// ═══════════════════════════════════════════
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) setTimeout(() => preloader.classList.add('hidden'), 500);
});

// ═══════════════════════════════════════════
// NAVBAR SCROLL
// ═══════════════════════════════════════════
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('visible', y > 500);
}, { passive: true });

// ═══════════════════════════════════════════
// BACK TO TOP
// ═══════════════════════════════════════════
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══════════════════════════════════════════
// HAMBURGER / MOBILE MENU
// ═══════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu [data-page], .mobile-menu .mobile-cta-btn').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});

// ═══════════════════════════════════════════
// SPA ROUTING
// ═══════════════════════════════════════════
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-page]').forEach(a => a.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) {
    page.classList.add('active');
    page.style.animation = 'none';
    page.offsetHeight;
    page.style.animation = '';
  }

  document.querySelectorAll('[data-page="' + pageId + '"]').forEach(a => a.classList.add('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    observeReveals();
    if (pageId === 'home') startCounters();
  }, 80);
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('data-page');
    if (target) showPage(target);
  });
});

// ═══════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════
function observeReveals() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  reveals.forEach(el => io.observe(el));
}

// ═══════════════════════════════════════════
// ANIMATED COUNTERS
// ═══════════════════════════════════════════
let countersStarted = false;
function animateCounter(el, target, duration) {
  duration = duration || 1800;
  const start = performance.now();
  const suffix = el.dataset.suffix || '';
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('[data-count]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.count, 10));
  });
}

// ═══════════════════════════════════════════
// SECTOR TABS
// ═══════════════════════════════════════════
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sector-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.sector);
    if (target) target.classList.add('active');
    setTimeout(observeReveals, 50);
  });
});

// ═══════════════════════════════════════════
// CONTACT FORM → WhatsApp
// ═══════════════════════════════════════════
const WHATSAPP_NUMBER = '27763323230';

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('.form-error').forEach(e => e.classList.remove('visible'));
  form.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

  const name = form.querySelector('[name="name"]');
  const phone = form.querySelector('[name="phone"]');
  const service = form.querySelector('[name="service"]');

  if (!name.value.trim()) {
    name.classList.add('error');
    document.getElementById('nameError').classList.add('visible');
    valid = false;
  }
  if (!phone.value.trim()) {
    phone.classList.add('error');
    document.getElementById('phoneError').classList.add('visible');
    valid = false;
  }
  if (!service.value) {
    service.classList.add('error');
    document.getElementById('serviceError').classList.add('visible');
    valid = false;
  }
  return valid;
}

function buildWhatsAppMessage(form) {
  const get = (n) => (form.querySelector('[name="' + n + '"]') || {}).value || '';
  const lines = [
    '*New quote request – Khesekho Electrical*',
    '',
    '*Name:* ' + get('name'),
    '*Phone:* ' + get('phone'),
    get('email') ? '*Email:* ' + get('email') : '',
    get('service') ? '*Service:* ' + get('service') : '',
    get('message') ? '*Message:* ' + get('message') : ''
  ].filter(Boolean);
  return lines.join('\n');
}

document.querySelectorAll('#contactForm input, #contactForm select').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
    const err = input.closest('.form-group').querySelector('.form-error');
    if (err) err.classList.remove('visible');
  });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm(this)) return;

    const btn = this.querySelector('.btn-submit');
    const success = document.getElementById('formSuccess');

    btn.textContent = 'Opening WhatsApp...';
    btn.disabled = true;

    const text = buildWhatsAppMessage(this);
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank');

    btn.innerHTML = 'Sent <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px"><polyline points="20 6 9 17 4 12"/></svg>';
    btn.style.background = 'linear-gradient(135deg, #059669, #10B981)';
    if (success) success.classList.add('visible');
    contactForm.reset();

    setTimeout(() => {
      btn.innerHTML = 'Send via WhatsApp <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      btn.style.background = '';
      btn.disabled = false;
      if (success) success.classList.remove('visible');
    }, 5000);
  });
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
showPage('home');

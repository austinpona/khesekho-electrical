// ═══════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ═══════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-menu [data-page]').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ═══════════════════════════════════════════
// SPA ROUTING
// ═══════════════════════════════════════════
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('[data-page]').forEach(a => a.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(a => a.classList.add('active'));

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-observe reveals after page switch
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
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => io.observe(el));
}

// ═══════════════════════════════════════════
// ANIMATED COUNTERS
// ═══════════════════════════════════════════
let countersStarted = false;
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isPlus = el.dataset.suffix === '+';
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + (isPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('[data-count]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.count));
  });
}

// ═══════════════════════════════════════════
// SECTOR TABS (Services page)
// ═══════════════════════════════════════════
document.querySelectorAll('.sector-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sector-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sector-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.sector);
    if (target) target.classList.add('active');
    setTimeout(observeReveals, 50);
  });
});

// ═══════════════════════════════════════════
// CONTACT FORM → WhatsApp (076 332 3230)
// ═══════════════════════════════════════════
const WHATSAPP_NUMBER = '27763323230'; // South Africa: 076 332 3230

function buildWhatsAppMessage(form) {
  const name = (form.querySelector('[name="name"]') || {}).value || '';
  const phone = (form.querySelector('[name="phone"]') || {}).value || '';
  const email = (form.querySelector('[name="email"]') || {}).value || '';
  const service = (form.querySelector('[name="service"]') || {}).value || '';
  const message = (form.querySelector('[name="message"]') || {}).value || '';
  const lines = [
    '*New quote request – Khesekho Electrical*',
    '',
    '*Name:* ' + name,
    '*Phone:* ' + phone,
    email ? '*Email:* ' + email : '',
    service ? '*Service:* ' + service : '',
    message ? '*Message:* ' + message : ''
  ].filter(Boolean);
  return lines.join('\n');
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const success = document.getElementById('formSuccess');
    btn.textContent = 'Opening WhatsApp...';
    btn.disabled = true;

    const text = buildWhatsAppMessage(this);
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank');

    btn.textContent = 'Send Message ✓';
    btn.style.background = 'linear-gradient(135deg, #059669, #10B981)';
    if (success) success.style.display = 'block';
    success.textContent = "✅ Opening WhatsApp — send the message there. We'll reply shortly.";
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
      btn.disabled = false;
      if (success) {
        success.style.display = 'none';
        success.textContent = "✅ Message sent! We'll be in touch shortly.";
      }
    }, 5000);
  });
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
showPage('home');

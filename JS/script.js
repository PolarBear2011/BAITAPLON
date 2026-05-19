/* ─── THEME TOGGLE ─── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
let darkMode = false;

themeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  html.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  themeBtn.textContent = darkMode ? '☀️' : '🌙';
});

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  if (window.scrollY > 400) {
    document.getElementById('scrollTop').classList.add('visible');
  } else {
    document.getElementById('scrollTop').classList.remove('visible');
  }
});

/* ─── HAMBURGER MOBILE MENU ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  menuOverlay.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  document.body.classList.remove('menu-open');
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    closeMobile(); 
  }
});

/* ─── SCROLL SPY ACTIVE MENU ─── */
const sections = document.querySelectorAll('section[id]');
const desktopLinks = document.querySelectorAll('#desktopNavLinks a');
const mobileLinks = document.querySelectorAll('#mobileMenu .mobile-link');

window.addEventListener('scroll', () => {
  let currentSectionId = '';
  const scrollPosition = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  desktopLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });

  mobileLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    } else if (currentSectionId === '' && link.getAttribute('href') === '#') {
      link.classList.add('active');
    }
  });
});

/* ─── INTERSECTION OBSERVER REVEAL & PROGRESS BAR ─── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      
      const bar = e.target.querySelector('.progress-bar');
      if (bar) {
        setTimeout(() => {
          bar.style.width = bar.style.width = bar.getAttribute('data-width') + '%';
        }, 300);
      }
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

/* ─── COUNTER ANIMATION ─── */
const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const rawTarget = e.target.getAttribute('data-count');
      const isFloat = rawTarget.includes('.');
      const target = parseFloat(rawTarget);
      const suffix = e.target.getAttribute('data-suffix') || '';
      
      let current = 0;
      const duration = 1000; 
      const frameRate = 16;  
      const totalFrames = duration / frameRate;
      const step = target / totalFrames;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        e.target.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      }, frameRate);
      counterObs.unobserve(e.target); 
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ─── BACKGROUND PARTICLES ─── */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  if(!canvas) return;
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 3 + 1;
    this.vx = (Math.random() - .5) * .4;
    this.vy = -Math.random() * .6 - .2;
    this.alpha = Math.random() * .4 + .1;
    this.color = Math.random() > .5 ? '#5db53a' : '#48cae4';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 40; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─── FORM VALIDATION & TOAST NOTIFICATION ─── */
function submitForm() {
  const name = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const campaign = document.getElementById('formCampaign').value;

  if (!name || !email || !campaign) {
    showToast('⚠️ Vui lòng cung cấp đủ thông tin đăng ký!', '#f59e0b');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Địa chỉ Email chưa đúng định dạng!', '#f59e0b');
    return;
  }
  
  showToast('🌱 Đăng ký thành công! Cảm ơn bạn đồng hành cùng GreenEarth!', '#3a9020');
  
  document.getElementById('formName').value = '';
  document.getElementById('formEmail').value = '';
  document.getElementById('formCampaign').value = '';
}

function showToast(msg, color) {
  const t = document.createElement('div');
  t.style.cssText = `
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: ${color}; color: #fff; padding: .85rem 1.75rem;
    border-radius: 99px; font-weight: 600; font-size: .95rem;
    z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,.15); width: calc(100% - 2rem); max-width: 400px; text-align: center;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ─── SMOOTH SCROLL ANCHOR LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      const offset = 70; 
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── PARALLAX MOUSE EFFECT ─── */
window.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 1024) return; 
  const orbMover = document.getElementById('orbMover');
  if(!orbMover) return;
  const mx = (e.clientX / window.innerWidth - .5) * 25;
  const my = (e.clientY / window.innerHeight - .5) * 25;
  orbMover.style.transform = `translate(${mx}px, ${my}px)`;
});
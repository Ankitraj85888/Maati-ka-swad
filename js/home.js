/* =====================================================
   MAATI KA SWAD — Home Page JS
   ===================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderCarousel();
  renderTestimonials();
  initCarousel();
  initTestimonialsSlider();
});

function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = window.CATEGORIES.map(cat => `
    <div class="category-card reveal" onclick="window.location.href='shop.html?cat=${cat.id}'" style="cursor:pointer">
      <img src="${cat.image}" alt="${cat.name}" class="category-card-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:linear-gradient(135deg,${cat.color}44,${cat.color}88);font-size:6rem">${cat.emoji}</div>
      <div class="category-card-overlay"></div>
      <div class="category-card-body">
        <div class="category-card-emoji">${cat.emoji}</div>
        <div class="category-card-name">${cat.name}</div>
        <div class="category-card-count">${cat.count} Products · ${cat.desc}</div>
        <span class="category-card-btn">Explore ${cat.name} →</span>
      </div>
    </div>
  `).join('');
  window.initScrollReveal();
}

// Carousel state
let carouselIdx = 0;
const VISIBLE = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4;

function renderCarousel() {
  const track = document.getElementById('product-carousel');
  if (!track) return;
  // Show bestsellers + 2 more products
  const featured = window.PRODUCTS.filter(p => p.badge === 'bestseller');
  const others = window.PRODUCTS.filter(p => p.badge !== 'bestseller').slice(0, 2);
  const products = [...featured, ...others].slice(0, 8);
  track.innerHTML = products.map(p => window.buildProductCard(p)).join('');
}

function initCarousel() {
  const track = document.getElementById('product-carousel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsEl = document.getElementById('carousel-dots');
  if (!track || !prevBtn) return;

  const totalGroups = () => Math.ceil(8 / VISIBLE());

  function buildDots() {
    if (!dotsEl) return;
    const n = Math.ceil(8 / VISIBLE());
    dotsEl.innerHTML = Array.from({length: n}, (_, i) =>
      `<div class="carousel-dot ${i === carouselIdx ? 'active' : ''}" onclick="goCarousel(${i})"></div>`
    ).join('');
  }

  window.goCarousel = (idx) => {
    const n = totalGroups();
    carouselIdx = Math.max(0, Math.min(idx, n - 1));
    const cardW = track.querySelector('.product-card')?.offsetWidth || 280;
    const gap = 24;
    track.style.transform = `translateX(-${carouselIdx * (cardW + gap) * VISIBLE()}px)`;
    buildDots();
  };

  prevBtn.addEventListener('click', () => window.goCarousel(carouselIdx - 1));
  nextBtn.addEventListener('click', () => window.goCarousel(carouselIdx + 1));

  buildDots();
  // Auto-advance
  setInterval(() => window.goCarousel((carouselIdx + 1) % totalGroups()), 4500);
  window.addEventListener('resize', () => { carouselIdx = 0; window.goCarousel(0); });
}

// Testimonials slider
let testIdx = 0;

function renderTestimonials() {
  const track = document.getElementById('testimonials-track');
  if (!track) return;
  track.innerHTML = window.TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div class="star-rating mb-16">
        <span class="stars" style="font-size:1rem">${window.getStarHTML(t.rating)}</span>
      </div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar" style="background:var(--primary)">${t.initials}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-location">📍 ${t.location}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function initTestimonialsSlider() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('test-prev');
  const nextBtn = document.getElementById('test-next');
  const dotsEl  = document.getElementById('test-dots');
  if (!track) return;

  const visT = () => window.innerWidth < 600 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const total = window.TESTIMONIALS.length;

  function buildDots() {
    if (!dotsEl) return;
    const n = Math.ceil(total / visT());
    dotsEl.innerHTML = Array.from({length: n}, (_, i) =>
      `<div class="carousel-dot ${i === testIdx ? 'active' : ''}" onclick="goTest(${i})"></div>`
    ).join('');
  }

  window.goTest = (idx) => {
    const n = Math.ceil(total / visT());
    testIdx = Math.max(0, Math.min(idx, n - 1));
    const card = track.querySelector('.testimonial-card');
    if (!card) return;
    const w = card.offsetWidth + 24;
    track.style.transform = `translateX(-${testIdx * w * visT()}px)`;
    buildDots();
  };

  if (prevBtn) prevBtn.addEventListener('click', () => window.goTest(testIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => window.goTest(testIdx + 1));
  buildDots();
  setInterval(() => window.goTest((testIdx + 1) % Math.ceil(total / visT())), 5500);
}

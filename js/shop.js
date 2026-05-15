/* =====================================================
   MAATI KA SWAD — Shop Page JS
   ===================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Check URL params for category pre-filter
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam) {
    // Uncheck "all", check the specific category
    document.querySelector('input[name="cat"][value="all"]').checked = false;
    const catInput = document.querySelector(`input[name="cat"][value="${catParam}"]`);
    if (catInput) catInput.checked = true;
    // Update hero text
    const cat = window.CATEGORIES.find(c => c.id === catParam);
    if (cat) {
      document.getElementById('shop-hero-title').textContent = `${cat.emoji} ${cat.name}`;
      document.getElementById('shop-hero-desc').textContent = cat.desc;
      document.getElementById('breadcrumb-cat').textContent = cat.name;
    }
  }
  applyFilters();
});

function getSelectedCategories() {
  const all = document.querySelector('input[name="cat"][value="all"]');
  if (all?.checked) return [];
  const checks = document.querySelectorAll('input[name="cat"]:checked');
  return Array.from(checks).map(c => c.value).filter(v => v !== 'all');
}

function getSelectedBadges() {
  return Array.from(document.querySelectorAll('input[name="badge"]:checked')).map(c => c.value);
}

window.applyFilters = () => {
  let products = [...window.PRODUCTS];
  const cats = getSelectedCategories();
  const badges = getSelectedBadges();
  const maxPrice = parseInt(document.getElementById('price-range')?.value || 300);
  const sort = document.getElementById('sort-select')?.value || 'default';

  if (cats.length) products = products.filter(p => cats.includes(p.category));
  if (badges.length) products = products.filter(p => badges.includes(p.badge));
  products = products.filter(p => p.price <= maxPrice);

  switch (sort) {
    case 'price-asc':  products.sort((a,b) => a.price - b.price); break;
    case 'price-desc': products.sort((a,b) => b.price - a.price); break;
    case 'rating':     products.sort((a,b) => b.rating - a.rating); break;
    case 'new':        products.sort((a,b) => b.id - a.id); break;
  }

  renderProducts(products);
  updateActiveFilters(cats, badges, maxPrice);
};

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  const noEl = document.getElementById('no-products');
  const countEl = document.getElementById('result-count');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = '';
    noEl.style.display = 'block';
  } else {
    noEl.style.display = 'none';
    grid.innerHTML = products.map(p => window.buildProductCard(p)).join('');
  }
  if (countEl) countEl.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
}

function updateActiveFilters(cats, badges, maxPrice) {
  const el = document.getElementById('active-filters');
  if (!el) return;
  const tags = [];
  cats.forEach(c => {
    const cat = window.CATEGORIES.find(x => x.id === c);
    if (cat) tags.push(`<div class="active-filter-tag">${cat.emoji} ${cat.name} <button onclick="removeCatFilter('${c}')">✕</button></div>`);
  });
  badges.forEach(b => tags.push(`<div class="active-filter-tag">🏷️ ${b.charAt(0).toUpperCase()+b.slice(1)} <button onclick="removeBadgeFilter('${b}')">✕</button></div>`));
  if (maxPrice < 300) tags.push(`<div class="active-filter-tag">💰 Under ₹${maxPrice} <button onclick="resetPrice()">✕</button></div>`);
  el.innerHTML = tags.join('');
}

window.removeCatFilter = (val) => {
  const input = document.querySelector(`input[name="cat"][value="${val}"]`);
  if (input) { input.checked = false; }
  const any = Array.from(document.querySelectorAll('input[name="cat"]')).some(i => i.checked && i.value !== 'all');
  if (!any) document.querySelector('input[name="cat"][value="all"]').checked = true;
  window.applyFilters();
};

window.removeBadgeFilter = (val) => {
  const input = document.querySelector(`input[name="badge"][value="${val}"]`);
  if (input) input.checked = false;
  window.applyFilters();
};

window.resetPrice = () => {
  const r = document.getElementById('price-range');
  if (r) { r.value = 300; updatePriceLabel(300); }
  window.applyFilters();
};

window.updatePriceLabel = (v) => {
  const el = document.getElementById('price-label');
  if (el) el.textContent = v;
};

window.clearFilters = () => {
  document.querySelectorAll('input[name="cat"]').forEach(i => { i.checked = i.value === 'all'; });
  document.querySelectorAll('input[name="badge"]').forEach(i => i.checked = false);
  const r = document.getElementById('price-range');
  if (r) { r.value = 300; updatePriceLabel(300); }
  document.getElementById('sort-select').value = 'default';
  window.applyFilters();
};

window.setView = (view, btn) => {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.classList.toggle('list-view', view === 'list');
  }
};

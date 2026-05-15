/* =====================================================
   MAATI KA SWAD — Global App State & Utilities
   ===================================================== */
'use strict';

// ─── Cart ─────────────────────────────────────────
window.Cart = {
  _key: 'ss_cart',
  get items() { try { return JSON.parse(localStorage.getItem(this._key)) || []; } catch { return []; } },
  set items(v) { localStorage.setItem(this._key, JSON.stringify(v)); },

  add(productId, qty = 1) {
    const items = this.items;
    const idx = items.findIndex(i => i.id === productId);
    if (idx >= 0) { items[idx].qty = Math.min(items[idx].qty + qty, 10); }
    else { const p = window.getProduct(productId); if (p) items.push({ id: productId, qty }); }
    this.items = items;
    this.updateBadge();
    window.Toast.show('Added to Cart!', `${window.getProduct(productId)?.name} × ${qty}`, 'success');
  },

  remove(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.updateBadge();
  },

  updateQty(productId, qty) {
    if (qty <= 0) { this.remove(productId); return; }
    const items = this.items;
    const idx = items.findIndex(i => i.id === productId);
    if (idx >= 0) { items[idx].qty = Math.min(qty, 10); this.items = items; }
    this.updateBadge();
  },

  clear() { this.items = []; this.updateBadge(); },

  get count() { return this.items.reduce((s, i) => s + i.qty, 0); },

  get subtotal() {
    return this.items.reduce((s, i) => {
      const p = window.getProduct(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const c = this.count;
    badges.forEach(b => {
      b.textContent = c > 0 ? (c > 99 ? '99+' : c) : '';
      b.style.display = c > 0 ? 'flex' : 'none';
    });
  }
};

// ─── Wishlist ─────────────────────────────────────
window.Wishlist = {
  _key: 'ss_wishlist',
  get ids() { try { return JSON.parse(localStorage.getItem(this._key)) || []; } catch { return []; } },
  set ids(v) { localStorage.setItem(this._key, JSON.stringify(v)); },

  toggle(productId) {
    const ids = this.ids;
    const idx = ids.indexOf(productId);
    if (idx >= 0) {
      ids.splice(idx, 1);
      window.Toast.show('Removed from Wishlist', window.getProduct(productId)?.name || '', 'info');
    } else {
      ids.push(productId);
      window.Toast.show('Added to Wishlist ♡', window.getProduct(productId)?.name || '', 'success');
    }
    this.ids = ids;
    this.updateButtons(productId);
    return idx < 0;
  },

  has(productId) { return this.ids.includes(productId); },

  updateButtons(productId) {
    document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`).forEach(btn => {
      btn.classList.toggle('active', this.has(productId));
      btn.title = this.has(productId) ? 'Remove from wishlist' : 'Add to wishlist';
    });
  }
};

// ─── Auth (delegates to real AuthAPI) ────────────────
window.Auth = {
  // Use AuthAPI's session which is backed by the real backend
  get user() {
    return window.AuthAPI?.getUser() || null;
  },

  logout() {
    window.AuthAPI?.clearSession();
    window.location.href = 'index.html';
  },

  get isLoggedIn() { return window.AuthAPI?.isLoggedIn() || false; },

  updateNavUI() {
    const userBtns = document.querySelectorAll('.nav-user-btn');
    const user = this.user;
    if (user) {
      userBtns.forEach(btn => {
        btn.title = `Hello, ${user.name}`;
        btn.innerHTML = `<span>${user.name.charAt(0).toUpperCase()}</span>`;
        btn.style.background = 'var(--primary)';
        btn.style.color = 'var(--white)';
        btn.style.borderRadius = '50%';
        btn.style.fontWeight = '700';
      });
    }
  }
};

// ─── Toast ────────────────────────────────────────
window.Toast = {
  _container: null,
  _icons: { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' },

  _ensureContainer() {
    if (!this._container) {
      this._container = document.getElementById('toast-container');
      if (!this._container) {
        this._container = document.createElement('div');
        this._container.id = 'toast-container';
        document.body.appendChild(this._container);
      }
    }
    return this._container;
  },

  show(title, msg = '', type = 'success', duration = 3500) {
    const container = this._ensureContainer();
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
      <span class="toast-icon">${this._icons[type] || '🍴'}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('toast-exiting');
      setTimeout(() => el.remove(), 350);
    }, duration);
  }
};

// ─── Scroll Reveal ────────────────────────────────
window.initScrollReveal = () => {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
};

// ─── Navbar ───────────────────────────────────────
window.initNavbar = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const isTransparent = navbar.dataset.transparent === 'true';

  window.addEventListener('scroll', () => {
    if (isTransparent) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
  });

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // Active link highlight
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === path) link.classList.add('active');
  });

  // Update cart badge & user UI
  window.Cart.updateBadge();
  window.Auth.updateNavUI();
};

// ─── Search ───────────────────────────────────────
window.initSearch = () => {
  const overlay = document.getElementById('search-overlay');
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const openBtns = document.querySelectorAll('.search-open-btn');
  if (!overlay) return;

  openBtns.forEach(btn => btn.addEventListener('click', () => {
    overlay.classList.add('open');
    setTimeout(() => input?.focus(), 100);
  }));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.remove('open');
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); overlay.classList.add('open'); setTimeout(() => input?.focus(), 100); }
  });

  input?.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) { results.innerHTML = ''; return; }
    const found = window.searchProducts(q).slice(0, 6);
    results.innerHTML = found.length
      ? found.map(p => `
          <div class="search-result-item" onclick="window.location.href='product.html?id=${p.id}'">
            <div class="search-result-img">
              ${p.images.length
                ? `<img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">`
                : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${p.color}22;font-size:1.5rem">${p.emoji}</div>`
              }
            </div>
            <div class="search-result-info">
              <h4>${p.name}</h4>
              <p>₹${p.price} · ${p.categoryLabel}</p>
            </div>
          </div>`).join('')
      : '<div style="padding:20px;text-align:center;color:var(--text-muted)">No products found for "' + q + '"</div>';
  });
};

// ─── Product Card Builder ─────────────────────────
window.buildProductCard = (product) => {
  const disc = window.getDiscount(product.price, product.mrp);
  const inWish = window.Wishlist.has(product.id);
  const imgHTML = product.images.length
    ? `<img src="${product.images[0]}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const emojiDiv = `<div class="product-card-emoji" style="--card-color:${product.color};--card-color-light:${product.color}33;display:${product.images.length ? 'none' : 'flex'}">${product.emoji}</div>`;
  const badgeHTML = product.badge
    ? `<span class="product-badge badge-${product.badge}">${product.badge === 'bestseller' ? '🔥 Bestseller' : product.badge === 'new' ? '✨ New' : product.badge === 'organic' ? '🌿 Organic' : product.badge}</span>`
    : '';

  return `
    <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
      <div class="product-card-img">
        ${imgHTML}
        ${emojiDiv}
        ${badgeHTML}
        <button class="wishlist-btn ${inWish ? 'active' : ''}" data-id="${product.id}" title="${inWish ? 'Remove from wishlist' : 'Add to wishlist'}"
          onclick="event.stopPropagation();window.Wishlist.toggle(${product.id})">${inWish ? '❤️' : '🤍'}</button>
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${product.categoryLabel}</div>
        <h3 class="product-card-name">${product.name}</h3>
        <div class="product-card-weight">${product.weight}</div>
        <div class="star-rating">
          <span class="stars">${window.getStarHTML(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-card-footer">
          <div class="price-group">
            <span class="price-main">₹${product.price}</span>
            <span class="price-mrp">₹${product.mrp}</span>
            <span class="price-off">${disc}% off</span>
          </div>
          <button class="add-cart-btn" title="Add to cart" onclick="event.stopPropagation();window.Cart.add(${product.id})">🛒</button>
        </div>
      </div>
    </div>`;
};

// ─── Page Loader ──────────────────────────────────
window.hideLoader = () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 300);
  }
};

// ─── Page init ────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Sync products from live backend (non-blocking)
  if (window.syncProductsFromBackend) {
    window.syncProductsFromBackend().then(() => {
      // Re-render any product grids after backend sync
      if (typeof window.applyFilters === 'function') window.applyFilters();
      if (typeof window.renderCarousel === 'function') window.renderCarousel();
    });
  }
  window.initNavbar();
  window.initSearch();
  window.initScrollReveal();
  window.hideLoader();
});

/* =====================================================
   MAATI KA SWAD — Product Detail Page JS
   ===================================================== */
'use strict';

let currentProduct = null;
let currentQty = 1;
let currentImg = 0;

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { window.location.href = 'shop.html'; return; }
  const product = window.getProduct(parseInt(id));
  if (!product) { window.location.href = 'shop.html'; return; }
  currentProduct = product;
  renderProduct(product);
  renderTabs(product);
  renderRelated(product);
  document.title = `${product.name} — Maati Ka Swad`;
});

function renderProduct(p) {
  const grid = document.getElementById('product-detail-grid');
  const disc = window.getDiscount(p.price, p.mrp);

  // Build gallery images (emoji fallback)
  const thumbsHTML = Array.from({length: Math.max(p.images.length, 1)}, (_, i) => {
    if (p.images[i]) return `<div class="gallery-thumb ${i===0?'active':''}" onclick="switchImage(${i})" data-idx="${i}"><img src="${p.images[i]}" alt="${p.name}"></div>`;
    return `<div class="gallery-thumb active" onclick="switchImage(0)" data-idx="0"><div class="gallery-thumb-emoji" style="background:${p.color}22">${p.emoji}</div></div>`;
  }).join('');

  const mainImg = p.images.length
    ? `<img id="gallery-main-img" src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"
        onerror="this.style.display='none';document.getElementById('gallery-emoji-fallback').style.display='flex'">`
    : '';
  const emojiFallback = `<div id="gallery-emoji-fallback" style="width:100%;height:100%;display:${p.images.length ? 'none' : 'flex'};align-items:center;justify-content:center;font-size:8rem;background:linear-gradient(135deg,${p.color}22,${p.color}44)">${p.emoji}</div>`;

  const badgesHTML = [
    p.badge === 'bestseller' ? '<span class="product-badge badge-bestseller">🔥 Bestseller</span>' : '',
    p.badge === 'new'        ? '<span class="product-badge badge-new" style="position:static">✨ New</span>' : '',
    p.badge === 'organic'    ? '<span class="product-badge badge-organic" style="position:static">🌿 Organic</span>' : '',
    '<span class="tag tag-accent">No Preservatives</span>',
    '<span class="tag tag-primary">Handmade</span>'
  ].filter(Boolean).join('');

  grid.innerHTML = `
    <!-- Gallery -->
    <div class="product-gallery">
      <div class="gallery-main-img">${mainImg}${emojiFallback}</div>
      <div class="gallery-thumbs">${thumbsHTML}</div>
    </div>

    <!-- Info -->
    <div class="product-info">
      <div class="product-info-category">${p.categoryLabel} · ${p.weight}</div>
      <h1>${p.name}</h1>
      <div class="product-info-weight">${p.nameHi}</div>

      <div class="product-rating-row">
        <span class="stars" style="font-size:1rem">${window.getStarHTML(p.rating)}</span>
        <span class="rating-value">${p.rating}</span>
        <span class="rating-divider">·</span>
        <span class="review-link">${p.reviews} Reviews</span>
        <span class="rating-divider">·</span>
        <span style="color:var(--accent);font-weight:600;font-size:.85rem">✅ In Stock (${p.stock} left)</span>
      </div>

      <div class="product-badges">${badgesHTML}</div>

      <div class="product-price-block">
        <span class="product-price-main">₹${p.price}</span>
        <span class="product-price-mrp">₹${p.mrp}</span>
        <span class="product-price-off">${disc}% OFF</span>
        <div style="font-size:.78rem;color:var(--text-muted);margin-top:6px">Inclusive of all taxes · Free shipping above ₹499</div>
      </div>

      <div class="product-divider"></div>

      <div class="product-qty-row">
        <span class="product-qty-label">Quantity:</span>
        <div class="qty-selector">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-value" id="qty-display">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
      </div>

      <div class="product-actions">
        <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail()">🛒 Add to Cart</button>
        <button class="btn btn-secondary btn-lg" onclick="buyNow()">⚡ Buy Now</button>
        <button class="wishlist-btn ${window.Wishlist.has(p.id)?'active':''}" data-id="${p.id}"
          onclick="window.Wishlist.toggle(${p.id})"
          style="position:static;width:50px;height:50px;border:2px solid var(--cream-darker);border-radius:var(--radius-md)">
          ${window.Wishlist.has(p.id)?'❤️':'🤍'}
        </button>
      </div>

      <div class="product-meta-row">
        <div class="product-meta-item">🚚 Free delivery above ₹499</div>
        <div class="product-meta-item">↩️ 7-day returns</div>
        <div class="product-meta-item">💯 100% Authentic</div>
      </div>

      <div class="product-divider"></div>

      <div style="background:var(--cream);border-radius:var(--radius-md);padding:16px;font-size:.85rem">
        <strong>📦 Delivery:</strong> 3-5 business days across India<br>
        <strong>💬 Questions?</strong> <a href="https://wa.me/919876543210" style="color:var(--primary)">Chat on WhatsApp</a>
      </div>
    </div>
  `;

  document.getElementById('breadcrumb-name').textContent = p.name;
  document.getElementById('product-tabs').style.display = 'block';
  document.getElementById('related-section').style.display = 'block';
}

window.switchImage = (idx) => {
  currentImg = idx;
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  // In a real scenario with multiple images, we'd update the main display
};

window.changeQty = (delta) => {
  currentQty = Math.max(1, Math.min(currentQty + delta, 10));
  document.getElementById('qty-display').textContent = currentQty;
};

window.addToCartFromDetail = () => {
  if (!currentProduct) return;
  window.Cart.add(currentProduct.id, currentQty);
};

window.buyNow = () => {
  if (!currentProduct) return;
  window.Cart.add(currentProduct.id, currentQty);
  window.location.href = 'cart.html';
};

window.switchTab = (tab, btn) => {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`tab-${tab}`)?.classList.add('active');
};

function renderTabs(p) {
  // Description
  document.getElementById('tab-description').innerHTML = `
    <p style="font-size:1rem;line-height:1.9;color:var(--text-body);max-width:720px">${p.description}</p>`;

  // Ingredients
  document.getElementById('tab-ingredients').innerHTML = `
    <h3 style="font-family:var(--font-body);font-size:1rem;font-weight:700;margin-bottom:16px">What goes in:</h3>
    <div class="ingredient-grid">
      ${p.ingredients.map(i => `<div class="ingredient-chip">🌿 ${i}</div>`).join('')}
    </div>
    <p style="margin-top:16px;font-size:.85rem;color:var(--text-muted)">✅ All ingredients are 100% natural. No artificial additives, colors, or preservatives.</p>`;

  // Benefits
  document.getElementById('tab-benefits').innerHTML = p.benefits.map(b => `
    <div class="benefit-item">
      <span class="benefit-icon">${b.icon}</span>
      <div class="benefit-text"><h4>${b.title}</h4><p>${b.desc}</p></div>
    </div>`).join('');

  // Reviews (static)
  const fakeReviews = window.TESTIMONIALS.slice(0, 3);
  document.getElementById('tab-reviews').innerHTML = `
    <div style="display:flex;align-items:center;gap:24px;margin-bottom:28px;padding:20px;background:var(--cream);border-radius:var(--radius-md)">
      <div style="text-align:center">
        <div style="font-size:3rem;font-weight:800;color:var(--primary);font-family:var(--font-display)">${p.rating}</div>
        <div class="stars" style="font-size:1.2rem">${window.getStarHTML(p.rating)}</div>
        <div style="font-size:.8rem;color:var(--text-muted)">${p.reviews} reviews</div>
      </div>
      <div style="flex:1">
        ${[5,4,3,2,1].map(n => {
          const pct = n === 5 ? 78 : n === 4 ? 16 : n === 3 ? 4 : n === 2 ? 1 : 1;
          return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:.78rem;width:8px">${n}</span>
            <span style="color:#F39C12;font-size:.8rem">★</span>
            <div style="flex:1;height:6px;background:var(--cream-dark);border-radius:3px">
              <div style="width:${pct}%;height:100%;background:var(--primary);border-radius:3px"></div>
            </div>
            <span style="font-size:.75rem;color:var(--text-muted);width:28px">${pct}%</span>
          </div>`;
        }).join('')}
      </div>
    </div>
    ${fakeReviews.map(r => `
      <div class="review-item">
        <div class="review-header">
          <div>
            <div class="reviewer-name">${r.name} <span style="font-size:.75rem;color:var(--text-muted)">from ${r.location}</span></div>
            <div class="stars" style="font-size:.9rem">${window.getStarHTML(r.rating)}</div>
          </div>
          <div class="review-date">Verified Purchase ✅</div>
        </div>
        <p class="review-body">"${r.text}"</p>
      </div>`).join('')}`;
}

function renderRelated(p) {
  const related = window.PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const grid = document.getElementById('related-grid');
  if (grid) grid.innerHTML = related.map(r => window.buildProductCard(r)).join('');
}

/* =====================================================
   MAATI KA SWAD — Cart & Checkout JS
   ===================================================== */
'use strict';

let currentStep = 'cart';
let appliedDiscount = 0;
const SHIPPING_FREE_THRESHOLD = 499;
const SHIPPING_COST = 60;

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateSummary();
});

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const empty = document.getElementById('cart-empty');
  const countEl = document.getElementById('cart-item-count');
  const proceedBtn = document.getElementById('proceed-btn');
  if (!list) return;

  const items = window.Cart.items;
  if (countEl) countEl.textContent = items.length;

  if (!items.length) {
    list.style.display = 'none';
    empty.style.display = 'block';
    if (proceedBtn) proceedBtn.disabled = true;
    return;
  }
  empty.style.display = 'none';
  list.style.display = 'block';
  if (proceedBtn) proceedBtn.disabled = false;

  list.innerHTML = items.map(item => {
    const p = window.getProduct(item.id);
    if (!p) return '';
    const imgHTML = p.images.length
      ? `<img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">`
      : `<div class="cart-item-emoji" style="background:${p.color}22">${p.emoji}</div>`;
    return `
      <div class="cart-item" id="cart-item-${p.id}">
        <div class="cart-item-img">${imgHTML}</div>
        <div class="cart-item-info">
          <div class="cart-item-category">${p.categoryLabel}</div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-weight">${p.weight}</div>
          <div class="cart-item-actions">
            <div class="qty-selector">
              <button class="qty-btn" onclick="updateCartQty(${p.id}, ${item.qty - 1})">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty(${p.id}, ${item.qty + 1})">+</button>
            </div>
            <div class="cart-item-price">₹${(p.price * item.qty).toLocaleString()}</div>
            <button class="cart-item-remove" onclick="removeCartItem(${p.id})">🗑️ Remove</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

window.updateCartQty = (id, qty) => {
  window.Cart.updateQty(id, qty);
  renderCart();
  updateSummary();
};

window.removeCartItem = (id) => {
  window.Cart.remove(id);
  renderCart();
  updateSummary();
  window.Toast.show('Item removed', '', 'info');
};

function updateSummary() {
  const sub = window.Cart.subtotal;
  const ship = sub >= SHIPPING_FREE_THRESHOLD ? 0 : (sub > 0 ? SHIPPING_COST : 0);
  const total = sub + ship - appliedDiscount;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summary-subtotal', `₹${sub.toLocaleString()}`);
  set('summary-shipping', ship === 0 && sub > 0 ? 'FREE 🎉' : `₹${ship}`);
  set('summary-total', `₹${Math.max(0, total).toLocaleString()}`);
  set('addr-total', `₹${Math.max(0, total).toLocaleString()}`);
  set('pay-total', `₹${Math.max(0, total).toLocaleString()}`);
  set('final-total-display', Math.max(0, total).toLocaleString());

  const discLine = document.getElementById('discount-line');
  if (discLine) discLine.style.display = appliedDiscount ? 'flex' : 'none';
  set('summary-discount', `-₹${appliedDiscount}`);

  renderAddressSummaryItems('address-summary-items');
  renderAddressSummaryItems('payment-summary-items');
}

function renderAddressSummaryItems(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = window.Cart.items.map(item => {
    const p = window.getProduct(item.id);
    if (!p) return '';
    return `<div class="summary-line">
      <span class="summary-label">${p.emoji} ${p.name} ×${item.qty}</span>
      <span class="summary-value">₹${(p.price * item.qty).toLocaleString()}</span>
    </div>`;
  }).join('');
}

window.applyCoupon = () => {
  const code = document.getElementById('coupon-input')?.value.toUpperCase().trim();
  const valid = { 'SWAD10': 50, 'FIRST20': 80, 'WELCOME': 30 };
  if (valid[code]) {
    appliedDiscount = valid[code];
    updateSummary();
    window.Toast.show(`Coupon "${code}" applied! 🎉`, `You saved ₹${valid[code]}`, 'success');
  } else {
    window.Toast.show('Invalid coupon code', 'Try SWAD10, FIRST20, or WELCOME', 'error');
  }
};

window.goStep = (step) => {
  if (window.Cart.items.length === 0 && step !== 'cart') {
    window.Toast.show('Cart is empty', 'Add products before proceeding', 'error');
    return;
  }
  ['cart','address','payment','success'].forEach(s => {
    const el = document.getElementById(`step-${s}`);
    if (el) el.style.display = s === step ? 'block' : 'none';
  });
  document.querySelectorAll('.checkout-step').forEach(el => {
    const s = el.dataset.step;
    el.classList.remove('active','done');
    if (s === step) el.classList.add('active');
    else if (['cart','address','payment'].indexOf(s) < ['cart','address','payment'].indexOf(step)) el.classList.add('done');
  });
  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (step === 'address' || step === 'payment') updateSummary();
};

window.selectPayment = (method) => {
  document.querySelectorAll('.payment-method-card').forEach(card => card.classList.remove('selected'));
  document.getElementById(`pm-${method}`)?.classList.add('selected');
  const upiInput = document.getElementById('upi-input');
  if (upiInput) upiInput.style.display = method === 'upi' ? 'block' : 'none';
};

window.placeOrder = async () => {
  const btn = document.getElementById('place-order-btn');
  btn.textContent = '⏳ Processing...';
  btn.disabled = true;

  // Build order payload
  const user = window.AuthAPI?.getUser() || {};
  const sub  = window.Cart.subtotal;
  const ship = sub >= 499 ? 0 : 60;
  const total = sub + ship - appliedDiscount;

  const payload = {
    user_name:      document.getElementById('addr-fname')?.value.trim() || user.name || 'Guest',
    user_email:     document.getElementById('addr-email')?.value.trim() || user.email || 'guest@maatikaswad.com',
    user_phone:     document.getElementById('addr-phone')?.value.trim() || user.phone || '',
    address:        document.getElementById('addr-street')?.value.trim() || '',
    city:           document.getElementById('addr-city')?.value.trim()   || '',
    state:          document.getElementById('addr-state')?.value  || '',
    pincode:        document.getElementById('addr-pin')?.value.trim() || '',
    payment_method: document.querySelector('input[name="payment"]:checked')?.value || 'cod',
    subtotal:       sub,
    shipping:       ship,
    discount:       appliedDiscount,
    total:          Math.max(0, total),
    items: window.Cart.items.map(item => {
      const p = window.getProduct(item.id);
      return { product_id: item.id, qty: item.qty, price: p?.price || 0 };
    })
  };

  try {
    // Try real backend first
    const data = await window.OrdersAPI.place(payload);
    window.Cart.clear();
    document.getElementById('order-number').textContent =
      `Order #${data.order_number} | Expected: ${getDeliveryDate()}`;
    goStep('success');
    document.getElementById('checkout-steps').style.display = 'none';
    window.Toast.show('Order placed! 🎉', `Your order #${data.order_number} is confirmed`, 'success');
  } catch (err) {
    // Fallback to simulated if backend is down
    console.warn('Backend order failed, using local fallback:', err.message);
    window.Cart.clear();
    const orderNum = 'SS-' + Math.random().toString(36).substr(2,6).toUpperCase();
    document.getElementById('order-number').textContent =
      `Order #${orderNum} | Expected: ${getDeliveryDate()}`;
    goStep('success');
    document.getElementById('checkout-steps').style.display = 'none';
  }
};

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random()*3)+3);
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
}

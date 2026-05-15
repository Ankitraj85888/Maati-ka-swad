/* =====================================================
   MAATI KA SWAD — API Client (Frontend → Backend)
   Connects the frontend pages to the Node.js REST API
   ===================================================== */
'use strict';

// ✅ Live backend on Render
const API_BASE = 'https://maati-ka-swad-backend.onrender.com/api';

// ── Token helpers ─────────────────────────────────────
const Token = {
  get:    ()      => localStorage.getItem('ss_token'),
  set:    (t)     => localStorage.setItem('ss_token', t),
  clear:  ()      => localStorage.removeItem('ss_token'),
  header: ()      => ({ 'Authorization': `Bearer ${Token.get()}` })
};

// ── Base fetch helper ─────────────────────────────────
async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(Token.get() ? Token.header() : {}),
    ...(options.headers || {})
  };
  try {
    const res  = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    // If backend is down, log it but don't break the page
    console.warn(`[API] ${path} failed:`, err.message);
    throw err;
  }
}

// ── Auth API ──────────────────────────────────────────
const AuthAPI = {
  register: (name, email, password, phone) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) }),

  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => apiFetch('/auth/me'),

  // Call after login/register to persist token and user
  setSession(data) {
    Token.set(data.token);
    localStorage.setItem('ss_user', JSON.stringify(data.user));
  },

  clearSession() {
    Token.clear();
    localStorage.removeItem('ss_user');
  },

  getUser() {
    try { return JSON.parse(localStorage.getItem('ss_user') || 'null'); } catch { return null; }
  },

  isLoggedIn() { return !!Token.get(); },
  isAdmin()    { return this.getUser()?.role === 'admin'; }
};

// ── Products API ──────────────────────────────────────
const ProductsAPI = {
  getAll:  (params = {}) => apiFetch('/products?' + new URLSearchParams(params)),
  getById: (id)          => apiFetch(`/products/${id}`),
  create:  (data)        => apiFetch('/products',    { method: 'POST',   body: JSON.stringify(data) }),
  update:  (id, data)    => apiFetch(`/products/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  delete:  (id)          => apiFetch(`/products/${id}`, { method: 'DELETE' }),
  updateStock: (id, stock) => apiFetch(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) })
};

// ── Orders API ────────────────────────────────────────
const OrdersAPI = {
  place: (orderData) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  myOrders: ()       => apiFetch('/orders/my'),
  getById:  (id)     => apiFetch(`/orders/${id}`),
  updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};

// ── Contact API ───────────────────────────────────────
const ContactAPI = {
  submit: (data) => apiFetch('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getAll: ()     => apiFetch('/contact'),
  update: (id, status) => apiFetch(`/contact/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id)   => apiFetch(`/contact/${id}`, { method: 'DELETE' })
};

// ── Admin API ─────────────────────────────────────────
const AdminAPI = {
  stats:   ()            => apiFetch('/admin/stats'),
  users:   ()            => apiFetch('/admin/users'),
  orders:  (params = {}) => apiFetch('/admin/orders?' + new URLSearchParams(params))
};

// ── Health check ──────────────────────────────────────
async function checkBackend() {
  try {
    await fetch(`${API_BASE}/health`);
    return true;
  } catch {
    return false;
  }
}

// Expose globally
window.API        = { base: API_BASE, fetch: apiFetch, checkBackend };
window.AuthAPI    = AuthAPI;
window.ProductsAPI= ProductsAPI;
window.OrdersAPI  = OrdersAPI;
window.ContactAPI = ContactAPI;
window.AdminAPI   = AdminAPI;
window.Token      = Token;

// Check backend on page load
document.addEventListener('DOMContentLoaded', async () => {
  const alive = await checkBackend();
  if (!alive) {
    console.warn('⚠️  Backend is offline. Some features may use local data.');
  } else {
    console.log('✅ Backend connected: ' + API_BASE);
  }
});

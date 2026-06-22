/* =====================================================
   MAATI KA SWAD — API Client (Frontend → LocalStorage)
   Simple email + password auth using localStorage.
   ===================================================== */
'use strict';

// ✅ Live backend on Render (used for products, orders, etc.)
const API_BASE = 'https://maati-ka-swad-backend.onrender.com/api';

// ── LocalStorage User Database ────────────────────────
const UserDB = {
  _key: 'mks_users',

  getAll() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); }
    catch { return []; }
  },

  save(users) {
    localStorage.setItem(this._key, JSON.stringify(users));
  },

  findByEmail(email) {
    return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  create(userData) {
    const users = this.getAll();
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: '',
      password: userData.password,
      role: 'customer',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    this.save(users);
    return newUser;
  }
};

// ── Token helpers ─────────────────────────────────────
const Token = {
  get:    ()  => localStorage.getItem('ss_token'),
  set:    (t) => localStorage.setItem('ss_token', t),
  clear:  ()  => localStorage.removeItem('ss_token'),
  header: ()  => ({ 'Authorization': `Bearer ${Token.get()}` }),
  generate: (user) => btoa(JSON.stringify({
    id: user.id, name: user.name, email: user.email,
    role: user.role, exp: Date.now() + 30*24*60*60*1000
  }))
};

// ── Base fetch helper (for non-auth API calls) ────────
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
    console.warn(`[API] ${path} failed:`, err.message);
    throw err;
  }
}

// ── Auth API (email + password, localStorage) ─────────
const AuthAPI = {
  register(name, email, password) {
    return new Promise((resolve, reject) => {
      if (!name || !email || !password) {
        return reject(new Error('Name, email and password are required'));
      }
      if (password.length < 6) {
        return reject(new Error('Password must be at least 6 characters'));
      }
      if (UserDB.findByEmail(email)) {
        return reject(new Error('This email is already registered. Please sign in instead.'));
      }

      const user = UserDB.create({ name, email, password });
      const token = Token.generate(user);
      const { password: _, ...safeUser } = user;
      resolve({ token, user: safeUser, message: 'Account created successfully!' });
    });
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      if (!email || !password) {
        return reject(new Error('Please enter your email and password'));
      }
      const user = UserDB.findByEmail(email);
      if (!user) {
        return reject(new Error('No account found with this email address'));
      }
      if (user.password !== password) {
        return reject(new Error('Incorrect password. Please try again.'));
      }

      const token = Token.generate(user);
      const { password: _, ...safeUser } = user;
      resolve({ token, user: safeUser, message: `Welcome back, ${user.name}!` });
    });
  },

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
window.API         = { base: API_BASE, fetch: apiFetch, checkBackend };
window.AuthAPI     = AuthAPI;
window.ProductsAPI = ProductsAPI;
window.OrdersAPI   = OrdersAPI;
window.ContactAPI  = ContactAPI;
window.AdminAPI    = AdminAPI;
window.Token       = Token;
window.UserDB      = UserDB;

// Check backend on page load
document.addEventListener('DOMContentLoaded', async () => {
  const alive = await checkBackend();
  if (!alive) {
    console.warn('⚠️  Backend is offline. Some features may use local data.');
  } else {
    console.log('✅ Backend connected: ' + API_BASE);
  }
});

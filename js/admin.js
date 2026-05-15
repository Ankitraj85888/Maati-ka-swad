/* =====================================================
   MAATI KA SWAD — Admin Panel JS (Backend-Connected)
   ===================================================== */
'use strict';

const ADMIN_PASSWORD = 'admin123';

document.addEventListener('DOMContentLoaded', () => {
  // Check if already admin via backend token
  if (localStorage.getItem('ss_admin') === 'true') {
    showAdmin();
    loadDashboard();
  }
  document.getElementById('admin-pwd')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.verifyAdmin();
  });
});

window.verifyAdmin = async () => {
  const pwd = document.getElementById('admin-pwd')?.value;
  // Try backend admin login first
  try {
    const data = await window.AuthAPI.login('admin@maatikaswad.com', pwd);
    if (data.user.role === 'admin') {
      window.AuthAPI.setSession(data);
      localStorage.setItem('ss_admin', 'true');
      showAdmin();
      loadDashboard();
      return;
    }
  } catch {}
  // Fallback: plain password check
  if (pwd === ADMIN_PASSWORD) {
    localStorage.setItem('ss_admin', 'true');
    showAdmin();
    loadDashboard();
  } else {
    window.Toast.show('Incorrect password', 'Hint: try admin123', 'error');
    document.getElementById('admin-pwd').value = '';
  }
};

function showAdmin() {
  document.getElementById('admin-gate').style.display = 'none';
  document.getElementById('admin-layout').style.display = 'grid';
}

// ── Load Dashboard Data ───────────────────────────────
async function loadDashboard() {
  document.getElementById('last-updated').textContent = new Date().toLocaleTimeString('en-IN');

  try {
    const { stats, topProducts, ordersByStatus } = await window.AdminAPI.stats();
    // Update stat cards
    document.getElementById('stat-revenue').textContent  = `₹${stats.totalRevenue.toLocaleString()}`;
    document.getElementById('stat-orders').textContent   = stats.totalOrders;
    document.getElementById('stat-customers').textContent= stats.totalCustomers;
    document.getElementById('stat-products').textContent = stats.totalProducts;

    if (stats.lowStock > 0) {
      document.querySelector('#page-dashboard .stat-card:last-child .stat-card-change').textContent = `⚠️ ${stats.lowStock} low stock`;
    }
    if (stats.pendingOrders > 0) {
      document.querySelector('#page-dashboard .stat-card:nth-child(2) .stat-card-change').textContent = `⚠️ ${stats.pendingOrders} pending`;
    }
    if (stats.unreadMessages > 0) {
      window.Toast.show(`${stats.unreadMessages} unread message(s)`, 'Check contact inbox', 'info');
    }
  } catch {
    // Use mock data if backend is down
    document.getElementById('stat-revenue').textContent   = '₹70,809';
    document.getElementById('stat-orders').textContent    = '150';
    document.getElementById('stat-customers').textContent = '238';
    document.getElementById('stat-products').textContent  = '16';
  }

  renderRecentOrders();
  renderAdminProducts();
  renderOrders();
  renderCustomers();
}

// ── Render Products ───────────────────────────────────
async function renderAdminProducts(query = '') {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  let products = [];
  try {
    const data = await window.ProductsAPI.getAll(query ? { search: query } : {});
    products = data.products;
  } catch {
    products = window.PRODUCTS; // fallback to local
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:var(--radius-sm);background:${p.color||'#eee'}22;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">${p.emoji||'🍴'}</div>
          <div><div style="font-weight:600;font-size:.88rem">${p.name}</div><div style="font-size:.75rem;color:var(--text-muted)">${p.weight||''}</div></div>
        </div>
      </td>
      <td><span class="tag tag-primary" style="text-transform:capitalize">${p.category}</span></td>
      <td><span style="font-weight:700;color:var(--primary)">₹${p.price}</span> <span style="text-decoration:line-through;color:var(--text-muted);font-size:.8rem">₹${p.mrp}</span></td>
      <td><span style="font-weight:600;color:${(p.stock||0) < 10 ? 'var(--error)' : 'var(--accent)'}">${p.stock||0}</span></td>
      <td><span style="color:#F39C12">★</span> <strong>${p.rating}</strong> <span style="font-size:.75rem;color:var(--text-muted)">(${p.reviews})</span></td>
      <td><span class="status-badge active">Active</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="admin-action-btn edit-btn" onclick="editProduct(${p.id})">✏️ Edit</button>
          <button class="admin-action-btn delete-btn" onclick="deleteProduct(${p.id}, '${p.name}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:32px">No products found</td></tr>';
}

// ── Render Recent Orders ──────────────────────────────
async function renderRecentOrders() {
  const el = document.getElementById('recent-orders-table');
  if (!el) return;

  let orders = [];
  try {
    const data = await window.AdminAPI.orders({ per_page: 5 });
    orders = data.orders;
  } catch {
    orders = MOCK_ORDERS.slice(0, 5);
  }

  el.innerHTML = `<table><thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr></thead><tbody>
    ${orders.map(o => `
      <tr>
        <td style="font-weight:700;color:var(--primary)">#${o.order_number||o.id}</td>
        <td><strong>${o.user_name||o.customer||'—'}</strong><br><span style="font-size:.75rem;color:var(--text-muted)">📍 ${o.city||''}</span></td>
        <td style="font-weight:700">₹${o.total}</td>
        <td style="font-size:.82rem;color:var(--text-muted)">${(o.created_at||o.date||'').slice(0,10)}</td>
        <td><span class="status-badge ${o.status}">${capitalize(o.status)}</span></td>
      </tr>`).join('')}
  </tbody></table>`;
}

// ── Render All Orders ─────────────────────────────────
async function renderOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  let orders = [];
  try {
    const data = await window.AdminAPI.orders({ per_page: 50 });
    orders = data.orders;
  } catch {
    orders = MOCK_ORDERS;
  }

  const statuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td style="font-weight:700;color:var(--primary)">#${o.order_number||o.id}</td>
      <td><strong>${o.user_name||o.customer||'—'}</strong><br><span style="font-size:.75rem;color:var(--text-muted)">📍 ${o.city||''}</span></td>
      <td style="font-size:.82rem;max-width:200px">${o.items ? o.items.map(i => `${i.product_name} ×${i.qty}`).join(', ') : (o.products||'—')}</td>
      <td style="font-weight:700">₹${o.total}</td>
      <td style="font-size:.82rem;color:var(--text-muted)">${(o.created_at||o.date||'').slice(0,10)}</td>
      <td>
        <select class="form-control" style="padding:4px 8px;font-size:.78rem" onchange="updateOrderStatus(${o.id},this.value)">
          ${statuses.map(s => `<option value="${s}" ${o.status===s?'selected':''}>${capitalize(s)}</option>`).join('')}
        </select>
      </td>
      <td><button class="admin-action-btn edit-btn" onclick="window.Toast.show('Invoice','#${o.order_number||o.id}','success')">📄</button></td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted)">No orders yet</td></tr>';
}

// ── Render Customers ──────────────────────────────────
async function renderCustomers() {
  const tbody = document.getElementById('admin-customers-tbody');
  if (!tbody) return;

  let users = [];
  try {
    const data = await window.AdminAPI.users();
    users = data.users.filter(u => u.role === 'customer');
  } catch {
    users = [
      { name:'Priya Sharma',  email:'priya@gmail.com',   order_count:5, total_spent:1890, created_at:'2024-01-15' },
      { name:'Rajesh Gupta',  email:'rajesh@gmail.com',  order_count:3, total_spent:1134, created_at:'2024-02-01' },
      { name:'Sunita Mehta',  email:'sunita@gmail.com',  order_count:8, total_spent:2856, created_at:'2023-12-20' },
    ];
  }

  tbody.innerHTML = users.map(c => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">${(c.name||'?')[0]}</div>
        <strong>${c.name}</strong>
      </div></td>
      <td style="color:var(--text-muted)">${c.email}</td>
      <td><strong>${c.order_count||0}</strong> orders</td>
      <td style="font-weight:700;color:var(--primary)">₹${(c.total_spent||0).toLocaleString()}</td>
      <td style="font-size:.82rem;color:var(--text-muted)">${(c.created_at||'').slice(0,10)}</td>
    </tr>
  `).join('') || '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text-muted)">No customers yet</td></tr>';
}

// ── Actions ───────────────────────────────────────────
window.showAdminPage = (page) => {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  const pages = ['dashboard','products','orders','customers','add-product'];
  document.querySelectorAll('.admin-nav-item')[pages.indexOf(page)]?.classList.add('active');
};

window.filterAdminProducts = (query) => renderAdminProducts(query);

window.editProduct = async (id) => {
  try {
    const { product: p } = await window.ProductsAPI.getById(id);
    showAdminPage('add-product');
    document.getElementById('add-product-title').textContent = `Edit: ${p.name}`;
    document.getElementById('pf-name').value  = p.name;
    document.getElementById('pf-nameh').value = p.name_hi || '';
    document.getElementById('pf-category').value = p.category;
    document.getElementById('pf-weight').value = p.weight;
    document.getElementById('pf-price').value  = p.price;
    document.getElementById('pf-mrp').value    = p.mrp;
    document.getElementById('pf-stock').value  = p.stock;
    document.getElementById('pf-badge').value  = p.badge || '';
    document.getElementById('pf-emoji').value  = p.emoji;
    document.getElementById('pf-color').value  = p.color;
    document.getElementById('pf-desc').value   = p.description;
    document.getElementById('pf-ingredients').value = (p.ingredients||[]).join(', ');
    document.getElementById('product-form').dataset.editId = id;
  } catch {
    window.Toast.show('Could not load product', '', 'error');
  }
};

window.deleteProduct = async (id, name) => {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    await window.ProductsAPI.delete(id);
    window.Toast.show('Product deleted', name, 'success');
    renderAdminProducts();
  } catch (err) {
    window.Toast.show('Delete failed', err.message, 'error');
  }
};

window.saveProduct = async (e) => {
  e.preventDefault();
  const editId = document.getElementById('product-form').dataset.editId;
  const payload = {
    name:        document.getElementById('pf-name').value.trim(),
    name_hi:     document.getElementById('pf-nameh').value,
    category:    document.getElementById('pf-category').value,
    weight:      document.getElementById('pf-weight').value || '250g',
    price:       parseInt(document.getElementById('pf-price').value),
    mrp:         parseInt(document.getElementById('pf-mrp').value),
    stock:       parseInt(document.getElementById('pf-stock').value) || 50,
    badge:       document.getElementById('pf-badge').value || '',
    emoji:       document.getElementById('pf-emoji').value || '🍴',
    color:       document.getElementById('pf-color').value,
    description: document.getElementById('pf-desc').value,
    ingredients: document.getElementById('pf-ingredients').value.split(',').map(s=>s.trim()).filter(Boolean)
  };

  try {
    if (editId) {
      await window.ProductsAPI.update(editId, payload);
      window.Toast.show('Product updated! ✅', payload.name, 'success');
    } else {
      await window.ProductsAPI.create(payload);
      window.Toast.show('Product created! 🎉', `"${payload.name}" is now live`, 'success');
    }
    resetProductForm();
    setTimeout(() => showAdminPage('products'), 1200);
    renderAdminProducts();
  } catch (err) {
    window.Toast.show('Save failed', err.message, 'error');
  }
};

window.resetProductForm = () => {
  document.getElementById('product-form').reset();
  document.getElementById('product-form').dataset.editId = '';
  document.getElementById('add-product-title').textContent = 'Add New Product';
};

window.updateOrderStatus = async (orderId, status) => {
  try {
    await window.OrdersAPI.updateStatus(orderId, status);
    window.Toast.show('Status updated ✅', `Order #${orderId} → ${capitalize(status)}`, 'success');
  } catch (err) {
    window.Toast.show('Update failed', err.message, 'error');
  }
};

// ── Helpers ───────────────────────────────────────────
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

// Fallback mock data
const MOCK_ORDERS = [
  { id:1, order_number:'SS-A7X2K', user_name:'Priya Sharma',  city:'Delhi',     products:'Mango Pickle × 2', total:387, created_at:'2024-03-25', status:'delivered', items:[] },
  { id:2, order_number:'SS-B3F9M', user_name:'Rajesh Gupta',  city:'Mumbai',    products:'Ghee Ladoo × 1',   total:199, created_at:'2024-03-25', status:'shipped',   items:[] },
  { id:3, order_number:'SS-C5H1P', user_name:'Sunita Mehta',  city:'Pune',      products:'Mathri × 3',       total:357, created_at:'2024-03-24', status:'pending',   items:[] },
  { id:4, order_number:'SS-D8J4R', user_name:'Vikram Singh',  city:'Jaipur',    products:'Mix Pickle × 1',   total:129, created_at:'2024-03-24', status:'shipped',   items:[] },
  { id:5, order_number:'SS-E2L7S', user_name:'Anita Reddy',   city:'Hyderabad', products:'Khajur Roll × 2',  total:438, created_at:'2024-03-23', status:'delivered', items:[] },
];

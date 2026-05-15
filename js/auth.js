/* =====================================================
   MAATI KA SWAD — Auth Page JS (Backend-Connected)
   ===================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, show logged-in state
  if (window.AuthAPI.isLoggedIn()) {
    showLoggedInState();
  }
});

window.switchAuthTab = (tab) => {
  document.querySelectorAll('.auth-tab').forEach((btn, i) => {
    btn.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'signup' && i === 1));
  });
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-signup').classList.toggle('active', tab === 'signup');
};

window.handleLogin = async () => {
  const email = document.getElementById('login-email').value.trim();
  const pwd   = document.getElementById('login-password').value;
  if (!email || !pwd) { window.Toast.show('Please fill all fields', '', 'error'); return; }

  const btn = document.querySelector('#form-login .btn-primary');
  const orig = btn.textContent;
  btn.textContent = '⏳ Signing in...';
  btn.disabled = true;

  try {
    const data = await window.AuthAPI.login(email, pwd);
    window.AuthAPI.setSession(data);
    window.Toast.show(`Welcome back, ${data.user.name}! 🎉`, '', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } catch (err) {
    window.Toast.show('Login failed', err.message, 'error');
    btn.textContent = orig;
    btn.disabled = false;
  }
};

window.handleSignup = async () => {
  const fname = document.getElementById('signup-fname').value.trim();
  const lname = document.getElementById('signup-lname').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const pwd   = document.getElementById('signup-password').value;

  if (!fname || !email || !pwd) { window.Toast.show('Please fill required fields', '', 'error'); return; }
  if (pwd.length < 6) { window.Toast.show('Password too short', 'Minimum 6 characters', 'error'); return; }

  const btn = document.querySelector('#form-signup .btn-primary');
  const orig = btn.textContent;
  btn.textContent = '⏳ Creating account...';
  btn.disabled = true;

  try {
    const data = await window.AuthAPI.register(`${fname} ${lname}`.trim(), email, pwd, phone);
    window.AuthAPI.setSession(data);
    window.Toast.show(`Welcome to Maati Ka Swad, ${fname}! 🎉`, '', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } catch (err) {
    window.Toast.show('Signup failed', err.message, 'error');
    btn.textContent = orig;
    btn.disabled = false;
  }
};

window.socialLogin = (provider) => {
  window.Toast.show(`${provider} login coming soon!`, 'Please use email signup for now', 'info');
};

window.togglePwd = (inputId) => {
  const input = document.getElementById(inputId);
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
};

function showLoggedInState() {
  const user = window.AuthAPI.getUser();
  const body = document.querySelector('.login-body');
  if (!body || !user) return;
  body.innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:4rem;margin-bottom:12px">👋</div>
      <h3>Welcome back, ${user.name}!</h3>
      <p style="color:var(--text-muted);font-size:.88rem;margin:8px 0 4px">${user.email}</p>
      <p style="color:var(--text-muted);margin:4px 0 24px">You're already signed in.</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <a href="shop.html" class="btn btn-primary">🛍️ Continue Shopping</a>
        <a href="cart.html" class="btn btn-outline">🛒 View Cart</a>
        <button onclick="window.AuthAPI.clearSession();window.location.reload()" class="btn" style="color:var(--error)">Sign Out</button>
      </div>
    </div>`;
}

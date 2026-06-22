/* =====================================================
   MAATI KA SWAD — Auth Page JS
   Simple email + password login and signup.
   All OTP/mobile login code has been removed.
   ===================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (window.AuthAPI && window.AuthAPI.isLoggedIn()) {
    showLoggedInState();
    return;
  }

  // Restore remembered email
  const remembered = localStorage.getItem('mks_remember_email');
  if (remembered) {
    const emailInput = document.getElementById('login-email');
    const checkbox   = document.getElementById('login-remember');
    if (emailInput) emailInput.value = remembered;
    if (checkbox)   checkbox.checked = true;
  }
});

// ── Tab Switching ─────────────────────────────────────
window.switchAuthTab = (tab) => {
  document.querySelectorAll('.auth-tab').forEach((btn, i) => {
    btn.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'signup' && i === 1));
  });
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-signup').classList.toggle('active', tab === 'signup');
};

// ── Email validation helper ──────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Sign In ──────────────────────────────────────────
window.handleLogin = async () => {
  const email = document.getElementById('login-email').value.trim();
  const pwd   = document.getElementById('login-password').value;
  const remember = document.getElementById('login-remember')?.checked;

  if (!email) {
    window.Toast.show('Email is required', 'Please enter your email address', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    window.Toast.show('Invalid email', 'Please enter a valid email address', 'error');
    return;
  }
  if (!pwd) {
    window.Toast.show('Password is required', 'Please enter your password', 'error');
    return;
  }

  // Remember me
  if (remember) {
    localStorage.setItem('mks_remember_email', email);
  } else {
    localStorage.removeItem('mks_remember_email');
  }

  const btn  = document.getElementById('btn-login');
  const orig = btn.textContent;
  btn.textContent = '⏳ Signing in...';
  btn.disabled = true;

  try {
    const data = await window.AuthAPI.login(email, pwd);
    window.AuthAPI.setSession(data);
    window.Toast.show(`Welcome back, ${data.user.name}! 🎉`, '', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } catch (err) {
    window.Toast.show('Sign in failed', err.message, 'error');
    btn.textContent = orig;
    btn.disabled = false;
  }
};

// ── Sign Up ──────────────────────────────────────────
window.handleSignup = async () => {
  const fname = document.getElementById('signup-fname').value.trim();
  const lname = document.getElementById('signup-lname').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pwd   = document.getElementById('signup-password').value;

  if (!fname) {
    window.Toast.show('First name is required', '', 'error'); return;
  }
  if (!email) {
    window.Toast.show('Email address is required', '', 'error'); return;
  }
  if (!isValidEmail(email)) {
    window.Toast.show('Invalid email', 'Please enter a valid email address', 'error'); return;
  }
  if (!pwd) {
    window.Toast.show('Password is required', '', 'error'); return;
  }
  if (pwd.length < 6) {
    window.Toast.show('Password too short', 'Minimum 6 characters required', 'error'); return;
  }

  const btn  = document.getElementById('btn-signup');
  const orig = btn.textContent;
  btn.textContent = '⏳ Creating account...';
  btn.disabled = true;

  try {
    const fullName = `${fname} ${lname}`.trim();
    const data = await window.AuthAPI.register(fullName, email, pwd);
    window.AuthAPI.setSession(data);
    window.Toast.show(`Welcome to Maati Ka Swad, ${fname}! 🎉`, 'Your account has been created', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } catch (err) {
    window.Toast.show('Sign up failed', err.message, 'error');
    btn.textContent = orig;
    btn.disabled = false;
  }
};

// ── Forgot Password ──────────────────────────────────
window.handleForgotPassword = () => {
  const email = document.getElementById('login-email').value.trim();

  if (!email) {
    window.Toast.show('Enter your email first', 'Type your email address in the field above, then click Forgot Password', 'info');
    document.getElementById('login-email')?.focus();
    return;
  }
  if (!isValidEmail(email)) {
    window.Toast.show('Invalid email', 'Please enter a valid email address', 'error');
    return;
  }

  // Check if user exists
  const user = window.UserDB?.findByEmail(email);
  if (!user) {
    window.Toast.show('Account not found', 'No account is registered with this email address', 'error');
    return;
  }

  // Prompt for new password
  const newPwd = prompt(`Reset password for ${email}\n\nEnter your new password (min. 6 characters):`);
  if (!newPwd) return;

  if (newPwd.length < 6) {
    window.Toast.show('Password too short', 'Minimum 6 characters required', 'error');
    return;
  }

  // Update password in localStorage
  const users = window.UserDB.getAll();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx >= 0) {
    users[idx].password = newPwd;
    window.UserDB.save(users);
    window.Toast.show('Password reset successful! 🔑', 'You can now sign in with your new password', 'success');
    document.getElementById('login-password')?.focus();
  }
};

// ── Toggle Password Visibility ───────────────────────
window.togglePwd = (inputId) => {
  const input = document.getElementById(inputId);
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
};

// ── Show Logged-In State ─────────────────────────────
function showLoggedInState() {
  const user = window.AuthAPI.getUser();
  const body = document.querySelector('.login-body');
  if (!body || !user) return;
  body.innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:4rem;margin-bottom:12px">👋</div>
      <h3>Welcome back, ${user.name}!</h3>
      <p style="color:var(--text-muted);font-size:.88rem;margin:8px 0 24px">${user.email}</p>
      <div style="display:flex;flex-direction:column;gap:12px">
        <a href="shop.html" class="btn btn-primary">🛍️ Continue Shopping</a>
        <a href="cart.html" class="btn btn-outline">🛒 View Cart</a>
        <button onclick="window.AuthAPI.clearSession();window.location.reload()" class="btn" style="color:var(--error)">Sign Out</button>
      </div>
    </div>`;
}

// ── Enter key support ────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const loginForm  = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  if (loginForm && loginForm.classList.contains('active') && loginForm.contains(e.target)) {
    handleLogin();
  } else if (signupForm && signupForm.classList.contains('active') && signupForm.contains(e.target)) {
    handleSignup();
  }
});

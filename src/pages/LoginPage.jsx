import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email format
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        if (remember) localStorage.setItem('mks_remember_email', email);
        else localStorage.removeItem('mks_remember_email');
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on mount
  useState(() => {
    const saved = localStorage.getItem('mks_remember_email');
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  });

  return (
    <div className="min-h-screen bg-warmwhite flex items-center justify-center px-4 py-20">
      {/* Background pattern */}
      <div className="fixed inset-0 mithila-lotus-bg opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/images/logo.png" alt="Maati Ka Swaad" className="h-20 mx-auto rounded-xl" />
          </Link>
          <p className="text-earthbrown/60 text-sm mt-3">Sign in to continue shopping</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-earthbrown/8 border border-cream-dark p-8">
          <h2 className="font-display text-2xl font-bold text-darkbrown mb-6 text-center">
            Welcome Back
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-darkbrown mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 rounded-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-darkbrown mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earthbrown/40 hover:text-earthbrown text-lg"
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-earthbrown/60">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-cream-dark accent-terracotta"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!email.trim()) {
                    setError('Enter your email first, then click Forgot Password');
                    return;
                  }
                  setError('');
                  alert(`Password reset link would be sent to ${email}.\n\nThis feature requires a mail server. For now, please create a new account.`);
                }}
                className="text-terracotta hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-bihar !py-4 !text-sm disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-xs text-earthbrown/40 font-medium">New to Maati Ka Swaad?</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          {/* Signup Link */}
          <Link
            to="/signup"
            state={{ from }}
            className="block w-full text-center py-3.5 rounded-xl border-2 border-mustard/30 text-mustard-dark font-semibold text-sm hover:bg-mustard/5 hover:border-mustard/50 transition-all"
          >
            Create a New Account
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-earthbrown/50 hover:text-terracotta transition-colors">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

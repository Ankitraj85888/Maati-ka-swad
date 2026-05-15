import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.mobile.length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    const result = await signup({
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      password: form.password,
    });

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmwhite flex items-center justify-center px-4 py-20">
      <div className="fixed inset-0 mithila-lotus-bg opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/images/logo.png" alt="Maati Ka Swaad" className="h-20 mx-auto rounded-xl" />
          </Link>
          <p className="text-earthbrown/60 text-sm mt-3">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-earthbrown/8 border border-cream-dark p-8">
          <h2 className="font-display text-2xl font-bold text-darkbrown mb-6">
            New Customer
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-darkbrown mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-darkbrown mb-1.5">Mobile Number</label>
              <div className="flex">
                <span className="flex items-center px-3 bg-cream rounded-l-xl border border-r-0 border-cream-dark text-sm text-earthbrown/60">
                  +91
                </span>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-4 py-3 rounded-r-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-darkbrown mb-1.5">Email ID</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-darkbrown mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all pr-12"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-darkbrown mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all"
                required
              />
            </div>

            {/* Terms */}
            <p className="text-[11px] text-earthbrown/40 leading-relaxed">
              By creating an account, you agree to Maati Ka Swaad&apos;s{' '}
              <a href="#" className="text-terracotta hover:underline">Terms of Use</a> and{' '}
              <a href="#" className="text-terracotta hover:underline">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-bihar !py-4 !text-sm disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-xs text-earthbrown/40">Already have an account?</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          <Link
            to="/login"
            state={{ from }}
            className="block w-full text-center py-3 rounded-xl border-2 border-terracotta/20 text-terracotta font-semibold text-sm hover:bg-terracotta/5 transition-all"
          >
            Sign In Instead
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-earthbrown/50 hover:text-terracotta transition-colors">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

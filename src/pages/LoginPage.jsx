import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ✅ Live backend on Render
const API_BASE = 'https://maati-ka-swad-backend.onrender.com/api';

export default function LoginPage() {
  const { loginWithOTP, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [method, setMethod] = useState('mobile'); // 'mobile' | 'email'
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ── Send OTP via backend API ────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (mobile.length < 10) { setError('Enter a valid 10-digit mobile number'); return; }
    setError('');
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        // Start cooldown for resend
        setCooldown(30);
        const timer = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
        // If not registered, redirect to signup after 2 seconds
        if (data.redirect === '/signup') {
          setTimeout(() => navigate('/signup'), 2000);
        }
      }
    } catch (err) {
      setError('Network error. Make sure the backend server is running.');
    } finally {
      setSending(false);
    }
  };

  // ── Verify OTP via backend API ──────────────────────
  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter a valid 6-digit OTP'); return; }
    setError('');
    setVerifying(true);

    try {
      const res = await fetch(`${API_BASE}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Store token and user in auth context
        loginWithOTP(mobile, otp, data.token, data.user);
        navigate(from, { replace: true });
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Make sure the backend server is running.');
    } finally {
      setVerifying(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) navigate(from, { replace: true });
      else setError(result.error);
    } finally {
      setVerifying(false);
    }
  };

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
          {/* Method Tabs */}
          <div className="flex bg-cream rounded-2xl p-1 mb-8">
            <button
              onClick={() => { setMethod('mobile'); setError(''); setOtpSent(false); }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                method === 'mobile'
                  ? 'bg-gradient-to-r from-terracotta to-deepred text-white shadow-lg'
                  : 'text-earthbrown/60 hover:text-earthbrown'
              }`}
            >
              📱 Mobile OTP
            </button>
            <button
              onClick={() => { setMethod('email'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                method === 'email'
                  ? 'bg-gradient-to-r from-terracotta to-deepred text-white shadow-lg'
                  : 'text-earthbrown/60 hover:text-earthbrown'
              }`}
            >
              ✉️ Email
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* ── Mobile OTP Flow ── */}
          {method === 'mobile' && !otpSent && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-darkbrown mb-2">Mobile Number</label>
                <div className="flex">
                  <span className="flex items-center px-4 bg-cream rounded-l-xl border border-r-0 border-cream-dark text-sm text-earthbrown/60 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="flex-1 px-4 py-3.5 rounded-r-xl border border-cream-dark bg-white text-darkbrown placeholder:text-earthbrown/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full btn-bihar !py-4 !text-sm disabled:opacity-60"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : 'Send OTP →'}
              </button>
            </form>
          )}

          {method === 'mobile' && otpSent && (
            <form onSubmit={handleOTPLogin} className="space-y-5">
              <div className="text-center mb-2">
                <p className="text-sm text-earthbrown/60">OTP sent to <strong className="text-darkbrown">+91 {mobile}</strong></p>
                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); }} className="text-xs text-terracotta hover:underline mt-1">
                  Change number
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold text-darkbrown mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3.5 rounded-xl border border-cream-dark text-center text-2xl font-mono tracking-[0.5em] bg-white text-darkbrown placeholder:text-earthbrown/30 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 transition-all"
                  maxLength={6}
                  autoFocus
                  required
                />
                <p className="text-[10px] text-earthbrown/40 mt-2 text-center">
                  OTP is valid for 5 minutes
                </p>
              </div>
              <button
                type="submit"
                disabled={verifying}
                className="w-full btn-bihar !py-4 !text-sm disabled:opacity-60"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : 'Verify & Login →'}
              </button>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={cooldown > 0}
                className="w-full text-sm text-terracotta hover:underline disabled:text-earthbrown/30 disabled:no-underline disabled:cursor-not-allowed"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
              </button>
            </form>
          )}

          {/* ── Email Login Flow ── */}
          {method === 'email' && (
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
                    placeholder="Min. 6 characters"
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
              <button type="submit" className="w-full btn-bihar !py-4 !text-sm">
                Sign In →
              </button>
            </form>
          )}

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

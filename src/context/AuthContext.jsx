import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ✅ Live backend on Render
const API = 'https://maati-ka-swad-backend.onrender.com/api';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user + token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mks_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('mks_user', JSON.stringify(user));
    else localStorage.removeItem('mks_user');
  }, [user]);

  /** ✅ REAL signup — calls backend /api/auth/register */
  const signup = async ({ name, mobile, email, password }) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone: mobile }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Registration failed' };

      // Auto login after register
      if (data.token) localStorage.setItem('mks_token', data.token);
      const u = { ...data.user, method: 'email' };
      setUser(u);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Make sure the backend server is running.' };
    }
  };

  /** ✅ REAL OTP login — uses backend-verified token & user */
  const loginWithOTP = (mobile, otp, token, userData) => {
    if (!token || !userData) return { success: false, error: 'OTP verification failed' };
    const u = { ...userData, method: 'otp', mobile };
    localStorage.setItem('mks_token', token);
    setUser(u);
    return { success: true };
  };

  /** ✅ REAL email login — calls backend /api/auth/login */
  const loginWithEmail = async (email, password) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Login failed' };

      if (data.token) localStorage.setItem('mks_token', data.token);
      const u = { ...data.user, method: 'email' };
      setUser(u);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Make sure the backend server is running.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mks_token');
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, loginWithOTP, loginWithEmail, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

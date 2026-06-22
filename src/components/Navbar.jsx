import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { itemCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', href: '/#home' },
    { label: 'Products', href: '/#products' },
    { label: 'Our Story', href: '/#culture' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-earthbrown/5 py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo — always left */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <img src="/images/logo.png" alt="Maati Ka Swaad" className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-14'} w-auto object-contain rounded-lg`} />
        </Link>

        {/* Desktop Links — centered */}
        <ul className="hidden md:flex items-center justify-center gap-1 flex-1 mx-6">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                scrolled ? 'text-earthbrown hover:text-terracotta hover:bg-terracotta/5' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}>{l.label}</a>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* User */}
          <div className="relative">
            <button
              onClick={() => isLoggedIn ? setUserMenu(!userMenu) : navigate('/login')}
              className={`p-2 rounded-full transition-colors flex items-center gap-1.5 ${
                scrolled ? 'text-earthbrown hover:bg-cream' : 'text-white hover:bg-white/10'
              }`}
              title={isLoggedIn ? user.name : 'Login'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {isLoggedIn && <span className="hidden sm:inline text-xs font-medium max-w-[80px] truncate">{user.name}</span>}
            </button>

            {/* User Dropdown */}
            {userMenu && isLoggedIn && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cream-dark p-3 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-cream-dark mb-2">
                    <p className="font-semibold text-sm text-darkbrown">{user.name}</p>
                    <p className="text-xs text-earthbrown/50">{user.email || user.mobile}</p>
                  </div>
                  <Link to="/cart" onClick={() => setUserMenu(false)} className="block px-3 py-2 rounded-xl text-sm text-earthbrown hover:bg-cream hover:text-terracotta transition-colors">🛒 My Cart</Link>
                  <Link to="/delivery-address" onClick={() => setUserMenu(false)} className="block px-3 py-2 rounded-xl text-sm text-earthbrown hover:bg-cream hover:text-terracotta transition-colors">📍 Delivery Address</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">🚪 Logout</button>
                </div>
              </>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className={`relative p-2 rounded-full transition-colors ${
            scrolled ? 'text-earthbrown hover:bg-cream' : 'text-white hover:bg-white/10'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-terracotta text-white text-[10px] font-bold flex items-center justify-center animate-fade-in">{itemCount}</span>
            )}
          </Link>

          {/* Shop Now CTA */}
          <a href="/#products" className="hidden sm:inline-flex btn-bihar !px-5 !py-2 !text-xs">Shop Now</a>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-earthbrown' : 'text-white'}`} aria-label="Menu">
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-xl mx-4 mt-2 rounded-2xl shadow-xl border border-cream-dark p-4 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-earthbrown font-medium hover:bg-cream hover:text-terracotta transition-colors">{l.label}</a>
          ))}
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-earthbrown font-medium hover:bg-cream hover:text-terracotta transition-colors">🛒 Cart {itemCount > 0 && `(${itemCount})`}</Link>
          <Link to="/delivery-address" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-earthbrown font-medium hover:bg-cream hover:text-terracotta transition-colors">📍 Delivery Address</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-colors">🚪 Logout ({user.name})</button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block btn-bihar text-center !mt-3">Login / Signup</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

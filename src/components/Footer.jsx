export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* Top wave / Mithila divider */}
      <div className="bg-warmwhite">
        <svg viewBox="0 0 1440 60" className="w-full h-auto block" preserveAspectRatio="none">
          <path
            d="M0 30 Q180 0 360 30 T720 30 T1080 30 T1440 30 L1440 60 L0 60Z"
            fill="#2C1810"
          />
        </svg>
      </div>

      <div className="bg-darkbrown relative">
        {/* Mithila pattern overlay */}
        <div className="absolute inset-0 mithila-lotus-bg opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <img
                  src="/images/logo.png"
                  alt="Maati Ka Swaad"
                  className="h-16 w-auto object-contain rounded-lg"
                />
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Bringing the authentic taste of Bihar to your doorstep. Handcrafted with love, 
                tradition, and zero compromises.
              </p>
              <div className="flex items-center gap-1.5 text-mustard/60 text-sm font-display italic">
                <span>माटी का स्वाद</span>
                <span className="text-white/20">·</span>
                <span>Taste of the Soil</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-sm font-semibold text-mustard uppercase tracking-widest mb-6">
                Shop
              </h4>
              <ul className="space-y-3">
                {['All Products', 'Thekua Collection', 'Pure Masalas', 'Roasted Makhana'].map((l) => (
                  <li key={l}>
                    <a
                      href="#products"
                      className="text-white/50 text-sm hover:text-mustard transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-terracotta/40 group-hover:bg-mustard transition-colors" />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-display text-sm font-semibold text-mustard uppercase tracking-widest mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                {['Our Story', 'Why Bihar?', 'Shipping Policy', 'Return Policy', 'FAQ'].map((l) => (
                  <li key={l}>
                    <a
                      href="#culture"
                      className="text-white/50 text-sm hover:text-mustard transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-terracotta/40 group-hover:bg-mustard transition-colors" />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Newsletter */}
            <div>
              <h4 className="font-display text-sm font-semibold text-mustard uppercase tracking-widest mb-6">
                Get in Touch
              </h4>
              <div className="space-y-3 text-sm text-white/50 mb-6">
                <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-mustard transition-colors">
                  📞 +91 98765 43210
                </a>
                <a href="mailto:hello@maatikaswaad.in" className="flex items-center gap-2 hover:text-mustard transition-colors">
                  ✉️ hello@maatikaswaad.in
                </a>
                <p className="flex items-center gap-2">📍 Patna, Bihar, India</p>
              </div>

              {/* Mini newsletter */}
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-mustard/40 transition-colors"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-terracotta to-deepred text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-terracotta/20 transition-all">
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Mithila decorative line */}
          <div className="border-t border-white/5 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/30 text-xs">
                © 2024 Maati Ka Swaad. Made with ❤️ in Bihar. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-white/20 text-xs">We Accept:</span>
                {['UPI', 'Cards', 'Net Banking', 'COD'].map((m) => (
                  <span key={m} className="text-[10px] text-white/40 bg-white/5 px-2.5 py-1 rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

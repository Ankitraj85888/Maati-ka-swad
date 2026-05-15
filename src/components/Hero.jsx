export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-darkbrown/90 via-darkbrown/75 to-earthbrown/60" />
      {/* Mithila pattern overlay */}
      <div className="absolute inset-0 mithila-lotus-bg opacity-30" />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warmwhite to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
              <span className="w-2 h-2 rounded-full bg-mustard animate-pulse-soft" />
              <span className="text-cream text-sm font-medium tracking-wide">
                From the Heart of Bihar
              </span>
            </div>

            {/* Heading */}
            <h1
              className="animate-fade-up font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1]"
              style={{ animationDelay: '0.15s' }}
            >
              Authentic Taste{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mustard via-mustard-light to-mustard">
                of Bihar
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="animate-fade-up text-lg text-white/70 max-w-lg leading-relaxed"
              style={{ animationDelay: '0.3s' }}
            >
              Handcrafted <strong className="text-mustard">Thekua</strong>, pure stone-ground{' '}
              <strong className="text-mustard">Masalas</strong> & premium roasted{' '}
              <strong className="text-mustard">Makhana</strong> — made with love, tradition,
              and the finest ingredients from Bihar&apos;s villages.
            </p>

            {/* CTA */}
            <div
              className="animate-fade-up flex flex-wrap gap-4"
              style={{ animationDelay: '0.45s' }}
            >
              <a href="#products" className="btn-bihar !px-10 !py-4 !text-base group">
                Explore Products
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#culture" className="btn-bihar-outline !border-white/30 !text-white hover:!bg-white/10 !px-8 !py-4 !text-base">
                Our Story
              </a>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-up flex gap-8 pt-4"
              style={{ animationDelay: '0.6s' }}
            >
              {[
                { num: '50K+', label: 'Happy Customers' },
                { num: '9', label: 'Products' },
                { num: '100%', label: 'Natural' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-mustard">
                    {s.num}
                  </div>
                  <div className="text-white/50 text-xs tracking-wide uppercase mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Floating Cards */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-80 h-80">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-mustard/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-terracotta/10" />

              {/* Floating product cards */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 animate-float">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-2xl">
                  <span className="text-3xl">🍪</span>
                  <p className="text-white text-xs font-semibold mt-1">Thekua</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 animate-float-slow" style={{ animationDelay: '2s' }}>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-2xl">
                  <span className="text-3xl">🌶️</span>
                  <p className="text-white text-xs font-semibold mt-1">Masalas</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-0 animate-float" style={{ animationDelay: '4s' }}>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-2xl">
                  <span className="text-3xl">🫧</span>
                  <p className="text-white text-xs font-semibold mt-1">Makhana</p>
                </div>
              </div>

              {/* Center — Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center animate-pulse-soft">
                  <img
                    src="/images/logo.png"
                    alt="Maati Ka Swaad"
                    className="w-40 h-auto object-contain rounded-xl shadow-2xl shadow-black/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
        </div>
        <span className="text-white/40 text-[10px] tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  );
}

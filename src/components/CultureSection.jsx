import { useRef, useEffect, useState } from 'react';
import MithilaDivider from './MithilaDivider';

export default function CultureSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const traditions = [
    {
      icon: '🪔',
      title: 'Chhath Puja Heritage',
      desc: 'Thekua is the sacred prasad of Chhath Puja — Bihar\'s most important festival dedicated to the Sun God. Every piece carries centuries of devotion.',
    },
    {
      icon: '🏡',
      title: 'Village-Made Goodness',
      desc: 'Our products come straight from Bihar\'s villages, where recipes are guarded family secrets and every batch is made with hands, not machines.',
    },
    {
      icon: '🌾',
      title: 'Farm to Your Table',
      desc: 'We source directly from local farmers — turmeric from Patna, makhana from Darbhanga, and wheat from the Gangetic plains.',
    },
    {
      icon: '💛',
      title: 'Zero Preservatives',
      desc: '100% natural ingredients. No chemicals, no artificial colors, no shortcuts. Just the authentic taste your dadi would approve of.',
    },
  ];

  return (
    <section id="culture" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-warmwhite via-cream to-warmwhite" />
      <div className="absolute inset-0 mithila-fish-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-deepred/5 rounded-full px-5 py-2 mb-6">
            <span className="text-lg">❤️</span>
            <span className="text-sm font-medium text-deepred tracking-wide">
              From Bihar with Love
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-darkbrown mb-4">
            A Taste of <span className="text-deepred">Tradition</span>
          </h2>
          <p className="text-earthbrown/60 leading-relaxed">
            Every product tells the story of Bihar&apos;s rich culinary heritage — from the banks of
            the Ganges to the Mithila region&apos;s legendary kitchens.
          </p>
        </div>

        <MithilaDivider motif="peacock" />

        {/* Story Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Left — Story */}
          <div className={`transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-earthbrown/5 border border-cream-dark overflow-hidden">
              {/* Corner pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 mithila-lotus-bg opacity-20" />

              <span className="text-4xl mb-4 block">📜</span>
              <h3 className="font-display text-2xl font-bold text-darkbrown mb-4">
                The Bihar Kitchen Story
              </h3>
              <div className="space-y-4 text-earthbrown/70 leading-relaxed text-sm">
                <p>
                  In the villages of Bihar, every home has a kitchen that&apos;s more than just a room — 
                  it&apos;s a temple of flavors. Our journey began when we realized these incredible recipes 
                  were fading with time.
                </p>
                <p>
                  <strong className="text-darkbrown">TheKua</strong> was born from a simple mission: 
                  to bring the authentic, handmade taste of Bihar&apos;s villages to homes across India. 
                  From the golden Thekua of Chhath Puja to the aromatic spices ground on stone 
                  <em>(sil-batta)</em>, we preserve what matters.
                </p>
                <p>
                  Our <strong className="text-darkbrown">Makhana</strong> comes from the sacred lakes of 
                  Mithila region, hand-harvested by farmers whose families have been doing this for 
                  generations. Every puff carries the essence of Bihar&apos;s wetlands.
                </p>
              </div>

              {/* Quote */}
              <div className="mt-8 pl-4 border-l-4 border-mustard/40">
                <p className="font-display text-lg italic text-darkbrown/80">
                  &ldquo;जहाँ स्वाद है, वहाँ बिहार है&rdquo;
                </p>
                <p className="text-xs text-earthbrown/50 mt-1">
                  Where there is taste, there is Bihar
                </p>
              </div>
            </div>
          </div>

          {/* Right — Feature Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-1000 delay-400 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {traditions.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-earthbrown/3 border border-cream-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <h4 className="font-display text-sm font-bold text-darkbrown mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-earthbrown/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { icon: '🌿', label: '100% Natural', sub: 'No preservatives' },
            { icon: '🏡', label: 'Handcrafted', sub: 'Village-made with love' },
            { icon: '🚚', label: 'Pan-India Delivery', sub: 'Free above ₹499' },
            { icon: '⭐', label: '4.8 Rated', sub: '50K+ happy customers' },
          ].map((b, i) => (
            <div key={i} className="text-center p-4 rounded-2xl bg-white/60 border border-cream-dark">
              <span className="text-2xl block mb-2">{b.icon}</span>
              <div className="font-semibold text-sm text-darkbrown">{b.label}</div>
              <div className="text-[10px] text-earthbrown/50 mt-0.5">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import MithilaDivider from './MithilaDivider';
import { products, categories } from '../data/products';

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState('all');
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <section id="products" ref={sectionRef} className="relative py-24 bg-warmwhite">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 mithila-peacock-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-terracotta/5 rounded-full px-5 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            <span className="text-sm font-medium text-terracotta tracking-wide">
              Our Collection
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-darkbrown mb-4">
            Flavors of <span className="text-terracotta">Bihar</span>
          </h2>
          <p className="text-earthbrown/60 leading-relaxed">
            Each product is a story of tradition, crafted with recipes passed down through
            generations in Bihar&apos;s heartland.
          </p>
        </div>

        {/* Category Tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-terracotta to-deepred text-white shadow-lg shadow-terracotta/20'
                : 'bg-white text-earthbrown hover:bg-cream border border-cream-dark'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === cat.id
                  ? 'bg-gradient-to-r from-terracotta to-deepred text-white shadow-lg shadow-terracotta/20'
                  : 'bg-white text-earthbrown hover:bg-cream border border-cream-dark'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
              <span className="text-xs opacity-60">({cat.hindi})</span>
            </button>
          ))}
        </div>

        <MithilaDivider motif="fish" />

        {/* Product Grid — centered if fewer than 3 */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className={`w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-sm transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="mithila-card group">
      {/* Image Section */}
      <div className="relative overflow-hidden aspect-square bg-cream">
        {/* Mithila corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 z-10">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full opacity-20">
            <path d="M0 0 L48 0 L0 48Z" fill="#C1440E" />
            <circle cx="12" cy="12" r="3" fill="#E1AD01" />
          </svg>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-terracotta to-deepred text-white shadow-lg">
            {product.badge}
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-mustard text-darkbrown">
            {discount}% OFF
          </div>
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
          </div>
        )}

        {/* Hover overlay with quick-add */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkbrown/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ${
              isAdding
                ? 'bg-green-500 text-white scale-105'
                : 'bg-white text-darkbrown hover:bg-mustard hover:text-darkbrown shadow-xl'
            }`}
          >
            {isAdding ? '✓ Added!' : '+ Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        {/* Category tag */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-terracotta/60 mb-1.5">
          {product.category}
        </div>

        {/* Name */}
        <h3 className="font-display text-lg font-semibold text-darkbrown group-hover:text-terracotta transition-colors leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-mustard' : 'text-cream-darker'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-earthbrown/50">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-earthbrown/60 mt-2 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Price & Weight */}
        <div className="flex items-end justify-between mt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-darkbrown">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-earthbrown/40 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <div className="text-[10px] text-earthbrown/40 mt-0.5">{product.weight}</div>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isAdding
                ? 'bg-green-500 text-white scale-110 rotate-12'
                : 'bg-cream hover:bg-terracotta hover:text-white text-earthbrown'
            }`}
          >
            {isAdding ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

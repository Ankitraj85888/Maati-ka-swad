import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const ADDR_KEY = 'mks_saved_address';

export default function CartPage() {
  const { items, itemCount, subtotal, deliveryCharge, grandTotal, updateQty, removeItem, FREE_DELIVERY_ABOVE } = useCart();
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    try {
      setHasAddress(!!localStorage.getItem(ADDR_KEY));
    } catch {}
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-warmwhite flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-display text-3xl font-bold text-darkbrown mb-3">Your Cart is Empty</h2>
          <p className="text-earthbrown/60 mb-8">Looks like you haven&apos;t added any Bihar delicacies yet!</p>
          <Link to="/" className="btn-bihar !px-10 !py-4">Explore Products →</Link>
        </div>
      </div>
    );
  }

  const freeRemaining = Math.max(0, FREE_DELIVERY_ABOVE - subtotal);

  return (
    <div className="min-h-screen bg-warmwhite pt-24 pb-16">
      <div className="fixed inset-0 mithila-peacock-bg opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-darkbrown">
            Shopping Cart <span className="text-earthbrown/40 text-xl">({itemCount})</span>
          </h1>
          <Link to="/" className="text-sm text-terracotta hover:underline">← Continue Shopping</Link>
        </div>

        {freeRemaining > 0 && (
          <div className="bg-mustard/10 border border-mustard/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div className="flex-1">
              <p className="text-sm text-darkbrown">Add <strong>₹{freeRemaining}</strong> more for <strong className="text-green-700">FREE delivery!</strong></p>
              <div className="mt-1.5 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-mustard to-terracotta rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_ABOVE) * 100)}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-cream-dark shadow-sm p-4 sm:p-5 flex gap-4 sm:gap-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-cream">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-terracotta/60 font-bold">{item.category}</p>
                      <h3 className="font-display text-lg font-semibold text-darkbrown">{item.name}</h3>
                      <p className="text-xs text-earthbrown/40 mt-0.5">{item.weight}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg text-earthbrown/30 hover:text-red-500 hover:bg-red-50 transition-all" title="Remove">✕</button>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center bg-cream rounded-xl border border-cream-dark">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-terracotta/10 rounded-l-xl font-bold">−</button>
                      <span className="w-10 text-center font-semibold text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-terracotta/10 rounded-r-xl font-bold">+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-bold text-darkbrown">₹{item.price * item.qty}</div>
                      {item.qty > 1 && <div className="text-[10px] text-earthbrown/40">₹{item.price} × {item.qty}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold text-darkbrown mb-5 pb-4 border-b border-cream-dark">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-earthbrown/70">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-darkbrown">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-earthbrown/70">
                  <span>Delivery</span>
                  <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : 'text-darkbrown'}`}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="border-t border-cream-dark pt-3 flex justify-between">
                  <span className="font-display font-bold text-darkbrown">Grand Total</span>
                  <span className="font-display text-xl font-bold text-terracotta">₹{grandTotal}</span>
                </div>
              </div>
              {deliveryCharge === 0 && <div className="mt-3 p-2 rounded-lg bg-green-50 text-green-700 text-xs text-center font-medium">🎉 You saved ₹49 on delivery!</div>}
              <Link to={hasAddress ? "/checkout" : "/delivery-address"} className="block w-full btn-bihar !py-4 !text-sm text-center mt-6">
                {hasAddress ? 'Proceed to Checkout →' : 'Add Delivery Address →'}
              </Link>
              <Link to="/delivery-address" className="block w-full text-center text-xs text-earthbrown/50 hover:text-terracotta mt-2 transition-colors">
                {hasAddress ? '✏️ Edit Address' : '📝 Manage Address'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

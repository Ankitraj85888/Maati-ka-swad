import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ADDR_KEY = 'mks_saved_address';

export default function CheckoutPage() {
  const { items, subtotal, deliveryCharge, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=confirm
  const [addr, setAddr] = useState({ name: user?.name || '', mobile: user?.mobile || '', pincode: '', address: '', city: '', state: '' });
  const [savedAddr, setSavedAddr] = useState(null);
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADDR_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedAddr(parsed);
        setAddr({
          name: parsed.fullName || user?.name || '',
          mobile: parsed.mobile || user?.mobile || '',
          pincode: parsed.pincode || '',
          address: parsed.fullAddress || '',
          city: parsed.city || '',
          state: parsed.state || '',
        });
      }
    } catch {}
  }, []);

  const setA = (k, v) => setAddr(p => ({ ...p, [k]: v }));

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  const handleAddress = (e) => {
    e.preventDefault();
    localStorage.setItem(ADDR_KEY, JSON.stringify({
      fullName: addr.name,
      mobile: addr.mobile,
      pincode: addr.pincode,
      fullAddress: addr.address,
      city: addr.city,
      state: addr.state,
      area: '',
      landmark: '',
      addressType: 'home',
      savedAt: Date.now(),
    }));
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      clearCart();
      setStep(3);
      setPlacing(false);
    }, 1500);
  };

  // ── Step 3: Order Confirmed ──
  if (step === 3) {
    return (
      <div className="min-h-screen bg-warmwhite flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-md animate-fade-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-darkbrown mb-3">Order Placed!</h2>
          <p className="text-earthbrown/60 mb-2">Thank you for ordering from Maati Ka Swaad</p>
          <p className="text-sm text-earthbrown/40 mb-8">Order ID: #MKS{Date.now().toString().slice(-8)}</p>
          <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-8 text-left">
            <h4 className="font-semibold text-darkbrown text-sm mb-2">Delivering to:</h4>
            <p className="text-sm text-earthbrown/70">{addr.name}</p>
            <p className="text-xs text-earthbrown/50">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
            <p className="text-xs text-earthbrown/50 mt-1">📞 {addr.mobile}</p>
            <p className="text-xs text-green-600 mt-3 font-medium">💰 Payment: {payment === 'cod' ? 'Cash on Delivery' : payment === 'upi' ? 'UPI' : 'Card'}</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-bihar !px-10 !py-4">Continue Shopping →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite pt-24 pb-16">
      <div className="fixed inset-0 mithila-lotus-bg opacity-15 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[{ n: 1, l: 'Address' }, { n: 2, l: 'Payment' }].map(s => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.n ? 'bg-terracotta text-white' : 'bg-cream-dark text-earthbrown/40'}`}>{s.n}</div>
              <span className={`text-sm font-medium ${step >= s.n ? 'text-darkbrown' : 'text-earthbrown/40'}`}>{s.l}</span>
              {s.n < 2 && <div className={`w-16 h-0.5 mx-2 ${step > s.n ? 'bg-terracotta' : 'bg-cream-dark'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* ── Step 1: Address ── */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-darkbrown">Delivery Address</h2>
                  {savedAddr && (
                    <Link to="/delivery-address" className="text-xs text-terracotta hover:underline">Manage Addresses</Link>
                  )}
                </div>

                {savedAddr && !addr.name && (
                  <div className="mb-4 p-4 bg-cream rounded-xl border border-cream-dark flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-darkbrown">Saved address found</p>
                      <p className="text-xs text-earthbrown/50">{savedAddr.fullName}, {savedAddr.city}, {savedAddr.state}</p>
                    </div>
                    <button
                      onClick={() => setAddr({
                        name: savedAddr.fullName,
                        mobile: savedAddr.mobile,
                        pincode: savedAddr.pincode,
                        address: savedAddr.fullAddress,
                        city: savedAddr.city,
                        state: savedAddr.state,
                      })}
                      className="text-xs btn-bihar !px-4 !py-2"
                    >
                      Use Saved
                    </button>
                  </div>
                )}

                <form onSubmit={handleAddress} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-darkbrown mb-1.5">Full Name</label>
                      <input type="text" value={addr.name} onChange={e => setA('name', e.target.value)} placeholder="Recipient name" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-darkbrown mb-1.5">Mobile Number</label>
                      <input type="tel" value={addr.mobile} onChange={e => setA('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40" maxLength={10} required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-darkbrown mb-1.5">Pin Code</label>
                      <input type="text" value={addr.pincode} onChange={e => setA('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40" maxLength={6} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-darkbrown mb-1.5">City</label>
                      <input type="text" value={addr.city} onChange={e => setA('city', e.target.value)} placeholder="City" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-darkbrown mb-1.5">State</label>
                      <input type="text" value={addr.state} onChange={e => setA('state', e.target.value)} placeholder="State" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkbrown mb-1.5">Full Address</label>
                    <textarea value={addr.address} onChange={e => setA('address', e.target.value)} placeholder="House no., Street, Locality, Landmark" rows={3} className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta/40 resize-none" required />
                  </div>
                  <button type="submit" className="w-full btn-bihar !py-4 !text-sm mt-2">Continue to Payment →</button>
                </form>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-darkbrown mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                    { id: 'upi', label: 'UPI Payment', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                    { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                  ].map(m => (
                    <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === m.id ? 'border-terracotta bg-terracotta/5' : 'border-cream-dark hover:border-earthbrown/20'}`}>
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payment === m.id ? 'border-terracotta' : 'border-earthbrown/30'}`}>
                        {payment === m.id && <div className="w-2.5 h-2.5 rounded-full bg-terracotta" />}
                      </div>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <div className="font-semibold text-darkbrown text-sm">{m.label}</div>
                        <div className="text-xs text-earthbrown/50">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {payment === 'upi' && (
                  <div className="mt-4 p-4 bg-cream rounded-xl">
                    <label className="block text-sm font-semibold text-darkbrown mb-1.5">UPI ID</label>
                    <input type="text" placeholder="yourname@upi" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20" />
                    <p className="text-[10px] text-earthbrown/40 mt-1">💡 Demo mode — no real payment</p>
                  </div>
                )}

                {payment === 'card' && (
                  <div className="mt-4 p-4 bg-cream rounded-xl space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-darkbrown mb-1.5">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-darkbrown mb-1.5">Expiry</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-darkbrown mb-1.5">CVV</label>
                        <input type="password" placeholder="•••" maxLength={3} className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20" />
                      </div>
                    </div>
                    <p className="text-[10px] text-earthbrown/40">💡 Demo mode — no real payment</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border-2 border-cream-dark text-earthbrown font-semibold text-sm hover:bg-cream transition-all">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="flex-1 btn-bihar !py-3.5 !text-sm disabled:opacity-60">
                    {placing ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing...</span> : 'Place Order →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold text-darkbrown mb-4 pb-3 border-b border-cream-dark">Order ({items.length} items)</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {items.map(i => (
                  <div key={i.id} className="flex items-center gap-3">
                    <img src={i.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-darkbrown truncate">{i.name}</p>
                      <p className="text-[10px] text-earthbrown/40">₹{i.price} × {i.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-darkbrown">₹{i.price * i.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream-dark pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-earthbrown/60"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-earthbrown/60"><span>Delivery</span><span className={deliveryCharge === 0 ? 'text-green-600' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
                <div className="flex justify-between font-bold text-darkbrown pt-2 border-t border-cream-dark"><span>Total</span><span className="text-terracotta">₹{grandTotal}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

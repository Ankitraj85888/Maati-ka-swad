import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const DELIVERY_CHARGE = 49;
const FREE_DELIVERY_ABOVE = 499;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mks_cart');
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('mks_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(product);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return removeItem(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryCharge = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <CartContext.Provider value={{
      items, toast, itemCount, subtotal, deliveryCharge, grandTotal,
      addItem, removeItem, updateQty, clearCart,
      FREE_DELIVERY_ABOVE,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

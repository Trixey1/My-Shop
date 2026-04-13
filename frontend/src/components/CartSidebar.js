import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Minus, Plus, Trash, ShoppingCart } from '@phosphor-icons/react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Please fill in your name and email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API}/orders/checkout`, {
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
      });
      clearCart();
      setIsOpen(false);
      setCustomerName('');
      setCustomerEmail('');
      navigate(`/order/${data.order.order_number}`);
    } catch (e) {
      setError(e.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-[#0A0A0A] border-l border-[#262626] w-full sm:max-w-md flex flex-col" data-testid="cart-sidebar">
        <SheetHeader>
          <SheetTitle className="font-['Unbounded'] text-[#F5F5F5] flex items-center gap-2">
            <ShoppingCart size={22} weight="bold" className="text-[#FFE800]" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#737373] gap-3">
            <ShoppingCart size={48} weight="thin" />
            <p className="text-sm">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mt-4">
              {items.map(item => (
                <div key={item.product_id} className="flex gap-3 p-3 rounded-sm bg-[#111111] border border-[#262626]" data-testid={`cart-item-${item.product_id}`}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-sm object-cover bg-[#1A1A1A]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5F5F5] truncate">{item.name}</p>
                    <p className="text-sm font-bold text-[#FFE800]">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-white/10 rounded" data-testid={`cart-decrease-${item.product_id}`}>
                        <Minus size={14} className="text-[#A3A3A3]" />
                      </button>
                      <span className="text-xs font-bold text-[#F5F5F5] w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-white/10 rounded" data-testid={`cart-increase-${item.product_id}`}>
                        <Plus size={14} className="text-[#A3A3A3]" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product_id)} className="p-1 hover:bg-white/10 rounded self-start" data-testid={`cart-remove-${item.product_id}`}>
                    <Trash size={16} className="text-[#FF3B30]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-[#262626] pt-4 mt-4 space-y-3">
              <Input
                placeholder="Your name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="bg-[#050505] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800]"
                data-testid="checkout-name-input"
              />
              <Input
                placeholder="Your email"
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                className="bg-[#050505] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800]"
                data-testid="checkout-email-input"
              />
              {error && <p className="text-xs text-[#FF3B30]" data-testid="checkout-error">{error}</p>}
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#A3A3A3]">Total</span>
                <span className="text-xl font-['Unbounded'] font-bold text-[#FFE800]">${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full rift-btn-primary rounded-sm h-11 font-bold text-sm"
                data-testid="checkout-button"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
              <p className="text-[10px] text-[#737373] text-center">Items delivered via Discord after payment confirmation</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

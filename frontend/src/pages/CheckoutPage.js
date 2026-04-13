import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Trash, CheckCircle, Warning, SpinnerGap } from '@phosphor-icons/react';
import { FaDiscord } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');
  const [robloxUser, setRobloxUser] = useState(null);
  const [robloxValidating, setRobloxValidating] = useState(false);
  const [robloxError, setRobloxError] = useState('');
  const [emailValid, setEmailValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validate Roblox username
  const validateRoblox = useCallback(async (username) => {
    if (!username || username.length < 3) {
      setRobloxUser(null);
      setRobloxError('');
      return;
    }
    setRobloxValidating(true);
    setRobloxError('');
    try {
      const { data } = await axios.post(`${API}/roblox/validate`, { username });
      if (data.valid) {
        setRobloxUser(data);
        setRobloxError('');
      } else {
        setRobloxUser(null);
        setRobloxError(data.error || 'User not found');
      }
    } catch {
      setRobloxUser(null);
      setRobloxError('Could not verify. Try again.');
    } finally {
      setRobloxValidating(false);
    }
  }, []);

  // Debounced Roblox validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (robloxUsername.length >= 3) validateRoblox(robloxUsername);
    }, 600);
    return () => clearTimeout(timer);
  }, [robloxUsername, validateRoblox]);

  // Email validation
  useEffect(() => {
    if (!customerEmail) { setEmailValid(null); return; }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(regex.test(customerEmail));
  }, [customerEmail]);

  const canCheckout = items.length > 0 && customerName.trim() && customerEmail.trim() && emailValid && robloxUser;

  const handleCheckout = async () => {
    if (!canCheckout) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API}/orders/checkout`, {
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        roblox_username: robloxUser.name,
      });
      clearCart();
      navigate(`/order/${data.order.order_number}`);
    } catch (e) {
      setError(e.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 px-6" data-testid="checkout-empty">
        <ShoppingCart size={48} weight="thin" className="text-[#737373]" />
        <p className="text-[#737373] text-lg">Your cart is empty</p>
        <Button onClick={() => navigate('/')} className="rift-btn-primary rounded-sm" data-testid="continue-shopping-btn">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12" data-testid="checkout-page">
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        <h1 className="font-['Unbounded'] text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Cart Items - Left */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rift-card rounded-sm p-5">
              <h2 className="font-['Unbounded'] text-sm font-bold text-[#F5F5F5] mb-4 flex items-center gap-2">
                <ShoppingCart size={18} className="text-[#FFE800]" /> Cart Items
                <span className="ml-auto rift-badge rounded-sm text-[10px]">{items.length} items</span>
              </h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.product_id} className="flex gap-3 p-3 rounded-sm bg-[#0A0A0A] border border-[#1A1A1A]" data-testid={`checkout-item-${item.product_id}`}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-sm object-cover bg-[#1A1A1A]" />
                    ) : (
                      <div className="w-16 h-16 rounded-sm bg-[#1A1A1A] flex items-center justify-center text-[#737373] text-[10px]">No Img</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F5F5F5] truncate">{item.name}</p>
                      <p className="text-sm font-bold text-[#FFE800]">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-white/10 rounded"><Minus size={12} className="text-[#A3A3A3]" /></button>
                        <span className="text-xs font-bold text-[#F5F5F5] w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-white/10 rounded"><Plus size={12} className="text-[#A3A3A3]" /></button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.product_id)} className="p-1 hover:bg-white/10 rounded"><Trash size={14} className="text-[#FF3B30]" /></button>
                      <span className="text-sm font-bold text-[#F5F5F5]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary - Right */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rift-card rounded-sm p-5 sticky top-20">
              <h2 className="font-['Unbounded'] text-sm font-bold text-[#F5F5F5] mb-4">Order Summary</h2>

              {/* Roblox Username */}
              <div className="mb-4">
                <label className="text-xs uppercase tracking-[0.15em] font-bold text-[#737373] mb-1.5 block">Roblox Username</label>
                <Input
                  placeholder="e.g. AlibiDawg"
                  value={robloxUsername}
                  onChange={e => setRobloxUsername(e.target.value)}
                  className="bg-[#050505] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800] rounded-sm"
                  data-testid="roblox-username-input"
                />
                {robloxValidating && (
                  <div className="flex items-center gap-2 mt-2 text-[#A3A3A3] text-xs"><SpinnerGap size={14} className="animate-spin" /> Verifying...</div>
                )}
                {robloxUser && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mt-2 p-2 rounded-sm bg-[#39FF14]/10 border border-[#39FF14]/30">
                    {robloxUser.avatar_url && <img src={robloxUser.avatar_url} alt="" className="w-8 h-8 rounded-sm" />}
                    <div>
                      <p className="text-xs text-[#39FF14] font-bold">Verified User</p>
                      <p className="text-sm text-[#F5F5F5] font-medium">{robloxUser.display_name}</p>
                    </div>
                    <CheckCircle size={18} weight="fill" className="text-[#39FF14] ml-auto" />
                  </motion.div>
                )}
                {robloxError && <p className="text-xs text-[#FF3B30] mt-1.5" data-testid="roblox-error">{robloxError}</p>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-xs uppercase tracking-[0.15em] font-bold text-[#737373] mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className={`bg-[#050505] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800] rounded-sm ${emailValid === false ? 'border-[#FF3B30]' : emailValid === true ? 'border-[#39FF14]' : ''}`}
                  data-testid="checkout-email-input"
                />
                {emailValid === false && <p className="text-xs text-[#FF3B30] mt-1">Please enter a valid email</p>}
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="text-xs uppercase tracking-[0.15em] font-bold text-[#737373] mb-1.5 block">Display Name</label>
                <Input
                  placeholder="Your name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="bg-[#050505] border-[#262626] text-[#F5F5F5] focus:ring-[#FFE800] focus:border-[#FFE800] rounded-sm"
                  data-testid="checkout-name-input"
                />
              </div>

              {/* Discord Link */}
              <a
                href="https://discord.gg/gvDs4AxP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-sm bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors text-xs font-bold mb-4"
                data-testid="link-discord-btn"
              >
                <FaDiscord size={16} /> Link Discord (Join Server)
              </a>

              {/* Totals */}
              <div className="border-t border-[#262626] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3A3A3]">Subtotal</span>
                  <span className="text-[#F5F5F5]">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3A3A3]">Processing Fee</span>
                  <span className="text-[#F5F5F5]">$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#262626]">
                  <span className="text-sm font-bold text-[#F5F5F5]">Total</span>
                  <span className="font-['Unbounded'] text-xl font-bold text-[#FFE800]">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {error && <p className="text-xs text-[#FF3B30] mt-3" data-testid="checkout-error">{error}</p>}

              {!canCheckout && items.length > 0 && (
                <div className="flex items-center gap-2 mt-3 text-xs text-[#A3A3A3]">
                  <Warning size={14} className="text-[#FFE800]" />
                  {!robloxUser ? 'Verify your Roblox username' : !emailValid ? 'Enter a valid email' : 'Fill all fields'}
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={!canCheckout || loading}
                className="w-full rift-btn-primary rounded-sm h-12 font-bold text-sm mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="place-order-btn"
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </Button>

              <p className="text-[10px] text-[#737373] text-center mt-2">Items delivered via Discord after order confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, ArrowLeft } from '@phosphor-icons/react';
import { FaDiscord } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios.get(`${API}/orders/${orderNumber}`)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFE800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[#737373] text-lg">Order not found</p>
        <Link to="/" className="text-[#FFE800] text-sm hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-16" data-testid="order-confirmation-page">
      <div className="max-w-lg w-full">
        {/* Success */}
        <div className="text-center mb-8">
          <CheckCircle size={64} weight="fill" className="text-[#39FF14] mx-auto mb-4" />
          <h1 className="font-['Unbounded'] text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mb-2" data-testid="order-success-title">
            Order Placed!
          </h1>
          <p className="text-sm text-[#A3A3A3]">Your order has been created successfully</p>
        </div>

        {/* Order ID Card */}
        <div className="rift-card rounded-sm p-6 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#737373] mb-2">Your Order ID</p>
          <div className="flex items-center gap-3">
            <span className="font-['Unbounded'] text-xl font-black text-[#FFE800] flex-1" data-testid="order-number">{order.order_number}</span>
            <button
              onClick={copyOrderNumber}
              className="p-2 rounded-sm hover:bg-white/10 transition-colors"
              data-testid="copy-order-number"
            >
              <Copy size={20} className={copied ? 'text-[#39FF14]' : 'text-[#A3A3A3]'} />
            </button>
          </div>
          {copied && <p className="text-xs text-[#39FF14] mt-1">Copied!</p>}
        </div>

        {/* Discord Instructions */}
        <div className="rift-card rounded-sm p-6 mb-6 border-[#5865F2]/30">
          <h3 className="font-['Unbounded'] text-sm font-bold text-[#F5F5F5] mb-3">Next Steps - Get Your Items</h3>
          <ol className="space-y-3 text-sm text-[#A3A3A3]">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">1</span>
              <span>Join our Discord server using the button below</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">2</span>
              <span>Open a support ticket in the server</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">3</span>
              <span>Paste your Order ID: <strong className="text-[#FFE800]">{order.order_number}</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">4</span>
              <span>Our team will verify and deliver your items!</span>
            </li>
          </ol>

          <a
            href="https://discord.gg/gvDs4AxP"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors font-bold text-sm"
            data-testid="discord-join-btn"
          >
            <FaDiscord size={20} />
            Join Discord Server
          </a>
        </div>

        {/* Order Summary */}
        <div className="rift-card rounded-sm p-6 mb-6">
          <h3 className="font-['Unbounded'] text-sm font-bold text-[#F5F5F5] mb-4">Order Summary</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#F5F5F5]">{item.product_name}</span>
                  <span className="text-[#737373]">x{item.quantity}</span>
                </div>
                <span className="text-[#A3A3A3]">${item.line_total.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-[#262626] pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-[#F5F5F5]">Total</span>
              <span className="font-['Unbounded'] text-lg font-bold text-[#FFE800]">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#A3A3A3] hover:text-[#FFE800] transition-colors" data-testid="back-to-shopping">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

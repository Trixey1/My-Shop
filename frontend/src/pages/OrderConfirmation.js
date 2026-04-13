import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, ArrowLeft } from '@phosphor-icons/react';
import { FaDiscord } from 'react-icons/fa';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Simple confetti using CSS
function Confetti() {
  const colors = ['#FFE800', '#39FF14', '#FF3B30', '#5865F2', '#F5F5F5', '#FFE800'];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    color: colors[i % colors.length],
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 3}s`,
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <div key={i} className="absolute" style={{
          left: p.left, top: '-10px', width: p.size, height: p.size * 2,
          background: p.color, transform: `rotate(${p.rotation}deg)`,
          animation: `confettiFall ${p.duration} ease-in ${p.delay} forwards`,
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    axios.get(`${API}/orders/${orderNumber}`)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [orderNumber]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FFE800] border-t-transparent rounded-full animate-spin" /></div>;
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
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full">
        {/* Success */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center mb-8">
          <CheckCircle size={72} weight="fill" className="text-[#39FF14] mx-auto mb-4" />
          <h1 className="font-['Unbounded'] text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mb-2" data-testid="order-success-title">
            Order Placed!
          </h1>
          <p className="text-sm text-[#A3A3A3]">Thank you for your purchase! A notification has been sent to our team.</p>
        </motion.div>

        {/* Order ID Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rift-card rounded-sm p-6 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#737373] mb-2">Your Order ID</p>
          <div className="flex items-center gap-3">
            <span className="font-['Unbounded'] text-xl font-black text-[#FFE800] flex-1" data-testid="order-number">{order.order_number}</span>
            <button onClick={copyOrderNumber} className="p-2 rounded-sm hover:bg-white/10 transition-colors" data-testid="copy-order-number">
              <Copy size={20} className={copied ? 'text-[#39FF14]' : 'text-[#A3A3A3]'} />
            </button>
          </div>
          {copied && <p className="text-xs text-[#39FF14] mt-1">Copied!</p>}
          {order.roblox_username && (
            <p className="text-xs text-[#A3A3A3] mt-2">Roblox: <span className="text-[#F5F5F5] font-medium">{order.roblox_username}</span></p>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rift-card rounded-sm p-6 mb-6 border-[#39FF14]/20">
          <h3 className="font-['Unbounded'] text-sm font-bold text-[#F5F5F5] mb-4">Next Steps</h3>
          <ol className="space-y-3 text-sm text-[#A3A3A3]">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">1</span>
              <span>Go to our <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline font-medium">Discord Server</a></span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">2</span>
              <span>Find your ticket in the support channel</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">3</span>
              <span>Wait for a staff member to deliver your order</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#FFE800]/10 text-[#FFE800] flex items-center justify-center text-xs font-bold">4</span>
              <span>Once completed, please leave a review!</span>
            </li>
          </ol>
          <p className="text-xs text-[#FFE800] mt-4">Please be patient as staff may be busy.</p>

          <a
            href="https://discord.gg/gvDs4AxP"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors font-bold text-sm"
            data-testid="discord-join-btn"
          >
            <FaDiscord size={20} />
            Join Discord Server
          </a>
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rift-card rounded-sm p-6 mb-6">
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
        </motion.div>

        <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#A3A3A3] hover:text-[#FFE800] transition-colors" data-testid="back-to-shopping">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    </div>
  );
}

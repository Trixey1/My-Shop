import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { Lightning, ShieldCheck, CurrencyDollar, Headset, CaretDown } from '@phosphor-icons/react';
import { FaDiscord } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

// Animated hero background with floating blocks and particles
function AnimatedHeroBg() {
  const blocks = useMemo(() => [
    { w: 60, h: 60, left: '8%', top: '20%', color: '#FFE800', anim: 'floatUp1', dur: '7s', delay: '0s' },
    { w: 40, h: 40, left: '15%', top: '60%', color: '#39FF14', anim: 'floatUp2', dur: '9s', delay: '1s' },
    { w: 50, h: 50, left: '80%', top: '30%', color: '#FFE800', anim: 'floatUp3', dur: '8s', delay: '0.5s' },
    { w: 35, h: 35, left: '70%', top: '70%', color: '#FF3B30', anim: 'floatDiag', dur: '10s', delay: '2s' },
    { w: 45, h: 45, left: '90%', top: '50%', color: '#FFE800', anim: 'floatUp1', dur: '6s', delay: '3s' },
    { w: 30, h: 30, left: '5%', top: '80%', color: '#5865F2', anim: 'floatUp2', dur: '11s', delay: '1.5s' },
    { w: 55, h: 55, left: '50%', top: '75%', color: '#FFE800', anim: 'floatUp3', dur: '7.5s', delay: '0.8s' },
    { w: 25, h: 25, left: '35%', top: '15%', color: '#39FF14', anim: 'floatDiag', dur: '9.5s', delay: '2.5s' },
    { w: 38, h: 38, left: '60%', top: '85%', color: '#FFE800', anim: 'floatUp1', dur: '8.5s', delay: '1.2s' },
    { w: 28, h: 28, left: '25%', top: '45%', color: '#FF3B30', anim: 'floatUp2', dur: '10.5s', delay: '3.5s' },
    { w: 48, h: 48, left: '45%', top: '10%', color: '#5865F2', anim: 'floatUp3', dur: '6.5s', delay: '0.3s' },
    { w: 32, h: 32, left: '95%', top: '15%', color: '#FFE800', anim: 'floatDiag', dur: '12s', delay: '4s' },
  ], []);

  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      dur: `${4 + Math.random() * 8}s`,
      delay: `${Math.random() * 6}s`,
      bottom: `${-5 - Math.random() * 10}%`,
    }))
  , []);

  return (
    <div className="absolute inset-0 hero-animated-bg">
      {/* Grid + scanline */}
      <div className="hero-grid">
        <div className="hero-scanline" />
      </div>

      {/* Glow orbs */}
      <div className="glow-orb" style={{ width: 300, height: 300, background: 'rgba(255,232,0,0.08)', left: '20%', top: '30%', animationDuration: '6s' }} />
      <div className="glow-orb" style={{ width: 200, height: 200, background: 'rgba(57,255,20,0.06)', right: '15%', top: '20%', animationDuration: '8s', animationDelay: '2s' }} />
      <div className="glow-orb" style={{ width: 250, height: 250, background: 'rgba(88,101,242,0.05)', left: '50%', bottom: '10%', animationDuration: '7s', animationDelay: '1s' }} />

      {/* Floating blocks (Roblox-style cubes) */}
      {blocks.map((b, i) => (
        <div
          key={i}
          className="floating-block"
          style={{
            width: b.w, height: b.h,
            left: b.left, top: b.top,
            background: b.color,
            animationName: b.anim,
            animationDuration: b.dur,
            animationDelay: b.delay,
            boxShadow: `0 0 20px ${b.color}40`,
          }}
        />
      ))}

      {/* Rising particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size, height: p.size,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Bouncing character block (Roblox-style figure) */}
      <div className="absolute right-[10%] bottom-[15%] hidden lg:block" style={{ zIndex: 2 }}>
        <div className="bouncing-character" style={{ filter: 'drop-shadow(0 0 30px rgba(255,232,0,0.3))' }}>
          {/* Simple Roblox-style blocky figure made with divs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Head */}
            <div style={{ width: 36, height: 36, background: '#FFE800', borderRadius: 4, border: '2px solid rgba(255,255,255,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, left: 7, width: 6, height: 6, background: '#050505', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 10, right: 7, width: 6, height: 6, background: '#050505', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 12, height: 3, background: '#050505', borderRadius: 2 }} />
            </div>
            {/* Body */}
            <div style={{ width: 40, height: 32, background: '#5865F2', borderRadius: 3, marginTop: 2, border: '2px solid rgba(255,255,255,0.15)' }} />
            {/* Arms */}
            <div style={{ display: 'flex', gap: 36, marginTop: -30 }}>
              <div style={{ width: 12, height: 28, background: '#FFE800', borderRadius: 3, transform: 'rotate(-25deg)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ width: 12, height: 28, background: '#FFE800', borderRadius: 3, transform: 'rotate(25deg)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            {/* Legs */}
            <div style={{ display: 'flex', gap: 4, marginTop: -2 }}>
              <div style={{ width: 16, height: 26, background: '#333', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ width: 16, height: 26, background: '#333', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        </div>
        {/* Shadow */}
        <div className="character-shadow" style={{ width: 50, height: 8, background: 'rgba(255,232,0,0.15)', borderRadius: '50%', margin: '8px auto 0', filter: 'blur(4px)' }} />
      </div>

      {/* Second bouncing character on left */}
      <div className="absolute left-[8%] bottom-[25%] hidden md:block" style={{ zIndex: 2 }}>
        <div className="bouncing-character" style={{ animationDelay: '0.8s', filter: 'drop-shadow(0 0 20px rgba(57,255,20,0.3))' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(0.75)' }}>
            <div style={{ width: 36, height: 36, background: '#39FF14', borderRadius: 4, border: '2px solid rgba(255,255,255,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, left: 7, width: 6, height: 6, background: '#050505', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 10, right: 7, width: 6, height: 6, background: '#050505', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 12, height: 3, background: '#050505', borderRadius: 2 }} />
            </div>
            <div style={{ width: 40, height: 32, background: '#FF3B30', borderRadius: 3, marginTop: 2, border: '2px solid rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', gap: 36, marginTop: -30 }}>
              <div style={{ width: 12, height: 28, background: '#39FF14', borderRadius: 3, transform: 'rotate(-30deg)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ width: 12, height: 28, background: '#39FF14', borderRadius: 3, transform: 'rotate(30deg)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: -2 }}>
              <div style={{ width: 16, height: 26, background: '#222', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ width: 16, height: 26, background: '#222', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        </div>
        <div className="character-shadow" style={{ animationDelay: '0.8s', width: 40, height: 6, background: 'rgba(57,255,20,0.15)', borderRadius: '50%', margin: '6px auto 0', filter: 'blur(3px)' }} />
      </div>

      {/* Gradient overlay */}
      <div className="hero-overlay absolute inset-0" />
    </div>
  );
}

export default function LandingPage() {
  const [games, setGames] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [stats, setStats] = useState({ orders_delivered: 0, products_in_stock: 0, games_available: 0 });
  const { addItem } = useCart();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    axios.get(`${API}/games`).then(r => setGames(r.data)).catch(() => {});
    axios.get(`${API}/products/best-sellers?limit=8`).then(r => setBestSellers(r.data)).catch(() => {});
    axios.get(`${API}/stats/public`).then(r => setStats(r.data)).catch(() => {});
  }, []);

  const faqs = [
    { q: 'How does delivery work?', a: 'After placing your order, you\'ll receive an Order ID. Join our Discord server, open a ticket, and paste your Order ID. Our team will deliver your items promptly.' },
    { q: 'What payment methods do you accept?', a: 'We accept various payment methods through our secure checkout. More payment options coming soon.' },
    { q: 'How long does delivery take?', a: 'Most orders are delivered within minutes to a few hours depending on availability and game requirements.' },
    { q: 'What if I have an issue with my order?', a: 'Contact us on Discord anytime. Our support team is available 24/7 to help resolve any issues.' },
    { q: 'Can I get a refund?', a: 'We offer refunds on a case-by-case basis. Please contact support on Discord for assistance.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <AnimatedHeroBg />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="rift-badge rounded-sm inline-block mb-6">Roblox Item Marketplace</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="font-['Unbounded'] text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] tracking-tighter leading-[1.1] mb-6">
            The Fastest Way To Get<br /><span className="text-[#FFE800]">Roblox Items</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="text-base sm:text-lg text-[#A3A3A3] max-w-2xl mx-auto mb-8 leading-relaxed">
            Browse games, grab your items, and have them delivered in minutes. Every purchase backed by our delivery guarantee.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="rift-btn-primary rounded-sm h-12 px-8 text-sm font-bold" data-testid="hero-shop-btn">
              <a href="#games">Start Shopping</a>
            </Button>
            <Button asChild variant="outline" className="rounded-sm h-12 px-8 text-sm font-bold border-[#262626] bg-transparent text-[#F5F5F5] hover:bg-white/5 hover:text-[#F5F5F5]" data-testid="hero-discord-btn">
              <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer">
                <FaDiscord className="mr-2" size={18} /> Join Discord
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Marquee */}
      <div className="trust-marquee py-4 bg-[#0A0A0A]" data-testid="trust-marquee">
        <Marquee speed={40} gradient={false} className="overflow-hidden">
          {[
            { icon: <Lightning size={16} weight="fill" className="text-[#FFE800]" />, text: 'Instant Discord Delivery' },
            { icon: <ShieldCheck size={16} weight="fill" className="text-[#39FF14]" />, text: 'Secure Payments' },
            { icon: <CurrencyDollar size={16} weight="fill" className="text-[#FFE800]" />, text: `${stats.orders_delivered || '0'}+ Orders Delivered` },
            { icon: <Headset size={16} weight="fill" className="text-[#39FF14]" />, text: '24/7 Discord Support' },
            { icon: <Lightning size={16} weight="fill" className="text-[#FFE800]" />, text: `${stats.products_in_stock || '0'}+ Products In Stock` },
            { icon: <ShieldCheck size={16} weight="fill" className="text-[#39FF14]" />, text: 'Trusted Marketplace' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 mx-8">
              {item.icon}
              <span className="text-xs uppercase tracking-[0.15em] font-bold text-[#A3A3A3] whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Stats Bar */}
      <section className="py-12 bg-[#050505]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-3 gap-4 text-center">
          {[
            { value: `${stats.orders_delivered}+`, label: 'Orders Delivered' },
            { value: `${stats.products_in_stock}+`, label: 'Products In Stock' },
            { value: `${stats.games_available}+`, label: 'Games Available' },
          ].map((stat, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <p className="font-['Unbounded'] text-2xl sm:text-3xl font-black text-[#FFE800]">{stat.value}</p>
              <p className="text-xs sm:text-sm text-[#737373] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Game Catalog */}
      <section id="games" className="py-24 sm:py-32 bg-[#050505]" data-testid="games-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <span className="rift-badge rounded-sm inline-block mb-4">Select Game</span>
            <h2 className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight">Pick Your Game</h2>
          </motion.div>

          {games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#737373] text-lg mb-4">No games listed yet</p>
              <p className="text-[#A3A3A3] text-sm">Games will appear here once the admin adds them. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {games.map((game, i) => {
                const isHero = i === 0;
                return (
                  <motion.div
                    key={game.id}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                    className={`${isHero ? 'col-span-full md:col-span-8 md:row-span-2' : 'col-span-full md:col-span-4'}`}
                  >
                    <Link
                      to={`/game/${game.slug}`}
                      className={`rift-card rounded-sm block overflow-hidden group relative ${isHero ? 'h-64 md:h-full min-h-[300px]' : 'h-52'}`}
                      data-testid={`game-card-${game.slug}`}
                    >
                      {game.image_url ? (
                        <img src={game.image_url} alt={game.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#111111]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="relative h-full flex flex-col justify-end p-6">
                        <span className="text-xs uppercase tracking-[0.15em] font-bold text-[#FFE800] mb-1">Shop Now</span>
                        <h3 className={`font-['Unbounded'] font-bold text-[#F5F5F5] tracking-tight ${isHero ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>{game.name}</h3>
                        {game.product_count > 0 && (
                          <p className="text-xs text-[#A3A3A3] mt-1">{game.product_count} items available</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-24 sm:py-32 bg-[#0A0A0A]" data-testid="best-sellers-section">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
              <span className="rift-badge rounded-sm inline-block mb-4">Hot Items</span>
              <h2 className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight">Best Sellers</h2>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestSellers.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.05}
                  className="rift-card rounded-sm overflow-hidden group cursor-pointer"
                  onClick={() => addItem(product)}
                  data-testid={`best-seller-${product.id}`}
                >
                  <div className="aspect-square bg-[#1A1A1A] relative overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#737373] text-xs">No Image</div>
                    )}
                    {product.sold_count > 0 && (
                      <span className="absolute top-2 left-2 rift-badge rounded-sm text-[10px]">{product.sold_count} sold</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#F5F5F5] truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#FFE800]">${product.price.toFixed(2)}</span>
                      {product.original_price > product.price && (
                        <span className="text-xs text-[#737373] line-through">${product.original_price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why RiftMarket */}
      <section className="py-24 sm:py-32 bg-[#050505]" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <span className="rift-badge rounded-sm inline-block mb-4">Why RiftMarket</span>
            <h2 className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight">The Gold Standard</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Lightning size={28} weight="fill" />, title: 'Lightning Fast', desc: 'Most orders delivered in minutes through our Discord system.' },
              { icon: <ShieldCheck size={28} weight="fill" />, title: 'Secure Payments', desc: 'Safe and encrypted payment processing for every transaction.' },
              { icon: <Headset size={28} weight="fill" />, title: '24/7 Support', desc: 'Real humans on Discord anytime you need help.' },
              { icon: <CurrencyDollar size={28} weight="fill" />, title: 'Fair Prices', desc: 'Competitive prices on every item. Best deals guaranteed.' },
            ].map((feature, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                className="rift-card rounded-sm p-6 group"
              >
                <div className="text-[#FFE800] mb-4 group-hover:scale-110 transition-transform duration-200">{feature.icon}</div>
                <h3 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Discord CTA */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-12 rift-card rounded-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-['Unbounded'] text-lg font-bold text-[#F5F5F5] mb-1">Join the Community</h3>
              <p className="text-sm text-[#737373]">Get exclusive deals, support, and trade with other members.</p>
            </div>
            <a
              href="https://discord.gg/gvDs4AxP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors font-bold text-sm shrink-0"
              data-testid="discord-cta-btn"
            >
              <FaDiscord size={20} />
              Join Discord
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32 bg-[#0A0A0A]" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
            <span className="rift-badge rounded-sm inline-block mb-4">Support</span>
            <h2 className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight">FAQ</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.05}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full rift-card rounded-sm p-4 flex items-center justify-between text-left"
                  data-testid={`faq-item-${i}`}
                >
                  <span className="text-sm font-medium text-[#F5F5F5]">{faq.q}</span>
                  <CaretDown size={18} className={`text-[#A3A3A3] transition-transform duration-200 shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-2 bg-[#111111] border-x border-b border-[#262626] rounded-b-sm -mt-px">
                    <p className="text-sm text-[#A3A3A3] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32 bg-[#050505] text-center" data-testid="final-cta-section">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight mb-6">
            Ready to level up?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-base text-[#A3A3A3] mb-8">
            Pick a game, grab your items, and have them delivered in minutes.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
            <Button asChild className="rift-btn-primary rounded-sm h-12 px-8 text-sm font-bold" data-testid="final-cta-btn">
              <a href="#games">Start Shopping Now</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

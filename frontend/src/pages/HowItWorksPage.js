import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, CurrencyDollar, ChatCircle, GameController, Package, Truck } from '@phosphor-icons/react';
import { FaDiscord } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const steps = [
  { icon: <GameController size={28} weight="fill" />, title: 'Browse & Pick', desc: 'Select your game from our catalog and find the items you want.' },
  { icon: <ShoppingCart size={28} weight="fill" />, title: 'Add to Cart', desc: 'Add items to your cart. Adjust quantities as needed.' },
  { icon: <CurrencyDollar size={28} weight="fill" />, title: 'Checkout', desc: 'Enter your Roblox username (we verify it\'s real), email, and complete your order.' },
  { icon: <Package size={28} weight="fill" />, title: 'Get Your Order ID', desc: 'You\'ll receive a unique Order ID (like RIFT-A1B2C3D4) after placing your order.' },
  { icon: <ChatCircle size={28} weight="fill" />, title: 'Join Discord', desc: 'Join our Discord server and open a support ticket. Paste your Order ID.' },
  { icon: <Truck size={28} weight="fill" />, title: 'Receive Items', desc: 'Our staff will verify your order and deliver items to your Roblox account.' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-12" data-testid="how-it-works-page">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="mb-12 text-center">
          <span className="rift-badge rounded-sm inline-block mb-4">Tutorial</span>
          <h1 className="font-['Unbounded'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F5F5] tracking-tight">How It Works</h1>
          <p className="text-base text-[#A3A3A3] mt-3">Getting your Roblox items is simple. Follow these steps.</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="rift-card rounded-sm p-6 flex items-start gap-5" data-testid={`step-${i + 1}`}>
              <div className="shrink-0 w-12 h-12 rounded-sm bg-[#FFE800]/10 border border-[#FFE800]/30 flex items-center justify-center text-[#FFE800]">
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#FFE800] uppercase tracking-wider">Step {i + 1}</span>
                </div>
                <h3 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] mb-1">{step.title}</h3>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="mt-12 rift-card rounded-sm p-8 text-center">
          <h3 className="font-['Unbounded'] text-lg font-bold text-[#F5F5F5] mb-3">Ready to get started?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="rift-btn-primary rounded-sm h-11 px-6 text-sm font-bold inline-flex items-center justify-center" data-testid="start-shopping-btn">Start Shopping</Link>
            <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-sm bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors font-bold text-sm" data-testid="join-discord-btn">
              <FaDiscord size={18} /> Join Discord
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

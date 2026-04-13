import { Link } from 'react-router-dom';
import { ShoppingCart, List, X } from '@phosphor-icons/react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

export default function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass-header sticky top-0 z-50" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" data-testid="brand-logo">
          <span className="font-['Unbounded'] text-xl font-black text-[#FFE800] tracking-tight">RIFT</span>
          <span className="font-['Unbounded'] text-xl font-light text-[#F5F5F5] tracking-tight">MARKET</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
          <Link to="/" className="text-sm font-medium text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors">Home</Link>
          <a href="/#games" className="text-sm font-medium text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors">Games</a>
          <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors">Discord</a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-sm hover:bg-white/10 transition-colors"
            data-testid="cart-button"
          >
            <ShoppingCart size={22} weight="bold" className="text-[#F5F5F5]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FFE800] text-[#050505] text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-[#F5F5F5]" data-testid="mobile-menu-toggle">
            {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-3 bg-black/90" data-testid="mobile-nav">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#A3A3A3] hover:text-[#F5F5F5]">Home</Link>
          <a href="/#games" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#A3A3A3] hover:text-[#F5F5F5]">Games</a>
          <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#A3A3A3] hover:text-[#F5F5F5]">Discord</a>
        </nav>
      )}
    </header>
  );
}

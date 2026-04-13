import { Link } from 'react-router-dom';
import { FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#262626] py-16 sm:py-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-['Unbounded'] text-xl font-black text-[#FFE800]">RIFT</span>
              <span className="font-['Unbounded'] text-xl font-light text-[#F5F5F5]">MARKET</span>
            </div>
            <p className="text-sm text-[#737373] leading-relaxed max-w-xs">
              Your trusted source for Roblox game items. Fast delivery, secure payments, real support.
            </p>
          </div>

          <div>
            <h4 className="font-['Unbounded'] text-xs font-bold text-[#F5F5F5] mb-4 uppercase tracking-wider">Shop</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Browse Games</Link>
              <Link to="/proofs" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Proof Logs</Link>
              <Link to="/how-it-works" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">How It Works</Link>
              <Link to="/about" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">About Us</Link>
            </div>
          </div>

          <div>
            <h4 className="font-['Unbounded'] text-xs font-bold text-[#F5F5F5] mb-4 uppercase tracking-wider">Help</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Terms of Service</Link>
              <Link to="/refund" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Refund Policy</Link>
              <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Support</a>
            </div>
          </div>

          <div>
            <h4 className="font-['Unbounded'] text-xs font-bold text-[#F5F5F5] mb-4 uppercase tracking-wider">Community</h4>
            <a
              href="https://discord.gg/gvDs4AxP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors text-sm font-medium"
              data-testid="footer-discord-link"
            >
              <FaDiscord size={18} />
              Join Discord
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1A1A1A] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#737373]">RiftMarket is not affiliated with Roblox Corporation.</p>
          <div className="flex gap-4 text-xs text-[#737373]">
            <Link to="/privacy" className="hover:text-[#A3A3A3]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#A3A3A3]">Terms</Link>
            <Link to="/refund" className="hover:text-[#A3A3A3]">Refunds</Link>
          </div>
        </div>

        <div className="mt-8">
          <p className="font-['Unbounded'] text-5xl sm:text-7xl lg:text-8xl font-black text-[#0D0D0D] select-none tracking-tighter leading-none">
            RIFTMARKET
          </p>
        </div>
      </div>
    </footer>
  );
}

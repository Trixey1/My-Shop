import { FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#262626] py-16 sm:py-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-['Unbounded'] text-xl font-black text-[#FFE800]">RIFT</span>
              <span className="font-['Unbounded'] text-xl font-light text-[#F5F5F5]">MARKET</span>
            </div>
            <p className="text-sm text-[#737373] leading-relaxed max-w-xs">
              Your trusted source for Roblox game items. Fast delivery, secure payments, real support.
            </p>
          </div>

          <div>
            <h4 className="font-['Unbounded'] text-sm font-bold text-[#F5F5F5] mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="/#games" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Browse Games</a>
              <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Support</a>
              <a href="/admin" className="text-sm text-[#737373] hover:text-[#FFE800] transition-colors">Admin</a>
            </div>
          </div>

          <div>
            <h4 className="font-['Unbounded'] text-sm font-bold text-[#F5F5F5] mb-4 uppercase tracking-wider">Community</h4>
            <a
              href="https://discord.gg/gvDs4AxP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors text-sm font-medium"
              data-testid="footer-discord-link"
            >
              <FaDiscord size={18} />
              Join our Discord
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#1A1A1A]">
          <p className="font-['Unbounded'] text-6xl sm:text-8xl lg:text-9xl font-black text-[#111111] select-none tracking-tighter leading-none">
            RIFTMARKET
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-12" data-testid="about-page">
      <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24">
        <span className="rift-badge rounded-sm inline-block mb-4">About</span>
        <h1 className="font-['Unbounded'] text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mb-8">About RiftMarket</h1>
        <div className="space-y-6 text-sm text-[#A3A3A3] leading-relaxed">
          <p>RiftMarket is your trusted marketplace for Roblox game items. We connect players with the items they need, delivered securely and quickly through our Discord-based delivery system.</p>
          <h2 className="font-['Unbounded'] text-lg font-semibold text-[#F5F5F5] pt-4">Our Mission</h2>
          <p>We believe every Roblox player deserves fast, fair, and trustworthy access to in-game items. Our platform is built on transparency — every delivery is verified and logged.</p>
          <h2 className="font-['Unbounded'] text-lg font-semibold text-[#F5F5F5] pt-4">How We Operate</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>All items are sourced legitimately and delivered by verified staff members.</li>
            <li>Every transaction is logged with delivery proof for full accountability.</li>
            <li>We verify Roblox usernames at checkout to ensure accurate delivery.</li>
            <li>Our 24/7 Discord support team is always ready to help.</li>
          </ul>
          <h2 className="font-['Unbounded'] text-lg font-semibold text-[#F5F5F5] pt-4">Contact Us</h2>
          <p>For any questions, concerns, or business inquiries, reach out to us on <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">Discord</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-12" data-testid="privacy-page">
      <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24">
        <span className="rift-badge rounded-sm inline-block mb-4">Legal</span>
        <h1 className="font-['Unbounded'] text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mb-8">Privacy Policy</h1>
        <div className="space-y-5 text-sm text-[#A3A3A3] leading-relaxed">
          <p><strong className="text-[#F5F5F5]">Last updated:</strong> April 2026</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">1. Information We Collect</h2>
          <p>We collect the following information when you place an order: your name, email address, and Roblox username. We do not collect payment card information — all payments are processed securely by our third-party payment provider.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1"><li>To process and deliver your orders</li><li>To communicate with you about your order status</li><li>To verify your Roblox account for delivery</li><li>To improve our services</li></ul>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">3. Data Sharing</h2>
          <p>We do not sell, rent, or share your personal information with third parties except as necessary to process your orders (e.g., payment processors).</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no internet transmission is 100% secure.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">5. Cookies</h2>
          <p>We use essential cookies for authentication and cart functionality. No third-party tracking cookies are used.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">6. Contact</h2>
          <p>For privacy concerns, contact us via <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">Discord</a>.</p>
        </div>
      </div>
    </div>
  );
}

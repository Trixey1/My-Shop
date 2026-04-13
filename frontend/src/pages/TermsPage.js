export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-12" data-testid="terms-page">
      <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24">
        <span className="rift-badge rounded-sm inline-block mb-4">Legal</span>
        <h1 className="font-['Unbounded'] text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mb-8">Terms of Service</h1>
        <div className="space-y-5 text-sm text-[#A3A3A3] leading-relaxed">
          <p><strong className="text-[#F5F5F5]">Last updated:</strong> April 2026</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">1. Acceptance of Terms</h2>
          <p>By using RiftMarket, you agree to these Terms of Service. If you do not agree, do not use our services.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">2. Services</h2>
          <p>RiftMarket provides a marketplace for purchasing virtual items in Roblox games. Items are delivered through our Discord-based delivery system by verified staff members.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">3. Account Requirements</h2>
          <ul className="list-disc list-inside space-y-1"><li>You must provide a valid Roblox username at checkout</li><li>You must provide a valid email address for order confirmation</li><li>You must be the rightful owner of the Roblox account provided</li></ul>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">4. Orders & Delivery</h2>
          <ul className="list-disc list-inside space-y-1"><li>All orders are final once placed</li><li>Delivery is conducted through our Discord server</li><li>You must join our Discord and open a ticket with your Order ID</li><li>Delivery times vary based on staff availability and item type</li></ul>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">5. Prohibited Activities</h2>
          <ul className="list-disc list-inside space-y-1"><li>Using fake or stolen Roblox accounts</li><li>Attempting to exploit or abuse our services</li><li>Chargebacks or fraudulent payment disputes</li></ul>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">6. Limitation of Liability</h2>
          <p>RiftMarket is not affiliated with Roblox Corporation. We are not responsible for any actions taken by Roblox regarding your account. Use our services at your own discretion.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">7. Contact</h2>
          <p>Questions about these terms? Contact us on <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">Discord</a>.</p>
        </div>
      </div>
    </div>
  );
}

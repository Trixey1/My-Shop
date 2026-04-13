export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-12" data-testid="refund-page">
      <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24">
        <span className="rift-badge rounded-sm inline-block mb-4">Legal</span>
        <h1 className="font-['Unbounded'] text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mb-8">Refund Policy</h1>
        <div className="space-y-5 text-sm text-[#A3A3A3] leading-relaxed">
          <p><strong className="text-[#F5F5F5]">Last updated:</strong> April 2026</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">1. General Policy</h2>
          <p>Due to the digital nature of our products, all sales are generally considered final. However, we understand issues can arise and handle refunds on a case-by-case basis.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">2. Eligible for Refund</h2>
          <ul className="list-disc list-inside space-y-1"><li>Order was not delivered within 24 hours of placement</li><li>Wrong item was delivered (verified by delivery proof)</li><li>Item was not as described in the listing</li><li>Duplicate charge or billing error</li></ul>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">3. Not Eligible for Refund</h2>
          <ul className="list-disc list-inside space-y-1"><li>Buyer changed their mind after delivery</li><li>Buyer provided incorrect Roblox username</li><li>Item was successfully delivered (confirmed by proof)</li><li>Buyer's Roblox account was banned or restricted</li></ul>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">4. How to Request a Refund</h2>
          <ol className="list-decimal list-inside space-y-1"><li>Join our Discord server</li><li>Open a support ticket</li><li>Provide your Order ID and explain the issue</li><li>Our team will review and respond within 24 hours</li></ol>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">5. Chargebacks</h2>
          <p>Filing a chargeback without first contacting our support team will result in a permanent ban from our services. We maintain detailed delivery proof logs for all orders.</p>
          <h2 className="font-['Unbounded'] text-base font-semibold text-[#F5F5F5] pt-2">6. Contact</h2>
          <p>For refund requests, contact us on <a href="https://discord.gg/gvDs4AxP" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline">Discord</a>.</p>
        </div>
      </div>
    </div>
  );
}

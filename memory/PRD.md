# RiftMarket - Roblox Item Marketplace PRD

## What's Been Implemented

### Phase 1 - Core MVP
- Full backend API, animated hero, game catalog, cart, checkout, admin panel

### Phase 2 - Discord + Data
- Discord webhook (auto-posts orders), seeded 5 games with 20 products

### Phase 3 - Major Feature Update (2026-04-13)
- [x] Fixed home navigation (React Router Link instead of anchor tags)
- [x] Full Checkout page with Roblox username validation via Roblox API
- [x] Email validation (regex + visual feedback)  
- [x] "Link Discord" button on checkout
- [x] Proofs page - admin uploads delivery screenshots, public gallery
- [x] Order confirmation with confetti animation and next steps
- [x] Updated header: Home, Games, Proofs (LIVE), Tutorial, Discord
- [x] About Us page
- [x] How It Works / Tutorial page (6-step guide)
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Refund Policy page
- [x] Updated footer with Shop + Help sections

## Credentials
- Admin: admin@riftmarket.com / RiftAdmin2026!
- Discord: https://discord.gg/gvDs4AxP

## What Requires Separate Setup (Outside This Platform)
- **Discord Bot (RIFT)**: Auto-create ticket channels, DM users order details, auto-ticket on join. This needs a separate 24/7 Discord bot using discord.js or discord.py with:
  - Bot token from Discord Developer Portal
  - Webhook listener for order events
  - Channel creation permissions
  - DM capability
- **Dodo Payments**: Need API key from dodopayments.com for real payment processing

## Backlog
- [ ] Dodo Payments integration
- [ ] Discord bot (auto-tickets, DM on join)
- [ ] Product image upload
- [ ] Creator discount codes
- [ ] Customer order tracking by email

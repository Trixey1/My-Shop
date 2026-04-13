# RiftMarket - Roblox Item Marketplace

## Problem Statement
Build an online Roblox item marketplace similar to petmart.fun but with better design. Users browse games, add items to cart, checkout, and receive items via Discord delivery.

## Architecture
- **Frontend**: React 19 + TailwindCSS + Shadcn UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Auth**: JWT with httpOnly cookies (admin only)
- **Payments**: Dodo Payments (PLACEHOLDER - no API key configured yet)
- **Delivery**: Manual via Discord (user pastes Order ID in ticket)
- **Discord Webhook**: Auto-posts order details to staff channel on order creation

## User Personas
1. **Buyer**: Browses games, adds items to cart, checks out, joins Discord for delivery
2. **Admin (Owner)**: Manages games, products, orders via admin panel

## Core Requirements
- Landing page with animated hero, game catalog, best sellers, trust indicators, FAQ
- Individual game pages with product listings
- Shopping cart (localStorage-based) with slide-out sidebar
- Checkout creates order → Order confirmation with Discord link + Order ID
- Discord webhook notification on every order
- Admin panel: Games CRUD, Products CRUD, Orders management, Stats dashboard

## What's Been Implemented
### Phase 1 (2026-04-13)
- [x] Full backend API (auth, games, products, orders, stats)
- [x] Animated hero with floating blocks, bouncing Roblox characters, particles
- [x] Landing page with all sections
- [x] Game catalog with bento grid layout
- [x] Product listings per game with search
- [x] Shopping cart sidebar with checkout flow
- [x] Order confirmation page with Discord instructions
- [x] Admin login + dashboard with tabs (Games, Products, Orders)
- [x] Admin CRUD for games, products, order status management
- [x] Cyberpunk dark theme (Unbounded + Manrope fonts, #FFE800 accent)
- [x] Mobile responsive design
- [x] Trust marquee, FAQ section, Discord CTAs

### Phase 2 (2026-04-13)
- [x] Discord webhook integration (auto-posts to staff channel on order)
- [x] Seeded 5 games: Blox Fruits, Murder Mystery 2, Adopt Me, Grow A Garden, Rivals
- [x] 20 products across all games (all $0.00 for testing)
- [x] Full end-to-end buyer flow tested and working

## Prioritized Backlog
### P0 (Critical)
- [ ] Dodo Payments integration (user needs API key from dodopayments.com)

### P1 (Important)
- [ ] Product image upload (object storage or URL input in admin)
- [ ] Email notifications on order creation
- [ ] Search across all products from landing page

### P2 (Nice to have)
- [ ] Creator discount codes
- [ ] Customer order tracking by email
- [ ] Order proof/delivery logs page
- [ ] Trustpilot/review integration

## Credentials
- Admin: admin@riftmarket.com / RiftAdmin2026!
- Discord: https://discord.gg/gvDs4AxP
- Discord Webhook: Configured in backend .env

## How The Full Flow Works
1. Buyer visits site → browses games → clicks a game
2. Sees products → clicks "Add" → cart sidebar opens
3. Fills name + email → clicks "Place Order"
4. Order created in DB → Discord webhook fires (staff sees order in Discord)
5. Buyer sees Order Confirmation with Order ID + "Join Discord" instructions
6. Buyer joins Discord, opens ticket, pastes Order ID
7. Staff verifies order in admin panel, delivers item, marks "delivered"

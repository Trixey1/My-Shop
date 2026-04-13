# RiftMarket - Roblox Item Marketplace

## Problem Statement
Build an online Roblox item marketplace similar to petmart.fun but with better design. Users browse games, add items to cart, checkout, and receive items via Discord delivery.

## Architecture
- **Frontend**: React 19 + TailwindCSS + Shadcn UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Auth**: JWT with httpOnly cookies (admin only)
- **Payments**: Dodo Payments (PLACEHOLDER - no key configured yet)
- **Delivery**: Manual via Discord (user pastes Order ID in ticket)

## User Personas
1. **Buyer**: Browses games, adds items to cart, checks out, joins Discord for delivery
2. **Admin (Owner)**: Manages games, products, orders via admin panel

## Core Requirements
- Landing page with animated hero, game catalog, best sellers, trust indicators, FAQ
- Individual game pages with product listings
- Shopping cart (localStorage-based) with slide-out sidebar
- Checkout creates order → Order confirmation with Discord link + Order ID
- Admin panel: Games CRUD, Products CRUD, Orders management, Stats dashboard

## What's Been Implemented (2026-04-13)
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

## Prioritized Backlog
### P0 (Critical)
- [ ] Dodo Payments integration (user needs API key)
- [ ] Discord webhook bot for order notifications

### P1 (Important)
- [ ] Email notifications on order creation
- [ ] Product image upload (object storage)
- [ ] Search across all products from landing page

### P2 (Nice to have)
- [ ] Creator discount codes
- [ ] Order proof/delivery logs page
- [ ] Customer order tracking by email
- [ ] Trustpilot/review integration

## Credentials
- Admin: admin@riftmarket.com / RiftAdmin2026!
- Discord: https://discord.gg/gvDs4AxP

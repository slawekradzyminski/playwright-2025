# UI Test Coverage Plan

Last verified: 2026-01-30
Source of truth:
- Frontend routes: `vite-react-frontend/src/AppRoutes.tsx`
- Live UI exploration via Playwright MCP on http://127.0.0.1:8081

## Current Playwright UI coverage (existing tests)
- Covered screens:
  - `/login` (tests/ui/login.ui.spec.ts)
  - `/register` (tests/ui/register.ui.spec.ts)
  - `/` Home (tests/ui/home.ui.spec.ts)
  - `/admin` Admin Dashboard (tests/ui/adminDashboard.ui.spec.ts)
  - `/admin/products` Admin Products (tests/ui/adminProducts.ui.spec.ts)

## Screen inventory + coverage status
Legend: [x] covered, [~] partial, [ ] not covered

### Auth (public)
- [x] `/login` Sign in page
- [x] `/register` Registration page
- [ ] `/forgot-password` Forgot password page
- [ ] `/reset` Reset password page

### Core (protected)
- [x] `/` Home page
- [ ] `/products` Products listing
- [ ] `/products/:id` Product details
- [ ] `/cart` Cart (empty vs with items)
- [ ] `/checkout` Checkout (redirects to `/cart` when empty)
- [ ] `/profile` Profile + prompts + orders summary
- [ ] `/orders/:id` Order details

### Users (protected)
- [ ] `/users` Users list
- [ ] `/users/:username/edit` Edit user

### Utilities (protected)
- [ ] `/email` Email sender
- [ ] `/qr` QR code generator
- [ ] `/traffic` Traffic monitor (websocket status)

### LLM (protected)
- [ ] `/llm` LLM overview
- [ ] `/llm/chat` LLM chat
- [ ] `/llm/generate` LLM generate
- [ ] `/llm/tools` LLM chat + tools

### Admin (protected, ADMIN role)
- [x] `/admin` Admin dashboard
- [x] `/admin/products` Manage products
- [ ] `/admin/products/new` Product create form
- [ ] `/admin/products/edit/:id` Product edit form
- [ ] `/admin/orders` Manage orders

## Implementation plan (trackable)

### P0: Core commerce flow
- [ ] Add `products.ui.spec.ts` for `/products`
  - Categories filter, search, sort, add-to-cart quantity controls
- [ ] Add `productDetails.ui.spec.ts` for `/products/:id`
  - Details render, stock display, quantity, add-to-cart
- [ ] Add `cart.ui.spec.ts` for `/cart`
  - Empty state, item list, quantity update, remove item, totals
- [ ] Add `checkout.ui.spec.ts` for `/checkout`
  - Redirect when empty, form validation, successful submit path

### P1: Orders + profile
- [ ] Add `profile.ui.spec.ts` for `/profile`
  - Update profile fields, system prompt save, orders list rendering
- [ ] Add `orderDetails.ui.spec.ts` for `/orders/:id`
  - Items summary, status, address, cancel/update actions

### P1: Users management
- [ ] Add `users.ui.spec.ts` for `/users`
  - Users list renders, edit/delete buttons visible, back-to-home
- [ ] Add `editUser.ui.spec.ts` for `/users/:username/edit`
  - Prefilled data, save/cancel flows

### P1: Admin workflows
- [ ] Add `adminOrders.ui.spec.ts` for `/admin/orders`
  - Filter by status, pagination disabled state, view details link
- [ ] Add `adminProductForm.ui.spec.ts` for `/admin/products/new` and `/admin/products/edit/:id`
  - Required fields, create/update success, cancel/back behavior

### P2: Utilities + LLM
- [ ] Add `email.ui.spec.ts` for `/email`
  - Required fields, send action, toast
- [ ] Add `qr.ui.spec.ts` for `/qr`
  - Generate QR, clear button enabled after generate
- [ ] Add `traffic.ui.spec.ts` for `/traffic`
  - Connection status text, clear events disabled state
- [ ] Add `llm.ui.spec.ts` for `/llm` overview
  - Card links to chat/generate/tools
- [ ] Add `llmChat.ui.spec.ts` for `/llm/chat`
  - Settings panel toggles, send disabled when empty
- [ ] Add `llmGenerate.ui.spec.ts` for `/llm/generate`
  - Prompt required, generate disabled when empty
- [ ] Add `llmTools.ui.spec.ts` for `/llm/tools`
  - Tools list visible, send disabled when empty

### P3: Authentication + recovery
- [ ] Add `forgotPassword.ui.spec.ts` covering `/forgot-password`
  - Input validation, success toast, back-to-login navigation
- [ ] Add `resetPassword.ui.spec.ts` covering `/reset`
  - Required field validation, mismatched password error, success path

## Selector hygiene
- Prefer `data-testid` for all selectors.
- Observed data-testid usage already present (e.g., login inputs, product item, user edit button).
- If a screen is hard to target, add missing `data-testid` attributes in the frontend first.

## Test data assumptions
- Admin credentials in `/Users/admin/IdeaProjects/playwright-2025/.env` (admin/admin).
- Product catalog and orders seeded; order dates currently show 29/01/2026.
- `/checkout` redirects to `/cart` when cart is empty.


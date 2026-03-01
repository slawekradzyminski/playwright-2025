# UI Test Plan

## Goal
Build complete automated UI coverage for routed screens in `~/IdeaProjects/vite-react-frontend`, with clear progress tracking for page/screen-level testing.

## Discovery Method
1. Route source analysis from `src/AppRoutes.tsx`.
2. Live route probing with Playwright MCP against `http://127.0.0.1:8081`.
3. Authenticated validation using both client and admin users (UI login flow) to confirm role-gated screens.

## Current Coverage Snapshot
- Routed screens discovered: **26**
- `done`: **2** (`/login`, `/register`)
- `in_progress`: **1** (`/`)
- `todo`: **23**

## Test Design Standards
Each screen spec should include:
1. Render smoke check (critical heading/test id visible) - prefer to verify that in beforeEach hook.
2. Main user actions and expected UI state transitions.
3. Route guard behavior (redirects for unauthenticated/unauthorized users).
4. Empty/loading/error states when applicable.
5. H.appy-path navigation links to and from adjacent screens.
6. Prefer to setup test state via http requests

## Execution Roadmap
1. Phase 1: Public auth screens (`/login`, `/register`, `/forgot-password`, `/reset`).
2. Phase 2: Core authenticated user screens (`/`, `/products`, `/profile`, `/cart`, `/checkout`, `/orders/:id`).
3. Phase 3: Utility and LLM screens (`/email`, `/qr`, `/traffic`, `/llm*`).
4. Phase 4: User/admin management screens (`/users*`, `/admin*`).
5. Phase 5: Stabilization (fixtures, flaky test hardening, full-suite reliability).

## Definition Of Done (Per Screen)
1. Screen has a dedicated UI spec file (or a clearly scoped shared spec section) under `e2e/tests`.
2. Screen is covered with proper fixture role (`authenticatedPage` / `adminPage`) where required.
3. Assertions use stable selectors (prefer `data-testid`).
4. Screen is included in full suite execution (`npm run test:ui`).
5. Quality gates pass (`npm run lint` and `npm run typecheck`).

## Progress Tracker (Screen Coverage)
Status legend: `done`, `in_progress`, `todo`.

| Status | Route | Screen | Access | Notes |
|---|---|---|---|---|
| done | `/login` | Login Page | Public | Auth entry screen |
| done | `/register` | Register Page | Public | Account creation screen |
| done | `/forgot-password` | Forgot Password Page | Public | Password reset request flow |
| done | `/reset` | Reset Password Page | Public | Reset token flow |
| done | `/` | Home Page | Authenticated | Default post-login landing |
| done | `/products` | Products Page | Authenticated | Product catalog |
| done | `/products/:id` | Product Details Page | Authenticated | Product detail view |
| todo | `/users` | Users Page | Authenticated | User list/management view |
| todo | `/users/:username/edit` | Edit User Page | Authenticated | User edit form |
| todo | `/email` | Email Page | Authenticated | Send email form |
| todo | `/qr` | QR Code Page | Authenticated | QR generation |
| todo | `/llm` | LLM Overview Page | Authenticated | LLM mode selection |
| todo | `/llm/chat` | LLM Chat Experience | Authenticated | Conversational mode |
| todo | `/llm/generate` | LLM Generate Experience | Authenticated | Generation mode |
| todo | `/llm/tools` | LLM Tools Experience | Authenticated | Tool-assisted mode |
| todo | `/profile` | Profile Page | Authenticated | User profile and orders summary |
| todo | `/cart` | Cart Page | Authenticated | Cart management |
| todo | `/checkout` | Checkout Page | Authenticated | Checkout flow (may redirect to cart when empty) |
| todo | `/orders` | Orders Route Redirect | Authenticated | Redirects to `/profile` |
| todo | `/orders/:id` | Order Details Page | Authenticated | Order detail and status controls |
| todo | `/admin` | Admin Dashboard Page | Admin only | Role-gated (`requiredRole=ADMIN`) |
| todo | `/admin/products` | Admin Products Page | Admin only | Product admin list |
| todo | `/admin/products/new` | Admin Product Form (Create) | Admin only | New product form |
| todo | `/admin/products/edit/:id` | Admin Product Form (Edit) | Admin only | Edit product form |
| todo | `/admin/orders` | Admin Orders Page | Admin only | Order management |
| todo | `/traffic` | Traffic Monitor Page | Authenticated | Live traffic monitoring |

## Validation Notes (Playwright MCP)
1. Unauthenticated access to protected routes redirects to `/login`.
2. Client login reaches authenticated screens and is redirected away from `/admin*` routes.
3. Admin login reaches all `/admin*` screens successfully.
4. `/orders` is a deliberate redirect route to `/profile`, not a standalone page component.

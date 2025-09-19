# UI Test Plan (Playwright, TypeScript)

Source of truth (frontend): vite-react-frontend routes and pages — see `src/AppRoutes.tsx` and `src/components/ProtectedRoute.tsx`. Base URL: `http://localhost:8081`.

Architecture: UI tests follow the Page Object Model (POM). Reuse the existing pattern from `tests/ui/login.ui.spec.ts` + `pages/loginPage.ts` in your Playwright repo; add new POMs alongside it. Prefer `data-testid` selectors already present across the app.

## Legend & Conventions

*   **Status icons:** ✅ Done · 🏗️ In-progress next · ⏳ To-do
*   **Style:** Given / When / Then comments in each test.
*   **Grouping inside specs:** happy path → validations → auth/role gating → navigation & a11y.
*   **POM location (Playwright repo):** `pages/` (e.g. `registerPage.ts`, `homePage.ts`), specs in `tests/ui/`.

## Screens & Routes (what we’ll cover)

From AppRoutes.tsx plus global Navigation (desktop & mobile) and auth gating:

### Public

*   `/login`
*   `/register`

### Protected (via ProtectedRoute)

*   `/` (Home)
*   `/products`
*   `/products/:id`
*   `/users`
*   `/users/:username/edit`
*   `/email`
*   `/qr`
*   `/llm`
*   `/profile`
*   `/cart`
*   `/checkout`
*   `/orders/:id`
*   `/admin`
*   `/admin/products`
*   `/admin/products/new`
*   `/admin/products/edit/:id`
*   `/admin/orders`
*   `/traffic`

### Global Navigation

*   desktop and mobile menus
*   cart badge
*   profile/username link
*   admin-only “Admin” item
*   login/register links when logged out

## Coverage Matrix

| Screen                   | Route                       | POM class           | Spec file                             | Status  |
| :----------------------- | :-------------------------- | :------------------ | :------------------------------------ | :------ |
| Login                    | `/login`                    | `LoginPage`         | `tests/ui/login.ui.spec.ts`           | ✅      |
| Register                 | `/register`                 | `RegisterPage`      | `tests/ui/register.ui.spec.ts`        | ✅      |
| Home (logged-in)         | `/`                         | `HomePage`          | `tests/ui/home.ui.spec.ts`            | ✅      |
| Navigation (desktop/mobile) | global                      | `Navigation`        | `tests/ui/navigation.ui.spec.ts`      | ✅      |
| Products list            | `/products`                 | `ProductsPage`      | `tests/ui/products.ui.spec.ts`        | ⏳      |
| Product details          | `/products/:id`             | `ProductDetailsPage`| `tests/ui/product-details.ui.spec.ts` | ⏳      |
| Cart                     | `/cart`                     | `CartPage`          | `tests/ui/cart.ui.spec.ts`            | ⏳      |
| Checkout                 | `/checkout`                 | `CheckoutPage`      | `tests/ui/checkout.ui.spec.ts`        | ⏳      |
| Users list               | `/users`                    | `UsersPage`         | `tests/ui/users.ui.spec.ts`           | ⏳      |
| Edit user (admin)        | `/users/:username/edit`     | `EditUserPage`      | `tests/ui/user-edit.ui.spec.ts`       | ⏳      |
| Profile                  | `/profile`                  | `ProfilePage`       | `tests/ui/profile.ui.spec.ts`         | ⏳      |
| Order details            | `/orders/:id`               | `OrderDetailsPage`  | `tests/ui/order-details.ui.spec.ts`   | ⏳      |
| Send Email               | `/email`                    | `EmailPage`         | `tests/ui/email.ui.spec.ts`           | ⏳      |
| QR Code                  | `/qr`                       | `QrPage`            | `tests/ui/qr.ui.spec.ts`              | ⏳      |
| LLM (tabs: Chat/Generate)| `/llm`                      | `LlmPage`           | `tests/ui/llm.ui.spec.ts`             | ⏳      |
| Traffic Monitor          | `/traffic`                  | `TrafficPage`       | `tests/ui/traffic.ui.spec.ts`         | ⏳      |
| Admin dashboard          | `/admin`                    | `AdminDashboardPage`| `tests/ui/admin-dashboard.ui.spec.ts` | ⏳      |
| Admin products           | `/admin/products`           | `AdminProductsPage` | `tests/ui/admin-products.ui.spec.ts`  | ⏳      |
| Admin product form       | `/admin/products/new`, `/admin/products/edit/:id` | `AdminProductFormPage` | `tests/ui/admin-product-form.ui.spec.ts` | ⏳      |
| Admin orders             | `/admin/orders`             | `AdminOrdersPage`   | `tests/ui/admin-orders.ui.spec.ts`    | ⏳      |

Note: Login page is already covered; Register and Home are prioritised next.

## Test Cases by Screen

### 1) Register Page — `/register` (✅)

References: `registerPage.tsx` (testids, success path & error handling), `validators/auth.ts` (zod rules)

#### Happy path

*   **Given** valid form (username ≥ 4, email valid, password ≥ 8, first/last name ≥ 4)
*   **When** submit
*   **Then** toast enqueued on Login and navigate to `/login` showing success message.

#### Validations (client)

*   Required errors displayed under each field when empty; enforce min/max rules per zod schema.

#### Server errors

*   Username already exists → shows toast “Username already exists”.

#### UX

*   Submit button disabled while loading; label switches to “Creating account…”.
*   “Sign in” link navigates to `/login`.

#### POM notes (RegisterPage)

*   Locators by `data-testid`: `register-username-input`, `register-email-input`, `register-password-input`, `register-firstname-input`, `register-lastname-input`, errors, `register-submit-button`, `register-login-link`. (Derive from field containers + inputs in page.)

### 2) Home Page — `/` (✅)

References: `homePage.tsx` (welcome section, CTA buttons), `ProtectedRoute` (auth required).

#### Auth gating

*   **Given** no token
*   **When** visiting `/`
*   **Then** redirected to `/login`.

#### Welcome info

*   Displays “Welcome, {firstName}!” and user email pulled from `/users/me`.

#### CTAs & navigation

*   “View Products” → `/products`
*   “Manage Users” → `/users`
*   “View Profile & Orders” → `/profile`
*   “Open AI Assistant” → `/llm`
*   “Generate QR Codes” → `/qr`
*   “Send Emails” → `/email`
*   “Open Traffic Monitor” → `/traffic`

#### POM notes (HomePage)

*   Use `home-*` testids (e.g. `home-products-button`, `home-users-button`, `home-profile-button`, `home-llm-button`, `home-qr-button`, `home-email-button`, `home-traffic-button`).

### 3) Navigation (global) (✅)

References: `components/layout/Navigation.tsx` (desktop & mobile menus, role-based items, cart counter).

#### Logged-out view

*   Shows “Login” and “Register” links; no cart icon; no menu items.

#### Logged-in (client)

*   Desktop menu contains: Home, Products, Send Email, QR Code, LLM, Traffic Monitor; cart icon shows count; username → `/profile`; logout works (clears token & navigates to `/login`).

#### Logged-in (admin)

*   Also shows “Admin”.

#### Mobile menu

*   Toggle open/close; items mirrored, cart badge shown, profile and logout present.

### 4) Products List — `/products`

*   Lists products; clicking a card → details. (Components present in repo: `ProductList`, `ProductCard`.) Seed via API where needed.

### 5) Product Details — `/products/:id`

*   Shows details, “Add to cart” interaction (uses `AddToCartButton` component). Verify error handling for non-existent product id (should render 404 UI or error toast if implemented).

### 6) Cart — `/cart`

*   Renders cart page wrapper; list items, update quantity, remove item, totals. Proceed to checkout navigates to `/checkout`.

### 7) Checkout — `/checkout`

*   Validates checkout form, simulates success path to order creation; assert redirect/UI confirmation. (Components exist under `components/checkout/*`.)

### 8) Users — `/users`

*   Client: view-only list (no edit/delete). Admin: sees Edit/Delete controls per user; “Edit” navigates; “Delete” asks confirm then deletes and updates list.

### 9) Edit User — `/users/:username/edit`

*   Form validation per `validators/user.ts`; admin role required (non-admin should be redirected by `ProtectedRoute` with role check if configured for this route later).

### 10) Profile — `/profile`

*   Shows current user details and (if implemented) their orders link; reachable from Navigation username and Home CTA.

### 11) Order Details — `/orders/:id`

*   Loads order, allows cancel (user) and status update (admin) with toasts; verify optimistic updates/invalidation.

### 12) Send Email — `/email`

*   Validate form (to/subject/message) against zod; success + error toasts; datalist of user emails present.

### 13) QR Code — `/qr`

*   Generate QR for text/URL; verify image appears and basic error handling (empty input). (Route exists.)

### 14) LLM — `/llm`

*   Tabs switch between Chat and Generate modes; basic smoke to assert streaming output renders for both pages (can stub network).

### 15) Traffic Monitor — `/traffic`

*   Page loads and (optionally) connects to WS endpoint; assert basic rendering of events (stub if needed). (Route exists.)

### 16) Admin Dashboard — `/admin`

*   Shows aggregated metrics (products/orders, pending count). Assert loading state and populated cards when API responds.

### 17) Admin Products — `/admin/products`

*   Lists products with edit/delete/new affordances.

### 18) Admin Product Form — `/admin/products/new`, `/admin/products/edit/:id`

*   Heading changes based on mode; create/edit flows pass; validation error messages shown.

### 19) Admin Orders — `/admin/orders`

*   Lists orders with status; (if actions exposed) validate filtering/transition affordances. (Route declared.)

## Auth & Role Gating (cross-cutting)

*   Unauthenticated → redirect to `/login` on any protected route (assert `protected-route-redirect`).
*   Loading state shows `protected-route-loading` while verifying token.
*   Role check (if `requiredRole` is provided) should redirect unauthorised users to `/`.

## Fixtures, Data & Utilities

*   Auth helpers: seed/create users via API (admin & client) and inject `localStorage.token` before navigation, mirroring existing API fixtures.
*   Data seeding: create products/orders via API clients to drive deterministic UI states (e.g. product exists for details page; cart has items).
*   Selectors: Prefer `data-testid` attributes present throughout pages/components (e.g. `home-*`, `login-*`, `register-*`, `email-*`, `nav` testids), falling back to accessible roles where appropriate.

## Execution Order (easiest → hardest)

1.  Register ✅
2.  Home ✅
3.  Navigation ✅
4.  Products list
5.  Product details
6.  Cart
7.  Checkout
8.  Email
9.  QR
10. LLM
11. Traffic Monitor
12. Users
13. Edit user
14. Profile
15. Order details
16. Admin dashboard
17. Admin products
18. Admin product form
19. Admin orders.

## POM Stubs to Add (Playwright repo)

*   `pages/registerPage.ts` — fill/submit, read error text, click “Sign in”.
*   `pages/homePage.ts` — read welcome text, click CTA buttons.
*   `pages/navigation.ts` — desktop/mobile helpers, cart badge, role toggles, logout.
*   …and one POM per screen from the matrix.

Follow the same conventions as the existing `LoginPage` POM and spec.

## Accessibility & Cross-browser

*   **Basic a11y:** labels associated with inputs (`getByLabelText` where possible), keyboard navigation (Tab/Enter) on login/register, and focus management.
*   **Browsers:** run full suite on Chromium, smoke on Firefox/WebKit for nav + auth + one transactional flow.

## Notes & References (evidence from code)

*   **Routes & protection:** `AppRoutes.tsx` wires all screens; `ProtectedRoute` enforces token & optional role, with deterministic testids.
*   **Navigation:** desktop/mobile items, cart counter, profile/username link, admin-only item, auth links when logged out.
*   **Register:** success redirects to `/login` with success toast; duplicate username shows “Username already exists”; zod schema details all field rules.
*   **Home CTAs:** buttons for Products/Users/Profile/LLM/QR/Email/Traffic.
*   **Component inventory for flows:** Products, Cart, Checkout, Admin, Orders components present to support E2E. 

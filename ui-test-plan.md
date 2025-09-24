# UI Test Plan — Vite React Frontend (Playwright + Page Object Model)

> Copy this file into your repo (e.g. `/docs/ui-test-plan.md`). It mirrors the structure and tone of `api-test-plan.md` while focusing on end‑to‑end UI coverage with Playwright. One view per spec, one page object per view, following the existing `/login` and `/register` examples.

---

## Goals

* Full functional coverage of all **routed views** under `AppRoutes.tsx`
* **One spec per view**: `<routeName>.ui.spec.ts`
* **One page object per view**: `<RouteName>Page.ts`
* Stable, realistic flows that exercise auth, RBAC, data states, and navigation
* Quick accessibility smoke on each view; key journeys tagged `@smoke`
* Keep tests independent/restartable; deterministic seeds/mocks

**Source of truth:** routing table defined in `src/AppRoutes.tsx` (paths + RBAC) and `ProtectedRoute.tsx` (auth guard & role checks).

---

## Conventions

* **Runner:** Playwright Test (`@playwright/test`) – repo already configured to run from `e2e/tests` with `baseURL` and dev server (see `playwright.config.ts`).
* **Page Object Model:** one class per routed view; no cross‑page assertions. Page objects expose **intent‑level methods** (`loginAs`, `fillCheckoutAddress`, `filterByStatus`) and **readonly locators**.
* **Selectors:** prefer stable `data-testid` hooks already present across components; fall back to role/name semantics where appropriate.
* **Auth:** reuse existing `/login` UI flow for happy paths; for speedier non‑auth tests, seed token in `localStorage` and intercept `GET /users/me` (see `ProtectedRoute`) with fixtures.
* **RBAC:** assert redirects/unauthorised states via `ProtectedRoute` behaviour.
* **Files & names:**

  * Specs: `e2e/tests/<routeName>.ui.spec.ts`
  * Pages: `e2e/pages/<RouteName>Page.ts`
  * Shared utils: `e2e/support/*`
* **Tags:** `@smoke` (core journeys), `@regression`, `@admin`, `@a11y`, `@visual`

---

## Definition of Done (per view)

* ✅ Page object created and exported
* ✅ Happy path renders and primary actions work
* ✅ Auth / redirect semantics validated (401 → `/login`, missing role → `/`)
* ✅ Empty, partial, and error states covered (via API mocks)
* ✅ Critical forms validated (client‑side + server error surfacing)
* ✅ Navigation in/out of the view verified (breadcrumbs/links/back)
* ✅ A11y smoke: no `aria` regressions and no *obvious* axe violations (fast run)
* ✅ Visual checkpoint (optional, narrow scope to critical widgets)

---

## Environment & Runner Settings

* Dev server auto‑started by Playwright (`npm run dev`) on `http://localhost:8081` with `baseURL` set and traces/screenshots on retry.
* Single Chromium project by default; parallel friendly.

```ts
// see playwright.config.ts
{
  testDir: './e2e/tests',
  use: { baseURL: 'http://localhost:8081', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev', url: 'http://localhost:8081', reuseExistingServer: true }
}
```

---

## Routes Coverage Matrix

Tick ✅ when a spec + page object exist and pass with tags.

| Path                                | View Name                   | Access       | Spec | Page Object    | Tags   |
| ----------------------------------- | --------------------------- | ------------ | ---- | -------------- | ------ |
| `/login`                            | Login                       | Public       | \[ ] | \[ ]           | @smoke |
| `/register`                         | Register                    | Public       | \[ ] | \[ ]           |        |
| `/`                                 | Home                        | Auth         | \[ ] | \[ ]           | @smoke |
| `/products`                         | Products List               | Auth         | \[ ] | \[ ]           | @smoke |
| `/products/:id`                     | Product Details             | Auth         | \[ ] | \[ ]           |        |
| `/cart`                             | Cart                        | Auth         | \[ ] | \[ ]           | @smoke |
| `/checkout`                         | Checkout                    | Auth         | \[ ] | \[ ]           | @smoke |
| `/orders` → redirects to `/profile` | Orders (redirect)           | Auth         | \[ ] | (uses Profile) |        |
| `/orders/:id`                       | Order Details               | Auth         | \[ ] | \[ ]           |        |
| `/users`                            | Users List                  | Auth         | \[ ] | \[ ]           |        |
| `/users/:username/edit`             | Edit User                   | Auth         | \[ ] | \[ ]           |        |
| `/email`                            | Send Email                  | Auth         | \[ ] | \[ ]           |        |
| `/qr`                               | QR Generator                | Auth         | \[ ] | \[ ]           |        |
| `/llm`                              | LLM Playground              | Auth         | \[ ] | \[ ]           |        |
| `/profile`                          | Profile                     | Auth         | \[ ] | \[ ]           |        |
| `/admin`                            | Admin Dashboard             | Role `ADMIN` | \[ ] | \[ ]           | @admin |
| `/admin/products`                   | Admin Products              | Role `ADMIN` | \[ ] | \[ ]           | @admin |
| `/admin/products/new`               | Admin Product Form (create) | Role `ADMIN` | \[ ] | \[ ]           | @admin |
| `/admin/products/edit/:id`          | Admin Product Form (edit)   | Role `ADMIN` | \[ ] | \[ ]           | @admin |
| `/admin/orders`                     | Admin Orders                | Role `ADMIN` | \[ ] | \[ ]           | @admin |
| `/traffic`                          | Traffic Monitor             | Auth         | \[ ] | \[ ]           |        |

> Notes: The `Orders` list route is implemented as a redirect to `/profile`. Keep its coverage as an assertion in `profile.ui.spec.ts`.

---

## Shared Fixtures & Utilities

Create these once under `e2e/support` and import in specs:

* **`storageState.fixtures.ts`** – helpers to seed `localStorage.token` and mock `/users/me` with role payloads (`CLIENT` / `ADMIN`). Export `asClient(page)`, `asAdmin(page)`, `asAnonymous(page)`.
* **`apiMock.ts`** – thin MSW‑style or Playwright `route` helpers per resource (products, cart, orders, email, qr, llm, traffic). Provide `happy`, `empty`, `error` presets. Keep payloads aligned with the backend DTOs used in `src/lib/api.ts`.
* **`a11y.ts`** – fast Axe run (via `@axe-core/playwright`) with a minimal ruleset suitable for CI.
* **`testIds.ts`** – centralised map of important `data-testid` hooks to reduce typos.

---

## Page Objects (POM) — Contract

Each page object lives in `e2e/pages/` and:

* Exposes **locators** as readonly fields
* Exposes **high‑level actions** as methods
* Does **not** contain assertions other than small waits (assertions live in specs)
* Encapsulates URL navigation (`goto()`), including generating route params

**Template**

```ts
export class ProductsPage {
  constructor(private readonly page: Page) {}
  readonly heading = this.page.getByTestId('products-title');
  readonly firstCard = this.page.getByTestId('product-card').first();
  async goto() { await this.page.goto('/products'); }
  async openFirstProduct() { await this.firstCard.click(); }
}
```

---

## Scenario Catalogue (per view)

Below are concise scenarios to implement per spec. Reuse the same patterns (happy/empty/error/RBAC). Where a component has explicit `data-testid`s, assert them; otherwise use role‑based selectors.

### 1) `/login` — LoginPage

* Happy path: valid creds → token stored → redirected to `/`
* Invalid creds: server 422 → error toast/message
* Client validation: required fields, password min length
* Remembered redirect: visiting protected URL then logging in returns to that page

### 2) `/register` — RegisterPage

* Happy path: successful signup → either auto‑login or prompt to sign in
* Password policy/validation errors surfaced inline
* Duplicate username/email → server error toast

### 3) `/` — HomePage (protected)

* Redirect unauthenticated → `/login`
* Renders core widgets/cards for shortcuts (assert presence)
* Basic nav sanity (header links work)

### 4) `/products` — ProductsPage

* Happy path: list renders; clicking a card routes to details
* Empty state (no products) message
* Error state (API 500) shows retry affordance
* Perf smoke: initial list within threshold (soft assertion)

### 5) `/products/:id` — ProductDetailsPage

* Renders name, price, description and Add‑to‑Cart button
* 404 → friendly not‑found
* Error → toast and back link works

### 6) `/cart` — CartPage

* Contains items with quantity controls and summary totals
* Update quantity recalculates totals
* Remove item updates state; removing last item shows empty state
* "Checkout" button navigates to `/checkout`

### 7) `/checkout` — CheckoutPage + CheckoutForm

* Form validation for address fields (zip, street, city)
* Happy path: submits and navigates to order confirmation (or profile/orders)
* Error path: empty cart → disabled submit / server error message

### 8) `/orders` (redirect) & `/profile` — ProfilePage

* Visiting `/orders` redirects to `/profile`
* Profile shows user orders list with statuses
* Clicking an order navigates to `/orders/:id`

### 9) `/orders/:id` — OrderDetailsPage

* Renders order metadata, line items, totals, status
* Cancel action available in allowed states; state transition reflected
* 404/forbidden (non‑owner) → friendly message or redirect

### 10) `/users` — UsersPage

* List renders for authenticated user (likely admin features appear conditionally)
* Selecting a user navigates to `/users/:username/edit`

### 11) `/users/:username/edit` — EditUserPage + UserEditForm

* Form prefilled with user data; client validation (email, roles)
* Save shows success toast and persists changes
* Forbidden for non‑admin (if enforced) → redirect/home

### 12) `/email` — EmailPage + EmailForm

* Form validation for recipient, subject, body
* Happy path: success toast
* Server error surfaces toast and keeps content

### 13) `/qr` — QrCodePage + QrCodeGenerator

* Enter text generates PNG preview; download action present
* Invalid/empty input disabled state

### 14) `/llm` — LlmPage

* Prompt sends request; streaming/response area updates
* Model not found / server error shows error UI

### 15) `/admin` — AdminDashboardPage + AdminDashboard

* RBAC: non‑admin redirected to `/`
* Metrics cards render numbers consistent with mocked data
* Low stock list, recent orders table populated; links navigate to details/edit

### 16) `/admin/products` — AdminProductsPage + AdminProductList

* Table renders; Add New navigates to `/admin/products/new`
* Delete flow: confirm → removes row; error path shows alert/toast
* Empty state card with CTA

### 17) `/admin/products/new` — AdminProductFormPage (create)

* Validation: name ≥3, price numeric, stock ≥0
* Successful create → navigate back to list with new row visible

### 18) `/admin/products/edit/:id` — AdminProductFormPage (edit)

* Form prefilled; update persists; 404 for missing id → not‑found

### 19) `/admin/orders` — AdminOrdersPage + AdminOrderList

* Filter by status updates table; pagination works (prev/next enabled state)
* Row → “View Details” navigates to `/orders/:id`
* Error state card when API fails

### 20) `/traffic` — TrafficMonitorPage

* Renders traffic info (mock REST) and any live widget (mock WebSocket/SSE if applicable)
* Error state visible when feed unavailable

---

## Cross‑Cutting Checks

* **ProtectedRoute semantics**:

  * No token → redirect to `/login`
  * Token but missing required role → redirect to `/`
  * Loading state visible while `me` request pending
* **Navigation bar**: visible on authenticated views; links route correctly
* **Toasts**: success and error toasts appear/disappear (use `ToastProvider` timings)
* **Data formatting**: currency, dates in tables/cards (Admin dashboard, orders) match expectations
* **Empty states**: explicit asserts for zero‑item lists (products, orders, low stock)

---

## File Layout (scaffold)

```
/e2e/
  pages/
    LoginPage.ts                 ✅ (existing)
    RegisterPage.ts              ✅ (existing)
    HomePage.ts
    ProductsPage.ts
    ProductDetailsPage.ts
    CartPage.ts
    CheckoutPage.ts
    ProfilePage.ts
    OrderDetailsPage.ts
    UsersPage.ts
    EditUserPage.ts
    EmailPage.ts
    QrPage.ts
    LlmPage.ts
    AdminDashboardPage.ts
    AdminProductsPage.ts
    AdminProductFormPage.ts
    AdminOrdersPage.ts
    TrafficPage.ts

  tests/
    login.ui.spec.ts             ✅ (existing)
    register.ui.spec.ts          ✅ (existing)
    home.ui.spec.ts
    products.ui.spec.ts
    productDetails.ui.spec.ts
    cart.ui.spec.ts
    checkout.ui.spec.ts
    profile.ui.spec.ts
    orderDetails.ui.spec.ts
    users.ui.spec.ts
    editUser.ui.spec.ts
    email.ui.spec.ts
    qr.ui.spec.ts
    llm.ui.spec.ts
    adminDashboard.ui.spec.ts
    adminProducts.ui.spec.ts
    adminProductForm.create.ui.spec.ts
    adminProductForm.edit.ui.spec.ts
    adminOrders.ui.spec.ts
    traffic.ui.spec.ts

  support/
    storageState.fixtures.ts
    apiMock.ts
    a11y.ts
    testIds.ts
```

---

## Mocking Strategy

* Use `page.route` to intercept calls made via `src/lib/api.ts` (Axios). Provide canned JSON per scenario.
* For lists with paging, include realistic `totalPages`, `content` shape so paginator logic is covered.
* For SSE/streaming (LLM), push a small deterministic sequence of chunks before closing.
* For QR (binary), return a small valid PNG buffer (fixture file) to test `image/png` handling.

---

## Accessibility & Visuals

* **A11y smoke**: run Axe in each spec after main render; allowlist a minimal ruleset; fail only on serious violations.
* **Visual snapshots** (optional): capture only the primary widget on each view to avoid flakiness (e.g. products grid, admin orders table). Gate behind `VISUAL=true` env to keep CI lean.

---

## Execution, Tags & CI

* Mark core shopper journey as `@smoke`:

  1. Login → Products → Product Details → Add to Cart → Cart → Checkout → Confirmation/Profile
* Run `@smoke` on every push; full `@regression` nightly. `@admin` suite behind feature flag or admin seed.
* Keep Playwright’s HTML report and traces; publish on CI.

---

## Acceptance Checklist (copy into each spec)

* ✅ Page object created and imported
* ✅ Happy path passes
* ✅ Error/empty states verified via mocks
* ✅ Auth/RBAC semantics validated
* ✅ A11y smoke run
* ✅ (Optional) Visual snapshot updated

---

## Notes & Gotchas

* **Auth Guard:** All protected routes rely on `ProtectedRoute`. When mocking `GET /users/me`, return roles as either strings (`ROLE_ADMIN`) or objects with `{ authority }`, matching the component’s dual handling.
* **Redirects:** `/orders` is implemented as redirect to `/profile`; assert this in `profile.ui.spec.ts`.
* **Data‑testids:** Admin dashboard, product/admin tables, and loaders expose rich `data-testid` hooks. Prefer them over CSS.
* **Time/locale:** Date rendering uses `toLocaleDateString()`; stabilise with a fixed timezone/locale when snapshotting.

---

## Roadmap / Progress

Start by finalising the two existing specs (`/login`, `/register`), then implement `@smoke` shopper flow end‑to‑end. Follow with admin screens and long‑tail views.

* Week 1: shopper flow + products/cart/checkout/profile
* Week 2: orders details + users + email/qr/llm
* Week 3: admin (dashboard, products, orders) + traffic

---

*Happy to auto‑scaffold the files above based on this plan if needed.*

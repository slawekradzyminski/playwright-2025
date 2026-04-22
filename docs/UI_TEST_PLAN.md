# UI Test Plan — Frontend Screens

**Last Updated:** 2026-04-22  
**Project:** `slawekradzyminski/playwright-2025` — Frontend screen coverage for `../vite-react-frontend`  
**Sources Analysed:**
- `../vite-react-frontend/src/AppRoutes.tsx` — route inventory and protection model
- `../vite-react-frontend/src/pages/` — route-backed screens
- `../vite-react-frontend/src/components/` — screen-level child components that own loading, empty, error, or permission states
- `tests/ui/` and `tests/ui/admin/` — current Playwright UI coverage and naming patterns
- Playwright CLI runtime pass against `http://localhost:8081` — anonymous, client, and admin sessions, including a live cart → checkout → order flow

**How to use this document:**
1. Use this document as the screen inventory and UI coverage source of truth.
2. Use [`UI_TESTS_PHASES.md`](./UI_TESTS_PHASES.md) to decide what to implement next and what can run in parallel.
3. Use the **Coverage Summary** table for a quick health check.
4. Use the **Screen Inventory** tables to track per-screen progress.
5. When you add a test, update `Coverage` and `Test File(s)` for the affected screen.
6. When the frontend adds a new route-backed screen, append a row, then add it to the appropriate phase document.
7. Recalculate coverage percentages using the rules in the **Maintenance** section.

**Companion documents:**

| Document | Purpose |
|----------|---------|
| [`UI_TEST_PLAN.md`](./UI_TEST_PLAN.md) | Screen inventory, current coverage, runtime findings, and maintenance rules |
| [`UI_TESTS_PHASES.md`](./UI_TESTS_PHASES.md) | Execution order, dependencies, parallelization rules, and next-step selection |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done — primary path plus meaningful state/negative/access coverage present |
| 🟡 | In Progress / Partial |
| ⬜ | To Do — no meaningful automated screen coverage |
| 🌐 | Public |
| 🔒 | Authenticated |
| 🛡️ | Admin or role-sensitive |
| 🔥 | High Priority |
| ⚙️ | Medium Priority |
| 🟢 | Low Priority |

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| **Total counted screens** | 25 |
| **Covered** | 9 |
| **Partial** | 1 |
| **Not covered** | 15 |
| **Overall screen coverage %** | **36.0%** |
| **Runtime-verified screens** | 25 (100.0%) |
| **Public screens total** | 5 |
| **Public screens covered** | 2 (40.0%) |
| **Role-sensitive screens total** | 5 |
| **Role-sensitive screens covered** | 2 (40.0%) |
| **High-priority screens** | 12 |
| **High-priority screens fully covered** | 9 (75.0%) |

---

## Scope and Goals

**Scope**
- Route-backed full-screen experiences in `../vite-react-frontend`
- Important route-level variants such as empty, loading, error, permission-denied, create/edit, and redirect states
- Admin and non-admin behavior when the same route behaves differently by role

**Goals**
- Keep screen coverage measurable and easy to maintain
- Prioritize user-visible business flows before low-risk utility surfaces
- Preserve traceability from each counted screen to a primary Playwright UI spec file

**Relevant UI test types**
- Route smoke and redirect tests
- Screen-state coverage for loading, empty, error, success, and denied states
- Form validation and submit feedback
- Cross-screen business flows such as products → cart → checkout → order details
- Environment-dependent integration checks for WebSocket, SSE, and SSO screens

---

## Coverage Model

### What counts as a screen
- A route-backed full-page experience with its own URL and distinct testing intent
- A route variant with materially different behavior may stay as one counted screen when the same component owns both modes (for example `Admin Product Form` create and edit)

### What does **not** count as a separate screen
- Shared layout, header, footer, and reusable UI components
- Modal, drawer, wizard, or tab surfaces when they do not exist as route-backed experiences
- Pure redirects such as `/orders`, which currently resolves to `/profile`
- Unknown-route / not-found handling, because the frontend does not currently define a wildcard screen

### What counts as **Covered**
- Automated UI tests prove the primary path for the screen, and
- At least one meaningful state group is also covered: validation, permission/redirect, empty/error, or a key interaction state

### Binary vs. state-based treatment
- **Primary metric:** binary screen coverage (`Covered`, `Partial`, `None`)
- **Secondary planning lens:** key state coverage tracked in the `Notes` column and phase increments
- A screen can be counted as **Partial** even when the route is runtime-verified, if automation only touches the happy path or reaches the screen indirectly

### Treatment of route variants, redirects, and nested content
- `/admin/products/new` and `/admin/products/edit/:id` are one counted screen with required create/edit state coverage
- `/orders/:id` is one counted screen even though admin and client users see different actions
- `/profile` includes the embedded order list; the `/orders` route alias is not counted separately
- Direct routes that require data context remain counted screens if the route is real and stable (for example `/products/:id`, `/checkout`, `/orders/:id`)

### Traceability
- Each counted screen should map to one primary file in `tests/ui/` or `tests/ui/admin/`
- Temporary shared coverage is allowed, but the long-term target is one screen per spec file, consistent with the repository UI testing rules

### Suggested maintenance metrics
- `screen coverage % = covered_screens / total_counted_screens * 100`
- `high-priority screen coverage % = covered_high_priority_screens / total_high_priority_screens * 100`
- Optional secondary metric: `screen-state coverage % = covered_key_states / planned_key_states * 100` for a phase or feature group

---

## Screen Inventory

> Sorted by feature group. `Reachability` reflects how the screen is normally entered, not only whether the URL exists. Every counted screen below was found in code and reached at runtime unless the `Runtime` note says otherwise.

### Auth

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ⬜ | Forgot Password | `/forgot-password` | 🌐 | Direct URL or login link | Runtime-verified | None | — | ⚙️ Medium | States: validation, neutral success, local token visibility, API error |
| ✅ | Login | `/login` | 🌐 | Direct URL or nav from register/forgot/reset | Runtime-verified | Covered | `tests/ui/login.ui.spec.ts` | 🔥 High | States: validation, invalid credentials, SSO button visibility, loading |
| ✅ | Register | `/register` | 🌐 | Direct URL or nav from login | Runtime-verified | Covered | `tests/ui/register.ui.spec.ts` | 🔥 High | States: validation, duplicate username, success redirect |
| ⬜ | Reset Password | `/reset` | 🌐 | Direct URL with token query or email link | Runtime-verified | None | — | ⚙️ Medium | States: token prefill, validation, success redirect, invalid token |
| ⬜ | SSO Callback | `/auth/sso/callback` | 🌐 | Identity-provider redirect in normal flow | Runtime-verified (error state only) | None | — | 🟢 Low | Direct visit showed `Missing SSO authorization code`; success path still needs an IdP-backed run |

### Dashboard

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| 🟡 | Home | `/` | 🔒 | Direct URL after auth | Runtime-verified | Partial | `tests/ui/home.ui.spec.ts` | 🔥 High | States: authenticated landing, CTA navigation, anonymous redirect handled by `ProtectedRoute` |

### Catalog

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ✅ | Product Details | `/products/:id` | 🔒 | Direct URL with product id or product card click | Runtime-verified | Covered | `tests/ui/product-details.ui.spec.ts`, `tests/ui/products.ui.spec.ts` | 🔥 High | States: direct route, not found, no image, out-of-stock, in-cart quantity, update/remove cart |
| ✅ | Products Catalog | `/products` | 🔒 | Direct URL after auth; home/header nav | Runtime-verified | Covered | `tests/ui/products.ui.spec.ts` | 🔥 High | States: loading, error, filter, search, sort, card-level cart actions |

### Commerce

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ✅ | Cart | `/cart` | 🔒 | Direct URL after auth; header cart; product/cart flows | Runtime-verified | Covered | `tests/ui/cart.ui.spec.ts` | 🔥 High | States: empty, populated, retry/error, update, remove, clear, CTA to checkout |
| ✅ | Checkout | `/checkout` | 🔒 | Direct URL with cart state; cart CTA | Runtime-verified | Covered | `tests/ui/checkout.ui.spec.ts` | 🔥 High | States: empty-cart redirect, validation, successful order placement |
| ✅ | Order Details | `/orders/:id` | 🔒 / 🛡️ | Direct URL with order id; post-checkout redirect; admin order list | Runtime-verified | Covered | `tests/ui/order-details.ui.spec.ts` | 🔥 High | Client lane covers not found, pending details, and cancel; admin controls live inside the same screen |

### Account

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ⬜ | Profile | `/profile` | 🔒 | Direct URL after auth; home/header nav; `/orders` redirect | Runtime-verified | None | — | 🔥 High | Includes personal info, prompt editors, and embedded order-list states |

### Users

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ⬜ | Edit User | `/users/:username/edit` | 🛡️ (component-level) | Direct URL with username; users list action | Runtime-verified | None | — | ⚙️ Medium | Non-admin access-denied state and admin edit form were both runtime-verified |
| ⬜ | Users | `/users` | 🔒 | Direct URL after auth; home entry point | Runtime-verified | None | — | ⚙️ Medium | Admin-labelled screen is reachable by non-admin users because the router does not role-gate it |

### Utilities

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ⬜ | QR Code Generator | `/qr` | 🔒 | Direct URL after auth; home/header nav | Runtime-verified | None | — | 🟢 Low | States: empty-input error, generating, result visible, clear |
| ⬜ | Send Email | `/email` | 🔒 | Direct URL after auth; home/header nav | Runtime-verified | None | — | ⚙️ Medium | States: validation, success toast, backend error; recipient datalist depends on users query |

### Observability

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ⬜ | Traffic Monitor | `/traffic` | 🔒 | Direct URL after auth; home/header nav | Runtime-verified | None | — | ⚙️ Medium | Loading, empty, and connected states observed; live event assertions still missing |

### AI Workspace

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ⬜ | LLM Chat | `/llm/chat` | 🔒 | Direct URL or LLM overview card | Runtime-verified | None | — | ⚙️ Medium | Base route verified; message exchange and stream states not yet automated |
| ⬜ | LLM Chat + Tools | `/llm/tools` | 🔒 | Direct URL or LLM overview card | Runtime-verified | None | — | ⚙️ Medium | Base route verified; tool execution and stream states not yet automated |
| ⬜ | LLM Generate | `/llm/generate` | 🔒 | Direct URL or LLM overview card | Runtime-verified | None | — | ⚙️ Medium | Base route verified; streamed response and thinking states not yet automated |
| ⬜ | LLM Overview | `/llm` | 🔒 | Direct URL after auth; home/header nav | Runtime-verified | None | — | ⚙️ Medium | Entry screen for the three AI mode routes |

### Admin

| Status | Screen | Route | Access | Reachability | Runtime | Coverage | Test File(s) | Priority | Notes |
|--------|--------|-------|--------|--------------|---------|----------|-------------|----------|-------|
| ⬜ | Admin Dashboard | `/admin` | 🛡️ | Direct URL after admin auth; admin nav | Runtime-verified | None | — | ⚙️ Medium | Metrics visible at runtime; zero-state and richer data assertions still missing |
| ⬜ | Admin Orders List | `/admin/orders` | 🛡️ | Direct URL after admin auth; dashboard/nav | Runtime-verified | None | — | 🔥 High | States: loading, empty, filter, pagination, deep-link to order details |
| ✅ | Admin Product Form | `/admin/products/new` and `/admin/products/edit/:id` | 🛡️ | Direct URL after admin auth; products list/dashboard actions | Runtime-verified | Covered | `tests/ui/admin/product.form.admin.ui.spec.ts` | 🔥 High | Treat create and edit as one counted screen with required mode coverage |
| ✅ | Admin Products List | `/admin/products` | 🛡️ | Direct URL after admin auth; dashboard/nav | Runtime-verified | Covered | `tests/ui/admin/access.admin.ui.spec.ts`, `tests/ui/admin/products.list.admin.ui.spec.ts` | 🔥 High | Non-admin redirect, display, cancel delete, and delete paths already covered |

---

## Access Split

### 🌐 Public Screens (5 total, 2 covered — 40.0%)
- `Login` ✅
- `Register` ✅
- `Forgot Password`
- `Reset Password`
- `SSO Callback`

### 🔒 Authenticated User Screens (15 total, 5 covered — 33.3%, 1 partial)
- `Home` 🟡
- `Products Catalog` ✅
- `Product Details` ✅
- `Profile`
- `Users`
- `Send Email`
- `QR Code Generator`
- `LLM Overview`
- `LLM Generate`
- `LLM Chat`
- `LLM Chat + Tools`
- `Cart` ✅
- `Checkout` ✅
- `Order Details` ✅
- `Traffic Monitor`

### 🛡️ Admin / Role-Sensitive Screens (5 total, 2 covered — 40.0%)
- `Edit User`
- `Admin Dashboard`
- `Admin Products List` ✅
- `Admin Product Form` ✅
- `Admin Orders List`

---

## Coverage Assessment

| Screen | Coverage Level | Rationale |
|--------|----------------|-----------|
| `Login` | **Covered** | Happy path, validation, invalid credentials, and navigation are already automated |
| `Register` | **Covered** | Happy path, validation, and navigation are automated |
| `Home` | **Partial** | Smoke coverage exists, but screen-specific CTA behavior and negative states are not tracked yet |
| `Products Catalog` | **Covered** | Listing, filter, search, sort, and card-level cart interactions are automated |
| `Product Details` | **Covered** | Dedicated spec covers direct route, not found, no-image, out-of-stock, and in-cart update/remove states |
| `Cart` | **Covered** | Dedicated spec covers empty, populated, retry/error, update, remove, clear, and checkout CTA states |
| `Checkout` | **Covered** | Dedicated spec covers empty-cart redirect, validation, and successful order placement |
| `Order Details` | **Covered** | Client-lane spec covers not found, pending order details, and cancel; admin status controls remain planned under Phase 4B |
| `Profile` | **None** | No UI automation currently covers profile forms, prompt editors, or embedded order-list states |
| `Users` | **None** | No UI automation currently covers the list, permission behavior, or destructive controls |
| `Edit User` | **None** | Runtime-verified denied/admin states, but no automated form coverage exists |
| `Send Email` | **None** | No screen-level automation for validation, success, or backend-error feedback |
| `QR Code Generator` | **None** | No UI automation for generator interaction or result rendering |
| `Traffic Monitor` | **None** | Runtime-verified WebSocket connection, but live event assertions are still missing |
| `Admin Dashboard` | **None** | No automated admin dashboard smoke or zero/rich-data assertions |
| `Admin Products List` | **Covered** | Positive admin flow plus non-admin redirect and delete paths are automated |
| `Admin Product Form` | **Covered** | Create, required validation, edit preload, and update paths are automated |
| `Admin Orders List` | **None** | No UI automation for filter, pagination, or order deep-link behavior |
| `Forgot Password` | **None** | No screen-level automation for request flow or local token exposure |
| `Reset Password` | **None** | No screen-level automation for token-prefill or reset outcomes |
| `SSO Callback` | **None** | Only runtime error state was observed; no automated provider-backed flow exists |
| `LLM Overview` | **None** | No automation for the AI landing screen or route-card behavior |
| `LLM Generate` | **None** | No UI automation for input, settings, or streamed response states |
| `LLM Chat` | **None** | No UI automation for transcript growth, settings, or stream behavior |
| `LLM Chat + Tools` | **None** | No UI automation for tool sidebar, transcript, or grounded-response behavior |

---

## Phased Delivery Plan

Use [`UI_TESTS_PHASES.md`](./UI_TESTS_PHASES.md) as the detailed execution roadmap. It contains dependency gates, parallelization guidance, exit criteria, and the current recommended next increment.

This plan keeps only the high-level phase index so there is one source of truth for execution status.

| Phase | Focus | Parallelization Summary |
|-------|-------|-------------------------|
| Phase 1 | Auth entry and route smoke | Mostly parallel-safe |
| Phase 2A | Catalog browsing and product detail | Product list and product-detail work can split after shared page objects stay stable |
| Phase 2B | Admin product foundation | Complete; admin UI lane runs sequentially by config |
| Phase 3 | Cart, checkout, and order detail | Client-user coverage can split with self-owned users; admin order-detail actions stay isolated |
| Phase 4A | Account and user management | Mostly parallel-safe with self-owned user data |
| Phase 4B | Admin dashboard and order operations | Sequential in admin lane; depends on stable product/order flows |
| Phase 5 | Utilities, observability, and password recovery | Mostly parallel-safe except live traffic timing |
| Phase 6 | AI workspace and SSO-dependent flows | Environment-dependent and better isolated |

---

## Documentation / Code Discrepancy Notes

| Observation | Detail |
|-------------|--------|
| `/orders` is not a standalone screen | The router defines `/orders` as `<Navigate to="/profile" replace />`. Count order history under `Profile`, not as a separate screen. |
| No wildcard not-found screen exists | `AppRoutes.tsx` has no `*` route. Unknown-path behavior should not be tracked as a counted screen until the frontend adds one. |
| `Users` route is broader than its screen copy suggests | `/users` is wrapped only by `ProtectedRoute`, so any authenticated user can open it. Admin-only actions are hidden later inside the screen. |
| `Edit User` role check is component-level, not route-level | `/users/:username/edit` is also only behind `ProtectedRoute`. Non-admin users reach the route and then see an `Access denied` screen. |
| `SSO Callback` requires external state | Direct runtime access produced `Missing SSO authorization code`, which is expected without the upstream IdP redirect. |
| `Checkout` is context-bound | The route exists, but an empty cart immediately redirects back to `/cart`. Treat empty-cart redirect as part of the checkout screen coverage. |
| Phase 3 client flow isolation | `fixtures/authenticatedUiUserFixture.ts` creates a fresh signed-up user per test, and backend order creation only deletes that user's cart rows. That makes client cart/checkout/order-detail tests parallel-safe as long as each test seeds its own state. |

---

## Risks and Assumptions

| Type | Detail |
|------|--------|
| Risk | LLM screens depend on streaming backend behavior and should assert stream shape or rendered milestones, not brittle model text |
| Risk | Traffic Monitor depends on WebSocket timing; event assertions can become flaky if the suite generates unrelated traffic in parallel |
| Risk | Admin screens mutate shared data; they should stay in the admin lane and use self-owned data with fixture cleanup |
| Assumption | UI tests should keep following the repository rule of one primary screen per spec file going forward |
| Assumption | The public system entry point remains `http://localhost:8081`, consistent with `docs/ARCHITECTURE.md` |
| Assumption | Route-backed surfaces without a wildcard 404 handler remain the only counted screen scope for now |

---

## Maintenance

### Adding a new screen
1. Add a row to the correct **Screen Inventory** section.
2. Add it to the **Access Split** section under the right heading.
3. Add it to the appropriate phase in [`UI_TESTS_PHASES.md`](./UI_TESTS_PHASES.md) based on priority, dependencies, and environment risk.
4. Add or update the most relevant rationale in **Coverage Assessment**.
5. Recalculate the **Coverage Summary** table.

### Updating coverage after adding tests
1. Change the `Status` emoji from ⬜ to ✅ (or 🟡 if still partial).
2. Fill in `Test File(s)` with the relative path (for example `tests/ui/cart.ui.spec.ts`).
3. Update `Coverage` from `None` → `Partial` or `Covered`.
4. Update the matching increment status in [`UI_TESTS_PHASES.md`](./UI_TESTS_PHASES.md).
5. Recalculate coverage percentages:

```text
screen coverage % = covered_screens / total_counted_screens * 100
high-priority screen coverage % = covered_high_priority_screens / total_high_priority_screens * 100
public screen coverage % = covered_public_screens / total_public_screens * 100
role-sensitive screen coverage % = covered_role_sensitive_screens / total_role_sensitive_screens * 100
```

### Coverage rules (for consistency)
- **Covered** = primary path plus at least one meaningful state/permission/negative path is automated
- **Partial** = some automation exists, but important state groups or direct screen intent are still missing
- **None** = no meaningful automated UI coverage exists for the screen

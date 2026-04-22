# UI Tests Phases

**Last Updated:** 2026-04-22

**Purpose:** Use this file to decide the next UI screen test increment.

This is the execution companion to [`UI_TEST_PLAN.md`](./UI_TEST_PLAN.md). The plan file is the screen inventory and coverage source of truth. This file defines the order of work, dependencies, and which tracks can safely run in parallel.

## How to Pick the Next Task

1. Start at the first phase that is not complete.
2. Pick the first incomplete increment in that phase.
3. Only skip forward when the increment is marked as parallel-safe and its dependencies are complete.
4. After each increment, update:
   - this file: phase/increment status
   - [`UI_TEST_PLAN.md`](./UI_TEST_PLAN.md): screen inventory, coverage summary, and test file references
5. Always run the newly created UI tests, then `npm run test:ui`. For admin UI changes, also run `npm run test:ui:admin` or `npm run test:admin`.

## Dependency Map

```text
Phase 1: Auth entry and route smoke
  |
  +--> Phase 2A: Catalog browsing and product detail
  |       |
  |       +--> Phase 3: Cart, checkout, and order detail
  |
  +--> Phase 2B: Admin product foundation
  |       |
  |       +--> Phase 4B: Admin dashboard and order operations
  |
  +--> Phase 4A: Account and user management
  |
  +--> Phase 5: Utilities, observability, and password recovery

Phase 6: AI workspace and SSO happy-path coverage are last and environment-dependent.
```

## Parallelization Rules

| Work Area | Can Run in Parallel? | Why |
|-----------|----------------------|-----|
| Public auth screens | Yes | Login/register/forgot/reset do not share mutable user state when each test creates its own data |
| Product list and utilities | Yes | Separate feature areas and minimal shared mutation |
| Cart, checkout, and client order-detail screens | Yes with per-test users | `authenticatedUiUserFixture` signs up a fresh user per test, so cart state and created order IDs stay isolated by username |
| Profile and users management | Yes with care | Use self-owned users; avoid editing shared/static accounts |
| Admin product screens and admin order screens | No in practice | Admin UI specs already run sequentially in the admin lane and mutate shared data |
| Traffic monitor screens | Be careful | Live event assertions can be polluted by unrelated traffic |
| LLM and SSO flows | No by default | Streaming timing and external identity dependencies make them better as isolated slices |

## Phase 1 - Auth Entry and Route Smoke

**Goal:** Keep the public entry points and first authenticated landing routes stable.

**Parallel-safe:** Yes. These screens are mostly independent and already follow the normal client UI lane.

**Exit criteria:**
- Login and register remain stable with validation coverage.
- The authenticated landing path is proven.
- Public route ownership is clear in `UI_TEST_PLAN.md`.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ✅ | Login screen | `Login` | Covered valid sign-in, validation, invalid credentials, and navigation |
| ✅ | Register screen | `Register` | Covered registration, validation, and navigation |
| ✅ | Authenticated landing smoke | `Home` | Existing smoke coverage proves the first authenticated landing path |

## Phase 2A - Catalog Browsing and Product Detail

**Goal:** Cover the customer-facing catalog surface before cart and checkout work.

**Parallel-safe:** Partially. Product-list and product-detail work can split if shared page object helpers stay stable.

**Dependencies:** Phase 1 complete.

**Exit criteria:**
- Product list behaviors are covered.
- Product detail has a dedicated spec file, not only indirect assertions from the catalog spec.
- Product detail route-specific states are covered.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ✅ | Products catalog | `Products Catalog` | Covered listing, filter, search, sort, and card-level cart interactions |
| ✅ | Product details | `Product Details` | Covered direct route, not found, no-image, out-of-stock, and in-cart update/remove states |

## Phase 2B - Admin Product Foundation

**Goal:** Keep core admin product operations cheap and consistent.

**Parallel-safe:** Yes with Phase 2A, but admin UI specs still execute sequentially in the admin lane.

**Dependencies:** Phase 1 complete.

**Exit criteria:**
- Non-admin redirect is covered.
- Admin product list and create/edit form are covered.
- Admin product tests use tracked self-owned data only.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ✅ | Admin access redirect | `Admin Products List` access control | `tests/ui/admin/access.admin.ui.spec.ts` covers client redirect away from admin routes |
| ✅ | Admin products list | `Admin Products List` | Covered display, delete cancel, and delete success |
| ✅ | Admin product form | `Admin Product Form` | Covered create, validation, edit preload, and update |

## Phase 3 - Cart, Checkout, and Order Detail

**Goal:** Cover the main ecommerce journey after catalog coverage is stable.

**Parallel-safe:** Partially. Cart, checkout, and client-side order-detail coverage can run in parallel when each spec creates its own authenticated user and self-owned cart/order state. Keep admin-only order-detail actions isolated in the admin lane.

**Dependencies:** Phase 2A complete.

**Exit criteria:**
- Cart empty and populated states are covered.
- Checkout covers both empty-cart redirect and successful submission.
- Order details covers client and admin actions that matter to the UI.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ✅ | Cart screen | `Cart` | Covered empty, populated, retry/error, update/remove/clear, and CTA to checkout |
| ✅ | Checkout screen | `Checkout` | Covered empty-cart redirect, validation, and successful order placement |
| ✅ | Order details screen | `Order Details` | Covered not found, pending details, and client cancel; admin status controls can stay isolated in the admin lane |

## Phase 4A - Account and User Management

**Goal:** Cover the signed-in account workspace and the user-management routes.

**Parallel-safe:** Yes with self-owned users and isolated edits.

**Dependencies:** Phase 1 complete.

**Exit criteria:**
- Profile forms and embedded order-history states are covered.
- User list behavior is covered for both regular and admin users.
- Edit-user route covers access-denied and admin edit states.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ✅ | Profile workspace | `Profile` | `tests/ui/profile.ui.spec.ts` covers personal info save, prompt editors, empty order history, and populated pending-order state |
| ✅ | Users list | `Users` | `tests/ui/users.ui.spec.ts` and `tests/ui/admin/users.admin.ui.spec.ts` cover client reachability and admin row actions |
| ✅ | Edit user | `Edit User` | `tests/ui/edit-user.ui.spec.ts` and `tests/ui/admin/edit-user.admin.ui.spec.ts` cover access denied, validation, not found, preload, and save flow |

## Phase 4B - Admin Dashboard and Order Operations

**Goal:** Cover admin-only management views after the product foundation and order flow exist.

**Parallel-safe:** Limited. Admin specs still run sequentially, and richer order assertions depend on stable order data.

**Dependencies:** Phase 2B complete; `Admin Orders List` benefits from Phase 3 completion.

**Exit criteria:**
- Admin dashboard has at least smoke coverage and one meaningful state check.
- Admin order list covers filter/pagination behavior.
- Shared order-detail admin actions are covered from the UI.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ⬜ | Admin dashboard | `Admin Dashboard` | Cover metrics shell and zero/rich-data states |
| ⬜ | Admin orders list | `Admin Orders List` | Cover filter, pagination, and deep-link behavior |
| ⬜ | Admin order-detail actions | `Order Details` (admin state) | Shared screen; keep admin-only actions explicit in planning |

## Phase 5 - Utilities, Observability, and Password Recovery

**Goal:** Cover secondary but business-relevant utility screens and recovery flows.

**Parallel-safe:** Mostly yes. Traffic Monitor should stay isolated if assertions depend on live events.

**Dependencies:** Phase 1 complete.

**Exit criteria:**
- Password recovery screens cover validation and primary outcomes.
- Utility screens cover happy path plus at least one meaningful negative/error state.
- Traffic monitor has stable assertions that do not depend on unrelated suite traffic.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ⬜ | Forgot password | `Forgot Password` | Include neutral success and local token display assumptions |
| ⬜ | Reset password | `Reset Password` | Include token-prefill and invalid-token feedback |
| ⬜ | Send email | `Send Email` | Cover validation, success, and backend-error feedback |
| ⬜ | QR generator | `QR Code Generator` | Cover empty input, generation, and clear |
| ⬜ | Traffic monitor | `Traffic Monitor` | Cover connection state, empty state, and at least one live event row |

## Phase 6 - AI Workspace and External-Auth Flows

**Goal:** Cover screens whose stable assertions depend on streaming services or an external identity flow.

**Parallel-safe:** No by default. Treat these as isolated slices.

**Dependencies:** Core suite should already be stable.

**Exit criteria:**
- AI tests assert rendered milestones, stream shape, and operator controls rather than brittle model text.
- SSO callback coverage runs with a deterministic identity flow or a controlled fixture.
- Each spec explains the dependency clearly when the environment is unavailable.

| Status | Increment | Screens | Notes |
|--------|-----------|---------|-------|
| ⬜ | LLM overview | `LLM Overview` | Cover mode-card navigation and shell rendering |
| ⬜ | LLM generate | `LLM Generate` | Cover input, settings, generating, and rendered response states |
| ⬜ | LLM chat | `LLM Chat` | Cover transcript growth, settings, and streaming behavior |
| ⬜ | LLM chat + tools | `LLM Chat + Tools` | Cover tool-definition sidebar, transcript, and grounded result rendering |
| ⬜ | SSO callback happy path | `SSO Callback` | Runtime error state is known; happy path still needs IdP-backed coverage |

## Recommended Current Next Step

The next best increment is:

```text
Phase 4A - Profile workspace
Screen: Profile
New file: tests/ui/profile.ui.spec.ts
Reuse: authenticatedUiUserFixture, profile route runtime findings, and order setup helpers from Phase 3
```

Why this is next:
- Phases 1, 2A, 2B, and 3 are complete.
- Phase 4A is the first incomplete phase in dependency order.
- The profile screen is high priority and owns both account forms and embedded order-list states.

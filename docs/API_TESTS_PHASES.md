# API Tests Phases

**Last Updated:** 2026-04-22

**Purpose:** Use this file to decide the next API test increment.

This is the execution companion to [`API_TEST_PLAN.md`](./API_TEST_PLAN.md). The plan file is the endpoint inventory and coverage source of truth. This file defines the order of work, dependencies, and which tracks can safely run in parallel.

## How to Pick the Next Task

1. Start at the first phase that is not complete.
2. Pick the first incomplete increment in that phase.
3. Only skip forward when the increment is marked as parallel-safe and its dependencies are complete.
4. After each increment, update:
   - this file: phase/increment status
   - [`API_TEST_PLAN.md`](./API_TEST_PLAN.md): endpoint inventory, coverage summary, and test file references
5. Always run the newly created tests, then `npm run test:api`. For admin API changes, also run `npm run test:api:admin` or `npm run test:admin`.

## Dependency Map

```text
Phase 1: Support and low-risk endpoint coverage
  |
  +--> Phase 2A: Cart mutations
  |       |
  |       +--> Phase 3: User order lifecycle
  |               |
  |               +--> Phase 6: Order edge cases and status transitions
  |
  +--> Phase 2B: Admin test foundation
          |
          +--> Phase 4A: Product admin CRUD
          |
          +--> Phase 4B: User management permissions
          |
          +--> Phase 5: Email and password reset flows

Phase 7: SSO and Ollama streaming endpoints are last and environment-dependent.
```

## Parallelization Rules

| Work Area | Can Run in Parallel? | Why |
|-----------|----------------------|-----|
| Phase 1 low-risk endpoint files | Yes | Mostly independent read/write tests on user-owned fields or helper endpoints |
| Cart mutation endpoint files | Partially | `POST /cart/items` should be done first because PUT/DELETE need a reliable add-item helper |
| Cart and admin foundation | Yes | Different endpoint groups; no shared data dependency |
| Product admin CRUD and user management | Yes | Both depend on admin auth, but can use separate users/products; admin lanes run sequentially by config |
| Order lifecycle and product delete tests | Be careful | Product delete can conflict with products referenced by carts/orders; use created products only |
| Password reset and email tests | Yes after local outbox client exists | Both use local email outbox but can isolate by clearing outbox in `afterEach` |
| Rate-limit tests | No, run serially | Shared rate-limit buckets can make parallel tests flaky |
| Ollama streaming tests | No by default | External model availability and stream timing make these better as isolated tests |

## Phase 1 - Support and Low-Risk Coverage

**Goal:** Remove easy unknowns and create small helpers needed by later phases.

**Parallel-safe:** Yes. These increments can be split between people as long as they do not edit the same client/helper file at the same time.

**Exit criteria:**
- All listed endpoints have happy path plus key auth/validation negatives.
- Any helper clients introduced here follow the existing `httpclients/*Client.ts` pattern.
- `API_TEST_PLAN.md` coverage summary is recalculated.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ✅ | Refresh token tests | `POST /api/v1/users/refresh` | Covered valid rotation, missing token, invalid token, and reused rotated token |
| ✅ | Logout tests | `POST /api/v1/users/logout` | Covered logout, 401 cases, and refresh-token invalidation after logout |
| ✅ | Users list and own data reads | `GET /api/v1/users`, `GET /api/v1/users/me/email-events` | Covered authenticated contracts and 401 cases |
| ✅ | Prompt settings tests | `GET/PUT /api/v1/users/chat-system-prompt`, `GET/PUT /api/v1/users/tool-system-prompt` | Covered read/write, max-length validation, and 401 cases |
| ✅ | Local email outbox client/tests | `GET /api/v1/local/email/outbox`, `DELETE /api/v1/local/email/outbox` | Covered helper client and clear/read operations |
| ✅ | Ollama tool definitions contract | `GET /api/v1/ollama/chat/tools/definitions` | Covered static authenticated contract and 401 cases |

## Phase 2A - Cart Mutations

**Goal:** Complete cart state-changing coverage and unlock order creation tests.

**Parallel-safe:** Partially. Do `POST /api/v1/cart/items` first. After the add-item helper is stable, PUT and DELETE item tests can be done in parallel.

**Exit criteria:**
- Cart add, update, and remove are covered.
- Tests create and clean up their own cart state.
- A reusable helper exists for "given a cart with product X".

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ✅ | Add item to cart | `POST /api/v1/cart/items` | Covered add existing product, validation, 401 cases, and missing product |
| ✅ | Update cart item quantity | `PUT /api/v1/cart/items/{productId}` | Covered update, validation, 401 cases, and missing cart item |
| ✅ | Remove cart item | `DELETE /api/v1/cart/items/{productId}` | Covered remove, 401 cases, and missing cart item |

## Phase 2B - Admin Test Foundation

**Goal:** Make admin-only endpoint tests cheap and consistent.

**Parallel-safe:** Yes with Phase 2A. This is a separate track and does not require cart mutation coverage. Admin specs themselves run sequentially in the admin lane.

**Exit criteria:**
- There is a documented way to obtain an admin token.
- Admin and non-admin permission assertions are easy to reuse.
- At least one smoke test proves the admin fixture works.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ✅ | Admin auth fixture/helper | Shared setup | `fixtures/adminApiFixture.ts` provides admin login, client user setup, product client, created-product helper, and cleanup |
| ✅ | UI admin auth fixture | Shared setup | `fixtures/adminUiFixture.ts` injects admin auth into browser local storage via `helpers/browserAuthHelpers.ts` |
| ✅ | Admin lane configuration | Shared setup | `playwright.config.ts` runs regular client tests first, then `admin-api`, then `admin-ui`; `playwright.admin.config.ts` supports admin-only runs |

## Phase 3 - User Order Lifecycle

**Goal:** Cover the main ecommerce path for a regular authenticated user.

**Parallel-safe:** Mostly no. The first order creation tests should be done in one sequence because they depend on cart helpers and order IDs created during the tests.

**Dependencies:** Phase 2A complete.

**Exit criteria:**
- A user can create an order from a populated cart.
- User order list and order-by-id contracts are covered.
- Empty cart and unauthorized cases are covered.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ✅ | Create order from cart | `POST /api/v1/orders` | Covered populated cart happy path, cart consumption, empty cart negative, and 401 cases |
| ✅ | List current user's orders | `GET /api/v1/orders` | Covered page contract, seeded order presence, stable `status=PENDING` filter, and 401 cases |
| ✅ | Fetch order by ID | `GET /api/v1/orders/{id}` | Covered owner access, missing ID, and 401 cases |

## Phase 4A - Product Admin CRUD

**Goal:** Cover admin-only product management and permission boundaries.

**Parallel-safe:** Yes after Phase 2B. Can run in parallel with Phase 3 if tests use products created inside the product CRUD tests and avoid deleting seeded products.

**Dependencies:** Phase 2B complete.

**Exit criteria:**
- Admin create/update/delete paths are covered.
- Non-admin receives 403 for each admin-only mutation.
- Validation and missing-resource negatives are covered.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ✅ | Create product | `POST /api/v1/products` | Covered 201, 400 validation, 401, 403; tracks created product names for cleanup |
| ✅ | Update product | `PUT /api/v1/products/{id}` | Covered 200, 400 validation, 401, 403, 404 with self-created products |
| ✅ | Delete product | `DELETE /api/v1/products/{id}` | Covered 204, 401, 403, 404; deletes only self-created products |

## Phase 4B - User Management Permissions

**Goal:** Cover owner/admin authorization rules for user mutation endpoints.

**Parallel-safe:** Yes after Phase 2B. Can run in parallel with product admin CRUD if each file creates its own users.

**Dependencies:** Phase 2B complete.

**Exit criteria:**
- Owner and admin permissions are tested.
- Cross-user 403 cases are tested.
- Tests avoid deleting shared/static users.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ⬜ | Update user | `PUT /api/v1/users/{username}` | Cover owner 200, admin 200, other user 403, validation, missing user |
| ⬜ | Delete user as admin | `DELETE /api/v1/users/{username}` | Create disposable user inside test setup |
| ⬜ | Right to be forgotten | `DELETE /api/v1/users/{username}/right-to-be-forgotten` | Cover owner, admin, and other-user denial |

## Phase 5 - Email and Password Reset

**Goal:** Cover email-producing flows using local outbox as the test oracle.

**Parallel-safe:** Yes for non-rate-limit tests after local outbox support exists. Rate-limit scenarios should be serial.

**Dependencies:** Phase 1 local email outbox increment complete.

**Exit criteria:**
- Outbox is cleared before/after tests.
- Forgot/reset flow is tested end to end.
- Rate-limit tests are isolated or marked serial.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ⬜ | Send arbitrary email | `POST /api/v1/email` | Verify queued email via local outbox |
| ⬜ | Forgot password | `POST /api/v1/users/password/forgot` | Valid and unknown identifier should not leak account existence |
| ⬜ | Reset password | `POST /api/v1/users/password/reset` | Extract reset token from outbox; cover invalid/reused token |
| ⬜ | Rate-limit cases | Password reset and email endpoints | Run serially to avoid shared bucket flakiness |

## Phase 6 - Order Admin and Business Rules

**Goal:** Cover order permission boundaries and state transitions.

**Parallel-safe:** Partially. Read-only admin listing can run independently after Phase 2B. Status/cancel transition tests should be written after the base order lifecycle is stable.

**Dependencies:** Phase 2B and Phase 3 complete.

**Exit criteria:**
- Admin can list and inspect relevant orders.
- Regular users cannot access another user's order.
- Invalid transitions return the expected 400-level response.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ⬜ | Admin order list | `GET /api/v1/orders/admin` | Can start after admin fixture exists, but richer assertions need seeded orders |
| ⬜ | Cross-user order access | `GET /api/v1/orders/{id}` | Requires orders for two distinct users |
| ⬜ | Cancel order | `POST /api/v1/orders/{id}/cancel` | Cover cancellable and non-cancellable states |
| ⬜ | Admin status update | `PUT /api/v1/orders/{id}/status` | Cover admin success, non-admin 403, invalid transition |

## Phase 7 - Environment-Dependent Endpoints

**Goal:** Cover flows that need external systems or special test fixtures.

**Parallel-safe:** No by default. Treat these as dedicated slices because failures may be environmental rather than product regressions.

**Dependencies:** Core suite should already be stable.

**Exit criteria:**
- Tests clearly skip or fail with actionable messages when dependencies are unavailable.
- Assertions verify stream/contract shape, not nondeterministic model text.

| Status | Increment | Endpoints | Notes |
|--------|-----------|-----------|-------|
| ⬜ | SSO exchange | `POST /api/v1/users/sso/exchange` | Needs configured identity provider or deterministic token fixture |
| ⬜ | Ollama generate stream | `POST /api/v1/ollama/generate` | Requires running Ollama and loaded model |
| ⬜ | Ollama chat stream | `POST /api/v1/ollama/chat` | Assert SSE shape and auth/rate-limit behavior |
| ⬜ | Ollama chat tools stream | `POST /api/v1/ollama/chat/tools` | Most complex AI flow; keep last |

## Recommended Current Next Step

The next best increment is:

```text
Phase 4B - Update user
Endpoint: PUT /api/v1/users/{username}
New file: tests/api/users/users.username.put.api.spec.ts
Reuse: fixtures/adminApiFixture.ts and existing user auth helpers
```

Why this is next:
- Phase 3 user order lifecycle is complete.
- Phase 4B is the next incomplete dependency-ready phase.
- It builds on the admin foundation that is already in place and unlocks the remaining user permission work.

Phase 2A, Phase 2B, Phase 3, and Phase 4A are complete. The next dependency-driven step is Phase 4B user management permissions.

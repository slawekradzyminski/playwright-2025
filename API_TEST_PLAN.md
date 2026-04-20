# API Test Plan — JWT Authentication API

**Last Updated:** 2026-04-20  
**Project:** `slawekradzyminski/playwright-2025` — JWT Authentication API (Spring Boot backend)  
**Sources Analysed:**
- `api-docs.json` — OpenAPI 3.1 spec (primary endpoint inventory)
- `../test-secure-backend/src/main/java/com/awesome/testing/` — backend controllers, security, services
- `tests/api/` — Playwright API test suite
- `httpclients/` — HTTP client wrappers

**How to use this document:**
1. Use the **Coverage Summary** table for a quick health check.
2. Use the **Endpoint Inventory** table to track per-endpoint progress.
3. When you add a test, update `Current Coverage` and `Existing Test File(s)` in the table.
4. When you add a new endpoint, append a row, then add it to the appropriate Auth section and Phase.
5. Recalculate coverage percentages using the rules in the **Maintenance** section.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done — happy path + key negatives covered |
| 🟡 | In Progress |
| ⬜ | To Do — no meaningful automated test |
| ⚠️ | Blocked / Needs Clarification |
| 🔒 | Requires Auth |
| 🌐 | No Auth Required |
| 🔥 | High Complexity |
| ⚙️ | Medium Complexity |
| 🟢 | Low Complexity |

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| **Total endpoints** | 43 |
| **Covered** (happy path + key negatives) | 8 |
| **Partial** (some scenarios missing) | 0 |
| **Not covered** | 35 |
| **Overall coverage %** | **18.6%** |
| **Auth endpoints total** | 33 |
| **Auth endpoints covered** | 3 (9.1%) |
| **Non-auth endpoints total** | 10 |
| **Non-auth endpoints covered** | 5 (50.0%) |
| **High-complexity endpoints** | 7 |
| **Admin-only endpoints** | 7 |
| **Rate-limited endpoints** | 4 |

---

## Endpoint Inventory

> Sorted by feature group, then method. Auth column reflects the `WebSecurityConfig` `ALLOWED_ENDPOINTS` list combined with `@PreAuthorize` annotations in each controller.

### Users

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | POST | `/api/v1/users/signin` | 🌐 | — | Covered | `login.api.spec.ts` | 🟢 Low | High | Validation + 422 tested |
| ✅ | POST | `/api/v1/users/signup` | 🌐 | — | Covered | `signup.api.spec.ts` | 🟢 Low | High | Validation + duplicate tested |
| ✅ | GET | `/api/v1/users/me` | 🔒 | any | Covered | `users.me.get.api.spec.ts` | 🟢 Low | High | 200 + 401 tested |
| ⬜ | POST | `/api/v1/users/refresh` | 🌐 | — | None | — | 🟢 Low | High | Refresh JWT; test expired/invalid tokens |
| ⬜ | POST | `/api/v1/users/logout` | 🔒 | any | None | — | 🟢 Low | Medium | Token invalidation |
| ⬜ | GET | `/api/v1/users` | 🔒 | any | None | — | 🟢 Low | Medium | Returns all users; no role restriction in code |
| ⬜ | GET | `/api/v1/users/{username}` | 🔒 | any | None | — | 🟢 Low | Medium | 404 for missing user |
| ⬜ | PUT | `/api/v1/users/{username}` | 🔒 | ADMIN or owner | None | — | ⚙️ Medium | Medium | `@PreAuthorize` checks self or admin; 403 cases |
| ⬜ | DELETE | `/api/v1/users/{username}` | 🔒 | ADMIN | None | — | ⚙️ Medium | Low | Admin-only; 403 + 404 cases |
| ⬜ | DELETE | `/api/v1/users/{username}/right-to-be-forgotten` | 🔒 | ADMIN or owner | None | — | ⚙️ Medium | Medium | Cascading data deletion; owner or admin |
| ⬜ | GET | `/api/v1/users/me/email-events` | 🔒 | any | None | — | 🟢 Low | Medium | User's own email events |
| ⬜ | GET | `/api/v1/users/chat-system-prompt` | 🔒 | any | None | — | 🟢 Low | Low | Per-user AI prompt |
| ⬜ | PUT | `/api/v1/users/chat-system-prompt` | 🔒 | any | None | — | 🟢 Low | Low | Update AI prompt; validate body |
| ⬜ | GET | `/api/v1/users/tool-system-prompt` | 🔒 | any | None | — | 🟢 Low | Low | Per-user tool prompt |
| ⬜ | PUT | `/api/v1/users/tool-system-prompt` | 🔒 | any | None | — | 🟢 Low | Low | Update tool prompt; validate body |

### Password Reset

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | POST | `/api/v1/users/password/forgot` | 🌐 | — | None | — | ⚙️ Medium | High | Rate-limited (429); email sent via JMS; use local outbox |
| ⬜ | POST | `/api/v1/users/password/reset` | 🌐 | — | None | — | ⚙️ Medium | High | Rate-limited (429); requires token from forgot flow; stateful |

### Products

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | GET | `/api/v1/products` | 🔒 | any | Covered | `products.get.api.spec.ts` | 🟢 Low | High | 200 + 401 tested; response contract validated |
| ⬜ | GET | `/api/v1/products/{id}` | 🔒 | any | None | — | 🟢 Low | High | 200 + 404; contract check |
| ⬜ | POST | `/api/v1/products` | 🔒 | ADMIN | None | — | ⚙️ Medium | Medium | Admin-only; validation; 400 + 403 cases |
| ⬜ | PUT | `/api/v1/products/{id}` | 🔒 | ADMIN | None | — | ⚙️ Medium | Medium | Admin-only; 400 + 403 + 404 cases |
| ⬜ | DELETE | `/api/v1/products/{id}` | 🔒 | ADMIN | None | — | ⚙️ Medium | Low | Admin-only; 404 + 403 cases |

### Orders

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | POST | `/api/v1/orders` | 🔒 | any | None | — | 🔥 High | High | Creates order from cart; cart must be populated first; empty cart → 400 |
| ⬜ | GET | `/api/v1/orders` | 🔒 | any | None | — | ⚙️ Medium | High | Paginated; filter by status; user-scoped |
| ⬜ | GET | `/api/v1/orders/{id}` | 🔒 | any or ADMIN | None | — | ⚙️ Medium | High | Admin sees any order; user sees own only |
| ⬜ | POST | `/api/v1/orders/{id}/cancel` | 🔒 | any or ADMIN | None | — | ⚙️ Medium | Medium | Business rule: only cancellable statuses; 400 on invalid |
| ⬜ | PUT | `/api/v1/orders/{id}/status` | 🔒 | ADMIN | None | — | ⚙️ Medium | Medium | Admin-only status transition; invalid transition → 400 |
| ⬜ | GET | `/api/v1/orders/admin` | 🔒 | ADMIN | None | — | ⚙️ Medium | Medium | Admin-only; paginated; filter by status |

### Cart

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | GET | `/api/v1/cart` | 🔒 | any | None | — | 🟢 Low | High | Returns current user cart |
| ⬜ | DELETE | `/api/v1/cart` | 🔒 | any | None | — | 🟢 Low | Medium | Clears entire cart |
| ⬜ | POST | `/api/v1/cart/items` | 🔒 | any | None | — | ⚙️ Medium | High | Add item; 404 if product missing; validation |
| ⬜ | PUT | `/api/v1/cart/items/{productId}` | 🔒 | any | None | — | ⚙️ Medium | Medium | Update quantity; 404 if item not in cart |
| ⬜ | DELETE | `/api/v1/cart/items/{productId}` | 🔒 | any | None | — | ⚙️ Medium | Medium | Remove item; 404 if not in cart |

### QR

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | POST | `/api/v1/qr/create` | 🔒 | any | Covered | `qr.create.api.spec.ts` | 🟢 Low | Medium | PNG binary response + 400 + 401 tested |

### Ollama / AI

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | POST | `/api/v1/ollama/generate` | 🔒 | any | None | — | 🔥 High | Low | SSE streaming; rate-limited; requires running Ollama |
| ⬜ | POST | `/api/v1/ollama/chat` | 🔒 | any | None | — | 🔥 High | Low | SSE streaming; injects user chat system prompt; rate-limited |
| ⬜ | POST | `/api/v1/ollama/chat/tools` | 🔒 | any | None | — | 🔥 High | Low | SSE + function calling; complex branching logic |
| ⬜ | GET | `/api/v1/ollama/chat/tools/definitions` | 🔒 | any | None | — | 🟢 Low | Low | Returns static tool definitions; easy contract test |

### Email

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | POST | `/api/v1/email` | 🔒 | any | None | — | ⚙️ Medium | Medium | Rate-limited (429); async JMS dispatch; validate with local outbox |

### Traffic Monitoring

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | GET | `/api/v1/traffic/info` | 🌐 | — | Covered | `traffic/traffic.info.api.spec.ts` | 🟢 Low | Low | Contract tested |
| ✅ | GET | `/api/v1/traffic/logs` | 🌐 | — | Covered | `traffic/traffic.log.api.spec.ts` | ⚙️ Medium | Medium | Pagination, filters, time window tested |
| ✅ | GET | `/api/v1/traffic/logs/{correlationId}` | 🌐 | — | Covered | `traffic/traffic.log.correlation.api.spec.ts` | 🟢 Low | Low | 200 + 404 tested |

### Local Email Outbox (test helper — `local` profile only)

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | GET | `/api/v1/local/email/outbox` | 🌐 | — | None | — | 🟢 Low | Medium | Used in password-reset and email tests; helper endpoint |
| ⬜ | DELETE | `/api/v1/local/email/outbox` | 🌐 | — | None | — | 🟢 Low | Medium | Teardown helper; should be called in `afterEach` |

---

## Auth Split

### 🔒 Endpoints Requiring Authentication (33 total, 3 covered — 9.1%)

#### Users
- `GET /api/v1/users` — any authenticated user
- `GET /api/v1/users/me` ✅
- `GET /api/v1/users/{username}` — any authenticated user
- `PUT /api/v1/users/{username}` — ADMIN or self (`@PreAuthorize`)
- `DELETE /api/v1/users/{username}` — ADMIN only
- `DELETE /api/v1/users/{username}/right-to-be-forgotten` — ADMIN or self
- `GET /api/v1/users/me/email-events`
- `GET /api/v1/users/chat-system-prompt`
- `PUT /api/v1/users/chat-system-prompt`
- `GET /api/v1/users/tool-system-prompt`
- `PUT /api/v1/users/tool-system-prompt`
- `POST /api/v1/users/logout`

#### Products
- `GET /api/v1/products` ✅
- `GET /api/v1/products/{id}`
- `POST /api/v1/products` — ADMIN only
- `PUT /api/v1/products/{id}` — ADMIN only
- `DELETE /api/v1/products/{id}` — ADMIN only

#### Orders
- `GET /api/v1/orders`
- `POST /api/v1/orders`
- `GET /api/v1/orders/{id}` — own or admin
- `POST /api/v1/orders/{id}/cancel`
- `PUT /api/v1/orders/{id}/status` — ADMIN only
- `GET /api/v1/orders/admin` — ADMIN only

#### Cart
- `GET /api/v1/cart`
- `DELETE /api/v1/cart`
- `POST /api/v1/cart/items`
- `PUT /api/v1/cart/items/{productId}`
- `DELETE /api/v1/cart/items/{productId}`

#### QR
- `POST /api/v1/qr/create` ✅

#### Ollama / AI
- `POST /api/v1/ollama/generate`
- `POST /api/v1/ollama/chat`
- `POST /api/v1/ollama/chat/tools`
- `GET /api/v1/ollama/chat/tools/definitions`

#### Email
- `POST /api/v1/email`

---

### 🌐 Endpoints Not Requiring Authentication (11 total, 5 covered — 45.5%)

#### Users / Auth
- `POST /api/v1/users/signin` ✅
- `POST /api/v1/users/signup` ✅
- `POST /api/v1/users/refresh`
- `POST /api/v1/users/password/forgot`
- `POST /api/v1/users/password/reset`

#### Traffic Monitoring
- `GET /api/v1/traffic/info` ✅
- `GET /api/v1/traffic/logs` ✅
- `GET /api/v1/traffic/logs/{correlationId}` ✅

#### Local Email Outbox
- `GET /api/v1/local/email/outbox`
- `DELETE /api/v1/local/email/outbox`

---

## Coverage Assessment

| Endpoint | Coverage Level | Rationale |
|----------|---------------|-----------|
| `POST /api/v1/users/signin` | **Covered** | Happy path, empty/short username, short password, wrong credentials tested |
| `POST /api/v1/users/signup` | **Covered** | Happy path, duplicate, short username, short password, invalid email tested |
| `GET /api/v1/users/me` | **Covered** | Happy path with contract validation, missing token, invalid token tested |
| `POST /api/v1/qr/create` | **Covered** | PNG response + magic bytes, empty text validation, missing and invalid token tested |
| `GET /api/v1/products` | **Covered** | Happy path + array contract, missing token, invalid token tested |
| `GET /api/v1/traffic/info` | **Covered** | Contract fields verified |
| `GET /api/v1/traffic/logs` | **Covered** | Pagination, client session ID filter, multi-filter, ordering, time window, validation errors |
| `GET /api/v1/traffic/logs/{correlationId}` | **Covered** | Happy path + 404 for missing ID |
| `POST /api/v1/users/refresh` | **None** | No tests; should cover valid token, expired token, missing token |
| `POST /api/v1/users/logout` | **None** | No tests; should cover successful logout, subsequent request rejected |
| `GET /api/v1/users` | **None** | No tests; verify any-auth access, response contract |
| `GET /api/v1/users/{username}` | **None** | No tests; happy path + 404 |
| `PUT /api/v1/users/{username}` | **None** | No tests; missing owner/admin permission cases, 403 for other user |
| `DELETE /api/v1/users/{username}` | **None** | No tests; admin-only 403, 404 |
| `DELETE /api/v1/users/{username}/right-to-be-forgotten` | **None** | No tests; cascading delete, permission check |
| `GET /api/v1/users/me/email-events` | **None** | No tests |
| `GET/PUT /api/v1/users/chat-system-prompt` | **None** | No tests; simple CRUD on user attribute |
| `GET/PUT /api/v1/users/tool-system-prompt` | **None** | No tests; same pattern as chat-system-prompt |
| `POST /api/v1/users/password/forgot` | **None** | No tests; needs local outbox to verify email queued; rate limit (429) |
| `POST /api/v1/users/password/reset` | **None** | No tests; stateful — requires token from forgot flow |
| `GET /api/v1/products/{id}` | **None** | No tests; happy path + 404 |
| `POST /api/v1/products` | **None** | No tests; admin-only; validation |
| `PUT /api/v1/products/{id}` | **None** | No tests; admin-only; 403 + 404 |
| `DELETE /api/v1/products/{id}` | **None** | No tests; admin-only; 403 + 404 |
| `GET /api/v1/orders` | **None** | No tests; needs order seeding |
| `POST /api/v1/orders` | **None** | No tests; requires cart to be populated first |
| `GET /api/v1/orders/{id}` | **None** | No tests; owner vs admin visibility difference |
| `POST /api/v1/orders/{id}/cancel` | **None** | No tests; business rule — only certain statuses cancellable |
| `PUT /api/v1/orders/{id}/status` | **None** | No tests; admin-only; invalid status transition |
| `GET /api/v1/orders/admin` | **None** | No tests; admin-only; pagination + status filter |
| `GET /api/v1/cart` | **None** | No tests |
| `DELETE /api/v1/cart` | **None** | No tests |
| `POST /api/v1/cart/items` | **None** | No tests; product must exist; quantity validation |
| `PUT /api/v1/cart/items/{productId}` | **None** | No tests; 404 if not in cart |
| `DELETE /api/v1/cart/items/{productId}` | **None** | No tests; 404 if not in cart |
| `POST /api/v1/email` | **None** | No tests; needs local outbox; rate limiting |
| `POST /api/v1/ollama/generate` | **None** | No tests; SSE streaming; requires Ollama running |
| `POST /api/v1/ollama/chat` | **None** | No tests; SSE streaming; system prompt injection |
| `POST /api/v1/ollama/chat/tools` | **None** | No tests; function calling; most complex Ollama flow |
| `GET /api/v1/ollama/chat/tools/definitions` | **None** | No tests; static list; easy quick win |
| `GET /api/v1/local/email/outbox` | **None** | No tests; used as helper in forgot-password flow |
| `DELETE /api/v1/local/email/outbox` | **None** | No tests; teardown helper |

---

## Complexity Assessment

| Endpoint | Difficulty | Rationale |
|----------|-----------|-----------|
| `POST /api/v1/users/signin` | 🟢 Low | Simple credential check, minimal branching |
| `POST /api/v1/users/signup` | 🟢 Low | Validation + uniqueness check only |
| `POST /api/v1/users/refresh` | 🟢 Low | Single token exchange path |
| `POST /api/v1/users/logout` | 🟢 Low | Token invalidation, no business logic |
| `GET /api/v1/users` | 🟢 Low | Simple list, no filtering |
| `GET /api/v1/users/me` | 🟢 Low | Returns current user from principal |
| `GET /api/v1/users/{username}` | 🟢 Low | Single lookup + 404 |
| `GET/PUT /api/v1/users/chat-system-prompt` | 🟢 Low | Single field read/write per user |
| `GET/PUT /api/v1/users/tool-system-prompt` | 🟢 Low | Same as chat-system-prompt |
| `GET /api/v1/users/me/email-events` | 🟢 Low | Read-only, user-scoped |
| `GET /api/v1/traffic/info` | 🟢 Low | Static response |
| `GET /api/v1/traffic/logs` | ⚙️ Medium | Pagination + multiple filter params + async capture delay |
| `GET /api/v1/traffic/logs/{correlationId}` | 🟢 Low | Single lookup |
| `GET /api/v1/local/email/outbox` | 🟢 Low | In-memory list |
| `DELETE /api/v1/local/email/outbox` | 🟢 Low | Clear in-memory list |
| `POST /api/v1/qr/create` | 🟢 Low | Binary PNG response, single validation |
| `GET /api/v1/products` | 🟢 Low | Simple list, seeded data |
| `GET /api/v1/products/{id}` | 🟢 Low | Single lookup + 404 |
| `POST /api/v1/products` | ⚙️ Medium | Admin-only + validation + 403 cases |
| `PUT /api/v1/products/{id}` | ⚙️ Medium | Admin-only + partial update + 404 |
| `DELETE /api/v1/products/{id}` | ⚙️ Medium | Admin-only + FK checks (cart/orders referencing product) |
| `PUT /api/v1/users/{username}` | ⚙️ Medium | `@PreAuthorize` with SpEL expression; self-edit vs admin; 403 cases |
| `DELETE /api/v1/users/{username}` | ⚙️ Medium | Admin-only with 403/404; verify cascading |
| `DELETE /api/v1/users/{username}/right-to-be-forgotten` | ⚙️ Medium | Owner or admin; cascading data wipe |
| `GET /api/v1/cart` | 🟢 Low | User-scoped, no branching |
| `DELETE /api/v1/cart` | 🟢 Low | Clear user's cart |
| `POST /api/v1/cart/items` | ⚙️ Medium | Product existence check, quantity validation, 404 path |
| `PUT /api/v1/cart/items/{productId}` | ⚙️ Medium | Cart item existence check, quantity validation |
| `DELETE /api/v1/cart/items/{productId}` | ⚙️ Medium | Cart item 404 path |
| `POST /api/v1/orders` | 🔥 High | Requires populated cart; validates address; inventory check; cart-to-order conversion |
| `GET /api/v1/orders` | ⚙️ Medium | Pagination + optional status filter; user-scoped |
| `GET /api/v1/orders/{id}` | ⚙️ Medium | Admin vs user visibility; two code paths |
| `POST /api/v1/orders/{id}/cancel` | ⚙️ Medium | Business rule: only PENDING/PROCESSING cancellable; admin bypass |
| `PUT /api/v1/orders/{id}/status` | ⚙️ Medium | Admin-only; valid status transitions enforced |
| `GET /api/v1/orders/admin` | ⚙️ Medium | Admin-only; pagination + status filter |
| `POST /api/v1/email` | ⚙️ Medium | Rate limiting; async JMS; needs outbox verification |
| `POST /api/v1/users/password/forgot` | ⚙️ Medium | Rate limiting; async email via JMS; local outbox verification |
| `POST /api/v1/users/password/reset` | ⚙️ Medium | Stateful — depends on token from forgot flow; expiry |
| `POST /api/v1/ollama/generate` | 🔥 High | SSE streaming; model availability; rate limiting; no deterministic output |
| `POST /api/v1/ollama/chat` | 🔥 High | SSE streaming; system prompt injection; rate limiting |
| `POST /api/v1/ollama/chat/tools` | 🔥 High | SSE + function calling; multi-turn logic; most complex endpoint |
| `GET /api/v1/ollama/chat/tools/definitions` | 🟢 Low | Static catalog; pure contract test |

---

## Phased Delivery Plan

### Phase 1 — Quick Wins (public + low-complexity auth)

**Goals:** Establish baseline coverage for easy endpoints; non-auth flows; simple authenticated CRUD.

**Included endpoints:**
- `POST /api/v1/users/refresh`
- `POST /api/v1/users/logout`
- `GET /api/v1/users`
- `GET /api/v1/users/{username}`
- `GET /api/v1/users/me/email-events`
- `GET /api/v1/users/chat-system-prompt`
- `PUT /api/v1/users/chat-system-prompt`
- `GET /api/v1/users/tool-system-prompt`
- `PUT /api/v1/users/tool-system-prompt`
- `GET /api/v1/products/{id}`
- `GET /api/v1/cart`
- `DELETE /api/v1/cart`
- `GET /api/v1/local/email/outbox`
- `DELETE /api/v1/local/email/outbox`
- `GET /api/v1/ollama/chat/tools/definitions`

**Rationale:** All low-complexity; most require only a valid token (use existing `authenticatedUserFixture`). No data seeding beyond what already exists (seeded products).

**Expected challenges:** None significant. Refresh token test requires saving the token from signup response.

---

### Phase 2 — Core Authenticated Flows

**Goals:** Cover key user journeys: cart → order lifecycle, products admin CRUD, user management.

**Included endpoints:**
- `POST /api/v1/cart/items`
- `PUT /api/v1/cart/items/{productId}`
- `DELETE /api/v1/cart/items/{productId}`
- `POST /api/v1/orders` (requires Phase 1 cart setup)
- `GET /api/v1/orders`
- `GET /api/v1/orders/{id}`
- `PUT /api/v1/users/{username}`
- `DELETE /api/v1/users/{username}`
- `DELETE /api/v1/users/{username}/right-to-be-forgotten`
- `POST /api/v1/products`
- `PUT /api/v1/products/{id}`
- `DELETE /api/v1/products/{id}`
- `GET /api/v1/orders/admin`

**Rationale:** Covers main business flows. Cart → Order is the core e-commerce journey. Product CRUD and user management needed for admin coverage. Requires admin token — use existing `ADMIN_PASSWORD` constant.

**Expected challenges:**
- Cart/order tests must be isolated (each test creates its own cart state).
- Admin token generation needs a fixture or helper.
- Product delete may have FK constraints if products appear in orders.

---

### Phase 3 — Edge Cases and Resilience

**Goals:** Negative scenarios, permission boundaries, validation, business rule failures.

**Included endpoints (additional scenarios for already-tested and Phase 2 endpoints):**
- `POST /api/v1/orders/{id}/cancel` — invalid status transitions
- `PUT /api/v1/orders/{id}/status` — admin-only; invalid transitions
- `POST /api/v1/users/password/forgot` — rate limit (429), unknown identifier (still 202 for privacy)
- `POST /api/v1/users/password/reset` — expired token, invalid token, reuse of token
- `POST /api/v1/email` — rate limit (429), validation errors
- All admin endpoints — 403 for non-admin user
- `GET /api/v1/orders/{id}` — user cannot see another user's order

**Rationale:** Business rules and security boundaries are high-risk areas. Password reset flow is stateful and requires local outbox as test oracle.

**Expected challenges:**
- Rate limiting tests may be flaky if tests run in parallel; consider serial execution for rate-limit scenarios.
- Password reset requires `local` profile outbox; ensure tests run against `local` profile backend.
- Status transition tests require seeded orders in specific states.

---

### Phase 4 — Advanced / High-Complexity Coverage

**Goals:** Streaming AI endpoints; complex stateful workflows.

**Included endpoints:**
- `POST /api/v1/ollama/generate`
- `POST /api/v1/ollama/chat`
- `POST /api/v1/ollama/chat/tools`

**Rationale:** These depend on a running Ollama instance and produce non-deterministic output. SSE streaming requires special handling in Playwright. Left for last as they may need a dedicated test environment.

**Expected challenges:**
- Ollama must be running and the model loaded. Consider skipping or marking as `@skip` in CI if not available.
- SSE stream parsing — use `response.body()` or a custom SSE reader.
- Ollama output is non-deterministic; assert shape, not content.

---

## Recommended Test Scenarios Per Endpoint

### `POST /api/v1/users/refresh`
- ✅ Valid refresh token → returns new access token
- ⬜ Expired refresh token → 4xx
- ⬜ Missing token body → 400

### `POST /api/v1/users/logout`
- ✅ Logout with valid token → 200
- ⬜ Subsequent request with same token → 401

### `GET /api/v1/users/{username}`
- ✅ Existing user → 200 + contract
- ⬜ Non-existent user → 404
- ⬜ No token → 401

### `PUT /api/v1/users/{username}`
- ✅ Owner edits own profile → 200
- ⬜ Admin edits any user → 200
- ⬜ Other user attempts edit → 403
- ⬜ Validation errors → 400
- ⬜ Non-existent user → 404

### `DELETE /api/v1/users/{username}`
- ✅ Admin deletes existing user → 204
- ⬜ Non-admin tries to delete → 403
- ⬜ Delete non-existent user → 404

### `DELETE /api/v1/users/{username}/right-to-be-forgotten`
- ✅ Owner deletes own data → 204
- ⬜ Admin deletes any user's data → 204
- ⬜ Other user attempts → 403

### `GET /api/v1/products/{id}`
- ✅ Existing product → 200 + contract
- ⬜ Non-existent product → 404
- ⬜ No token → 401

### `POST /api/v1/products`
- ✅ Admin creates valid product → 201
- ⬜ Non-admin → 403
- ⬜ Missing required fields → 400
- ⬜ Invalid price (negative) → 400

### `PUT /api/v1/products/{id}`
- ✅ Admin updates product → 200
- ⬜ Non-admin → 403
- ⬜ Non-existent product → 404
- ⬜ Validation errors → 400

### `DELETE /api/v1/products/{id}`
- ✅ Admin deletes product → 204
- ⬜ Non-admin → 403
- ⬜ Non-existent product → 404

### `GET /api/v1/cart`
- ✅ Authenticated user → 200 + empty cart contract
- ⬜ No token → 401

### `POST /api/v1/cart/items`
- ✅ Add existing product → 200 + cart updated
- ⬜ Product not found → 404
- ⬜ Invalid quantity (0 or negative) → 400
- ⬜ No token → 401

### `PUT /api/v1/cart/items/{productId}`
- ✅ Update quantity → 200
- ⬜ Item not in cart → 404
- ⬜ Invalid quantity → 400

### `DELETE /api/v1/cart/items/{productId}`
- ✅ Remove existing item → 200
- ⬜ Item not in cart → 404

### `DELETE /api/v1/cart`
- ✅ Clear cart → 204
- ⬜ No token → 401

### `POST /api/v1/orders`
- ✅ Populated cart + valid address → 201 + order contract
- ⬜ Empty cart → 400
- ⬜ Invalid address fields → 400
- ⬜ No token → 401

### `GET /api/v1/orders`
- ✅ Paginated list → 200 + page contract
- ⬜ Filter by status → returns only matching orders
- ⬜ No token → 401

### `GET /api/v1/orders/{id}`
- ✅ Owner fetches own order → 200
- ⬜ Admin fetches any order → 200
- ⬜ User fetches another user's order → 403 or 404
- ⬜ Non-existent ID → 404

### `POST /api/v1/orders/{id}/cancel`
- ✅ Cancel pending order → 200
- ⬜ Cancel already-cancelled order → 400
- ⬜ Cancel completed/shipped order → 400
- ⬜ User cancels another user's order → 403/404

### `PUT /api/v1/orders/{id}/status`
- ✅ Admin updates to valid status → 200
- ⬜ Non-admin → 403
- ⬜ Invalid status transition → 400
- ⬜ Non-existent order → 404

### `GET /api/v1/orders/admin`
- ✅ Admin gets all orders → 200 + page contract
- ⬜ Non-admin → 403
- ⬜ Filter by status → 200 filtered

### `POST /api/v1/users/password/forgot`
- ✅ Valid identifier → 202 (email queued, check local outbox)
- ⬜ Unknown identifier → 202 (privacy — no leak)
- ⬜ Invalid email format → 400
- ⬜ Rate limit exceeded → 429

### `POST /api/v1/users/password/reset`
- ✅ Valid token + new password → 200
- ⬜ Invalid/expired token → 400
- ⬜ Token already used → 400
- ⬜ New password too short → 400
- ⬜ Rate limit exceeded → 429

### `POST /api/v1/email`
- ✅ Valid email payload → 200 (verify in local outbox)
- ⬜ Missing required fields → 400
- ⬜ Rate limit exceeded → 429
- ⬜ No token → 401

### `POST /api/v1/ollama/generate`
- ✅ Valid model + prompt → SSE stream with GenerateResponseDto chunks
- ⬜ Unknown model → 404
- ⬜ Rate limit exceeded → 429
- ⬜ No token → 401

### `POST /api/v1/ollama/chat`
- ✅ Valid messages array → SSE stream
- ⬜ User's chat system prompt injected in request
- ⬜ Rate limit → 429

### `POST /api/v1/ollama/chat/tools`
- ✅ Valid tool definitions used → SSE stream
- ⬜ Tool invocation response parsed correctly
- ⬜ Rate limit → 429

### `GET /api/v1/ollama/chat/tools/definitions`
- ✅ Returns list of tool definitions → 200 + contract
- ⬜ No token → 401

### `GET/DELETE /api/v1/local/email/outbox`
- ✅ Returns list of stored emails → 200
- ✅ Clears outbox → 200

### `POST /api/v1/users/sso/exchange`
- ✅ Valid OIDC token → 200 + JWT
- ⬜ Invalid token → 401
- ⬜ SSO identity conflicts with existing local account → 409
- ⬜ Missing idToken field → 400

---

## Documentation / Code Discrepancy Notes

| Observation | Detail |
|-------------|--------|
| `GET /api/v1/users` auth | Documented with `bearerAuth` security; `WebSecurityConfig` requires authentication for all non-listed paths. Controller has no `@PreAuthorize` role restriction — any authenticated user can list all users. This is a potential security concern worth noting. |
| `GET /api/v1/ollama/chat/tools/definitions` auth | Documented with `bearerAuth` but `WebSecurityConfig` allows all requests matching the auth filter chain — auth still required at runtime since it's not in `ALLOWED_ENDPOINTS`. |
| `LocalEmailOutboxController` | Annotated with `@Profile("local")` — only active in the `local` Spring profile. Tests should ensure they run against that profile. No tests currently use this endpoint. |
| `PUT /api/v1/orders/{id}/status` and `GET /api/v1/orders/admin` | Documented as ADMIN-only via `@PreAuthorize("hasRole('ROLE_ADMIN')")` — this is method-level security, not filter-chain security. Verify 403 is returned (not 401) for non-admin authenticated users. |
| Password reset endpoints return `429` | `AuthRateLimitGuard` enforces rate limits. These scenarios are documented in the OpenAPI spec but no tests exist. |

---

## Maintenance

### Adding a new endpoint
1. Add a row to the **Endpoint Inventory** table under the appropriate module section.
2. Add it to the **Auth Split** section under the right heading.
3. Add it to the appropriate **Phase** based on complexity and priority.
4. Add recommended scenarios in the **Scenarios** section.
5. Recalculate the **Coverage Summary** table.

### Updating coverage after adding tests
1. Change the `Status` emoji from ⬜ to ✅ (or 🟡 if partial).
2. Fill in `Existing Test File(s)` with the relative path (e.g., `tests/api/products.get.api.spec.ts`).
3. Update `Current Coverage` from `None` → `Partial` or `Covered`.
4. Recalculate coverage percentages:

```
overall coverage % = covered_endpoints / total_endpoints * 100
auth coverage % = covered_auth_endpoints / total_auth_endpoints * 100
non-auth coverage % = covered_non_auth_endpoints / total_non_auth_endpoints * 100
```

### Coverage rules (for consistency)
- **Covered** = automated tests for happy path + at least one negative/auth/validation scenario present
- **Partial** = some tests exist but important scenario groups are missing (e.g., happy path only, no 401, no validation)
- **None** = no meaningful automated test found for this endpoint

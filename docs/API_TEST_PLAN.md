# API Test Plan — JWT Authentication API

**Last Updated:** 2026-04-22  
**Project:** `slawekradzyminski/playwright-2025` — JWT Authentication API (Spring Boot backend)  
**Sources Analysed:**
- `api-docs.json` — OpenAPI 3.1 spec (primary endpoint inventory)
- `../test-secure-backend/src/main/java/com/awesome/testing/` — backend controllers, security, services
- `tests/api/` — Playwright API test suite
- `httpclients/` — HTTP client wrappers

**How to use this document:**
1. Use this document as the endpoint inventory and coverage source of truth.
2. Use [`API_TESTS_PHASES.md`](./API_TESTS_PHASES.md) to decide what to implement next and what can run in parallel.
3. Use the **Coverage Summary** table for a quick health check.
4. Use the **Endpoint Inventory** table to track per-endpoint progress.
5. When you add a test, update `Current Coverage` and `Existing Test File(s)` in the table.
6. When you add a new endpoint, append a row, then add it to the appropriate Auth section and phase document.
7. Recalculate coverage percentages using the rules in the **Maintenance** section.

**Companion documents:**

| Document | Purpose |
|----------|---------|
| [`API_TEST_PLAN.md`](./API_TEST_PLAN.md) | Endpoint inventory, current coverage, scenario checklist, and discrepancies |
| [`API_TESTS_PHASES.md`](./API_TESTS_PHASES.md) | Execution order, dependencies, parallelization rules, and next-step selection |

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
| **Total endpoints** | 45 |
| **Covered** (happy path + key negatives) | 29 |
| **Partial** (some scenarios missing) | 0 |
| **Not covered** | 16 |
| **Overall coverage %** | **64.4%** |
| **Auth endpoints total** | 34 |
| **Auth endpoints covered** | 21 (61.8%) |
| **Non-auth endpoints total** | 11 |
| **Non-auth endpoints covered** | 8 (72.7%) |
| **High-complexity endpoints** | 7 |
| **Admin-only endpoints** | 7 |
| **Rate-limited endpoints** | 4 |

---

## Endpoint Inventory

> Sorted by feature group, then method. Auth column reflects the `WebSecurityConfig` `ALLOWED_ENDPOINTS` list combined with `@PreAuthorize` annotations in each controller.

### Users

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | POST | `/api/v1/users/signin` | 🌐 | — | Covered | `users/login.api.spec.ts` | 🟢 Low | High | Validation + 422 tested |
| ✅ | POST | `/api/v1/users/signup` | 🌐 | — | Covered | `users/signup.api.spec.ts` | 🟢 Low | High | Validation + duplicate tested |
| ✅ | GET | `/api/v1/users/me` | 🔒 | any | Covered | `users/users.me.get.api.spec.ts` | 🟢 Low | High | 200 + 401 tested |
| ✅ | POST | `/api/v1/users/refresh` | 🌐 | — | Covered | `users/users.refresh.post.api.spec.ts` | 🟢 Low | High | 200 + 400 + 401 tested |
| ⬜ | POST | `/api/v1/users/sso/exchange` | 🌐 | — | None | — | ⚙️ Medium | Low | OIDC token exchange; depends on configured identity provider |
| ✅ | POST | `/api/v1/users/logout` | 🔒 | any | Covered | `users/users.logout.post.api.spec.ts` | 🟢 Low | Medium | Logout + refresh-token invalidation + 401 tested |
| ✅ | GET | `/api/v1/users` | 🔒 | any | Covered | `users/users.get.api.spec.ts` | 🟢 Low | Medium | 200 + 401 tested; no role restriction in code |
| ✅ | GET | `/api/v1/users/{username}` | 🔒 | any | Covered | `users/users.username.get.api.spec.ts` | 🟢 Low | Medium | 200 + 401 + 404 tested |
| ⬜ | PUT | `/api/v1/users/{username}` | 🔒 | ADMIN or owner | None | — | ⚙️ Medium | Medium | `@PreAuthorize` checks self or admin; 403 cases |
| ⬜ | DELETE | `/api/v1/users/{username}` | 🔒 | ADMIN | None | — | ⚙️ Medium | Low | Admin-only; 403 + 404 cases |
| ⬜ | DELETE | `/api/v1/users/{username}/right-to-be-forgotten` | 🔒 | ADMIN or owner | None | — | ⚙️ Medium | Medium | Cascading data deletion; owner or admin |
| ✅ | GET | `/api/v1/users/me/email-events` | 🔒 | any | Covered | `users/users.me.email-events.get.api.spec.ts` | 🟢 Low | Medium | 200 + 401 tested |
| ✅ | GET | `/api/v1/users/chat-system-prompt` | 🔒 | any | Covered | `users/users.chat-system-prompt.get.api.spec.ts` | 🟢 Low | Low | 200 + 401 tested |
| ✅ | PUT | `/api/v1/users/chat-system-prompt` | 🔒 | any | Covered | `users/users.chat-system-prompt.put.api.spec.ts` | 🟢 Low | Low | 200 + 400 + 401 tested |
| ✅ | GET | `/api/v1/users/tool-system-prompt` | 🔒 | any | Covered | `users/users.tool-system-prompt.get.api.spec.ts` | 🟢 Low | Low | 200 + 401 tested |
| ✅ | PUT | `/api/v1/users/tool-system-prompt` | 🔒 | any | Covered | `users/users.tool-system-prompt.put.api.spec.ts` | 🟢 Low | Low | 200 + 400 + 401 tested |

### Password Reset

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | POST | `/api/v1/users/password/forgot` | 🌐 | — | None | — | ⚙️ Medium | High | Rate-limited (429); email sent via JMS; use local outbox |
| ⬜ | POST | `/api/v1/users/password/reset` | 🌐 | — | None | — | ⚙️ Medium | High | Rate-limited (429); requires token from forgot flow; stateful |

### Products

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | GET | `/api/v1/products` | 🔒 | any | Covered | `products/products.get.api.spec.ts` | 🟢 Low | High | 200 + 401 tested; response contract validated |
| ✅ | GET | `/api/v1/products/{id}` | 🔒 | any | Covered | `products/products.id.get.api.spec.ts` | 🟢 Low | High | 200 + 401 + 404 tested; response contract validated |
| ✅ | POST | `/api/v1/products` | 🔒 | ADMIN | Covered | `admin/products/products.post.admin.api.spec.ts` | ⚙️ Medium | Medium | 201 + 400 + 401 + 403 tested; admin cleanup fixture tracks created data |
| ✅ | PUT | `/api/v1/products/{id}` | 🔒 | ADMIN | Covered | `admin/products/products.id.put.admin.api.spec.ts` | ⚙️ Medium | Medium | 200 + 400 + 401 + 403 + 404 tested; uses self-created products |
| ✅ | DELETE | `/api/v1/products/{id}` | 🔒 | ADMIN | Covered | `admin/products/products.id.delete.admin.api.spec.ts` | ⚙️ Medium | Low | 204 + 401 + 403 + 404 tested; deletes only self-created products |

### Orders

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | POST | `/api/v1/orders` | 🔒 | any | Covered | `orders/orders.post.api.spec.ts` | 🔥 High | High | 201 create-from-cart, 400 empty cart, and 401 missing/invalid token covered; asserts created order contract and cart is emptied |
| ✅ | GET | `/api/v1/orders` | 🔒 | any | Covered | `orders/orders.get.api.spec.ts` | ⚙️ Medium | High | Covers paginated current-user contract, seeded order presence, stable `status=PENDING` filter, and 401 missing/invalid token |
| ✅ | GET | `/api/v1/orders/{id}` | 🔒 | any or ADMIN | Covered | `orders/orders.id.get.api.spec.ts` | ⚙️ Medium | High | Covers owner read contract, 401 missing/invalid token, and 404 missing order |
| ⬜ | POST | `/api/v1/orders/{id}/cancel` | 🔒 | any or ADMIN | None | — | ⚙️ Medium | Medium | Business rule: only cancellable statuses; 400 on invalid |
| ⬜ | PUT | `/api/v1/orders/{id}/status` | 🔒 | ADMIN | None | — | ⚙️ Medium | Medium | Admin-only status transition; invalid transition → 400 |
| ⬜ | GET | `/api/v1/orders/admin` | 🔒 | ADMIN | None | — | ⚙️ Medium | Medium | Admin-only; paginated; filter by status |

### Cart

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | GET | `/api/v1/cart` | 🔒 | any | Covered | `cart/cart.get.api.spec.ts` | 🟢 Low | High | 200 + 401 tested; response contract validated |
| ✅ | DELETE | `/api/v1/cart` | 🔒 | any | Covered | `cart/cart.delete.api.spec.ts` | 🟢 Low | Medium | 204 + 401 tested |
| ✅ | POST | `/api/v1/cart/items` | 🔒 | any | Covered | `cart/cart.items.post.api.spec.ts` | ⚙️ Medium | High | 200 + 400 + 401 + 404 tested |
| ✅ | PUT | `/api/v1/cart/items/{productId}` | 🔒 | any | Covered | `cart/cart.items.product-id.put.api.spec.ts` | ⚙️ Medium | Medium | 200 + 400 + 401 + 404 tested |
| ✅ | DELETE | `/api/v1/cart/items/{productId}` | 🔒 | any | Covered | `cart/cart.items.product-id.delete.api.spec.ts` | ⚙️ Medium | Medium | 200 + 401 + 404 tested |

### QR

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ✅ | POST | `/api/v1/qr/create` | 🔒 | any | Covered | `qr/qr.create.api.spec.ts` | 🟢 Low | Medium | PNG binary response + 400 + 401 tested |

### Ollama / AI

| Status | Method | Path | Auth | Role Required | Coverage | Test File(s) | Difficulty | Priority | Notes |
|--------|--------|------|------|--------------|----------|-------------|-----------|---------|-------|
| ⬜ | POST | `/api/v1/ollama/generate` | 🔒 | any | None | — | 🔥 High | Low | SSE streaming; rate-limited; requires running Ollama |
| ⬜ | POST | `/api/v1/ollama/chat` | 🔒 | any | None | — | 🔥 High | Low | SSE streaming; injects user chat system prompt; rate-limited |
| ⬜ | POST | `/api/v1/ollama/chat/tools` | 🔒 | any | None | — | 🔥 High | Low | SSE + function calling; complex branching logic |
| ✅ | GET | `/api/v1/ollama/chat/tools/definitions` | 🔒 | any | Covered | `ollama/ollama.chat.tools.definitions.get.api.spec.ts` | 🟢 Low | Low | 200 + 401 tested |

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
| ✅ | GET | `/api/v1/local/email/outbox` | 🌐 | — | Covered | `local-email-outbox/local.email.outbox.get.api.spec.ts` | 🟢 Low | Medium | Helper endpoint; returns queued emails |
| ✅ | DELETE | `/api/v1/local/email/outbox` | 🌐 | — | Covered | `local-email-outbox/local.email.outbox.delete.api.spec.ts` | 🟢 Low | Medium | Teardown helper; clears outbox |

---

## Auth Split

### 🔒 Endpoints Requiring Authentication (34 total, 21 covered — 61.8%)

#### Users
- `GET /api/v1/users` — any authenticated user ✅
- `GET /api/v1/users/me` ✅
- `GET /api/v1/users/{username}` — any authenticated user ✅
- `PUT /api/v1/users/{username}` — ADMIN or self (`@PreAuthorize`)
- `DELETE /api/v1/users/{username}` — ADMIN only
- `DELETE /api/v1/users/{username}/right-to-be-forgotten` — ADMIN or self
- `GET /api/v1/users/me/email-events` ✅
- `GET /api/v1/users/chat-system-prompt` ✅
- `PUT /api/v1/users/chat-system-prompt` ✅
- `GET /api/v1/users/tool-system-prompt` ✅
- `PUT /api/v1/users/tool-system-prompt` ✅
- `POST /api/v1/users/logout` ✅

#### Products
- `GET /api/v1/products` ✅
- `GET /api/v1/products/{id}` ✅
- `POST /api/v1/products` — ADMIN only ✅
- `PUT /api/v1/products/{id}` — ADMIN only ✅
- `DELETE /api/v1/products/{id}` — ADMIN only ✅

#### Orders
- `GET /api/v1/orders`
- `POST /api/v1/orders`
- `GET /api/v1/orders/{id}` — own or admin
- `POST /api/v1/orders/{id}/cancel`
- `PUT /api/v1/orders/{id}/status` — ADMIN only
- `GET /api/v1/orders/admin` — ADMIN only

#### Cart
- `GET /api/v1/cart` ✅
- `DELETE /api/v1/cart` ✅
- `POST /api/v1/cart/items` ✅
- `PUT /api/v1/cart/items/{productId}` ✅
- `DELETE /api/v1/cart/items/{productId}` ✅

#### QR
- `POST /api/v1/qr/create` ✅

#### Ollama / AI
- `POST /api/v1/ollama/generate`
- `POST /api/v1/ollama/chat`
- `POST /api/v1/ollama/chat/tools`
- `GET /api/v1/ollama/chat/tools/definitions` ✅

#### Email
- `POST /api/v1/email`

---

### 🌐 Endpoints Not Requiring Authentication (11 total, 8 covered — 72.7%)

#### Users / Auth
- `POST /api/v1/users/signin` ✅
- `POST /api/v1/users/signup` ✅
- `POST /api/v1/users/refresh` ✅
- `POST /api/v1/users/sso/exchange`
- `POST /api/v1/users/password/forgot`
- `POST /api/v1/users/password/reset`

#### Traffic Monitoring
- `GET /api/v1/traffic/info` ✅
- `GET /api/v1/traffic/logs` ✅
- `GET /api/v1/traffic/logs/{correlationId}` ✅

#### Local Email Outbox
- `GET /api/v1/local/email/outbox` ✅
- `DELETE /api/v1/local/email/outbox` ✅

---

## Coverage Assessment

| Endpoint | Coverage Level | Rationale |
|----------|---------------|-----------|
| `POST /api/v1/users/signin` | **Covered** | Happy path, empty/short username, short password, wrong credentials tested |
| `POST /api/v1/users/signup` | **Covered** | Happy path, duplicate, short username, short password, invalid email tested |
| `GET /api/v1/users/me` | **Covered** | Happy path with contract validation, missing token, invalid token tested |
| `POST /api/v1/qr/create` | **Covered** | PNG response + magic bytes, empty text validation, missing and invalid token tested |
| `GET /api/v1/products` | **Covered** | Happy path + array contract, missing token, invalid token tested |
| `GET /api/v1/products/{id}` | **Covered** | Happy path + contract, missing token, invalid token, missing product tested |
| `GET /api/v1/cart` | **Covered** | Happy path + contract, missing token, invalid token tested |
| `DELETE /api/v1/cart` | **Covered** | Happy path, missing token, invalid token tested |
| `GET /api/v1/users/{username}` | **Covered** | Happy path + contract, missing token, invalid token, missing user tested |
| `GET /api/v1/traffic/info` | **Covered** | Contract fields verified |
| `GET /api/v1/traffic/logs` | **Covered** | Pagination, client session ID filter, multi-filter, ordering, time window, validation errors |
| `GET /api/v1/traffic/logs/{correlationId}` | **Covered** | Happy path + 404 for missing ID |
| `POST /api/v1/users/refresh` | **Covered** | Valid rotation, missing token, invalid token, and reused rotated token tested |
| `POST /api/v1/users/sso/exchange` | **None** | No tests; depends on configured OIDC provider/token fixture |
| `POST /api/v1/users/logout` | **Covered** | Successful logout, missing token, invalid token, and refresh-token invalidation tested |
| `GET /api/v1/users` | **Covered** | Happy path includes current user contract; missing and invalid token tested |
| `PUT /api/v1/users/{username}` | **None** | No tests; missing owner/admin permission cases, 403 for other user |
| `DELETE /api/v1/users/{username}` | **None** | No tests; admin-only 403, 404 |
| `DELETE /api/v1/users/{username}/right-to-be-forgotten` | **None** | No tests; cascading delete, permission check |
| `GET /api/v1/users/me/email-events` | **Covered** | Happy path array contract, missing token, invalid token tested |
| `GET/PUT /api/v1/users/chat-system-prompt` | **Covered** | Read, update, persisted value, max-length validation, missing token, invalid token tested |
| `GET/PUT /api/v1/users/tool-system-prompt` | **Covered** | Read, update, persisted value, max-length validation, missing token, invalid token tested |
| `POST /api/v1/users/password/forgot` | **None** | No tests; needs local outbox to verify email queued; rate limit (429) |
| `POST /api/v1/users/password/reset` | **None** | No tests; stateful — requires token from forgot flow |
| `POST /api/v1/products` | **Covered** | Admin create, validation, missing token, and client-user 403 tested |
| `PUT /api/v1/products/{id}` | **Covered** | Admin update, validation, missing token, client-user 403, and missing product tested |
| `DELETE /api/v1/products/{id}` | **Covered** | Admin delete, missing token, client-user 403, and missing product tested |
| `GET /api/v1/orders` | **None** | No tests; needs order seeding |
| `POST /api/v1/orders` | **None** | No tests; requires cart to be populated first |
| `GET /api/v1/orders/{id}` | **None** | No tests; owner vs admin visibility difference |
| `POST /api/v1/orders/{id}/cancel` | **None** | No tests; business rule — only certain statuses cancellable |
| `PUT /api/v1/orders/{id}/status` | **None** | No tests; admin-only; invalid status transition |
| `GET /api/v1/orders/admin` | **None** | No tests; admin-only; pagination + status filter |
| `POST /api/v1/cart/items` | **Covered** | Existing product add, quantity validation, missing token, invalid token, and missing product tested |
| `PUT /api/v1/cart/items/{productId}` | **Covered** | Quantity update, negative quantity validation, missing token, invalid token, and missing cart item tested |
| `DELETE /api/v1/cart/items/{productId}` | **Covered** | Existing item removal, missing token, invalid token, and missing cart item tested |
| `POST /api/v1/email` | **None** | No tests; needs local outbox; rate limiting |
| `POST /api/v1/ollama/generate` | **None** | No tests; SSE streaming; requires Ollama running |
| `POST /api/v1/ollama/chat` | **None** | No tests; SSE streaming; system prompt injection |
| `POST /api/v1/ollama/chat/tools` | **None** | No tests; function calling; most complex Ollama flow |
| `GET /api/v1/ollama/chat/tools/definitions` | **Covered** | Static tool definition contract, missing token, invalid token tested |
| `GET /api/v1/local/email/outbox` | **Covered** | Happy path array contract tested after clearing outbox |
| `DELETE /api/v1/local/email/outbox` | **Covered** | Happy path clear operation and empty outbox verification tested |

---

## Complexity Assessment

| Endpoint | Difficulty | Rationale |
|----------|-----------|-----------|
| `POST /api/v1/users/signin` | 🟢 Low | Simple credential check, minimal branching |
| `POST /api/v1/users/signup` | 🟢 Low | Validation + uniqueness check only |
| `POST /api/v1/users/refresh` | 🟢 Low | Single token exchange path |
| `POST /api/v1/users/sso/exchange` | ⚙️ Medium | Depends on configured OIDC validation and account-linking conflict behavior |
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

Use [`API_TESTS_PHASES.md`](./API_TESTS_PHASES.md) as the detailed execution roadmap. It contains dependency gates, parallelization guidance, exit criteria, and the current recommended next increment.

This plan keeps only the high-level phase index so there is one source of truth for execution status.

| Phase | Focus | Parallelization Summary |
|-------|-------|-------------------------|
| Phase 1 | Support and low-risk endpoint coverage | Mostly parallel-safe |
| Phase 2A | Cart mutations | `POST /cart/items` first, then PUT/DELETE can split |
| Phase 2B | Admin test foundation | Complete; admin lane runs sequentially after regular tests |
| Phase 3 | User order lifecycle | Sequential after cart mutations |
| Phase 4A | Product admin CRUD | Complete for API coverage |
| Phase 4B | User management permissions | Parallel-safe after admin foundation |
| Phase 5 | Email and password reset | Parallel-safe except rate-limit scenarios |
| Phase 6 | Order admin and business rules | Partially parallel; depends on admin and order foundations |
| Phase 7 | SSO and Ollama streaming | Isolated, environment-dependent work |

---

## Recommended Test Scenarios Per Endpoint

### `POST /api/v1/users/refresh`
- ✅ Valid refresh token → returns new access token
- ✅ Missing token body → 400
- ✅ Invalid refresh token → 401
- ✅ Reused rotated refresh token → 401

### `POST /api/v1/users/logout`
- ✅ Logout with valid token → 200
- ✅ Refresh token issued before logout is rejected afterward → 401
- ✅ Missing token → 401
- ✅ Invalid token → 401

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
- ✅ Non-existent product → 404
- ✅ No token → 401

### `POST /api/v1/products`
- ✅ Admin creates valid product → 201
- ✅ Non-admin → 403
- ✅ Missing required fields / invalid body → 400
- ✅ Missing token → 401

### `PUT /api/v1/products/{id}`
- ✅ Admin updates product → 200
- ✅ Non-admin → 403
- ✅ Non-existent product → 404
- ✅ Validation errors → 400
- ✅ Missing token → 401

### `DELETE /api/v1/products/{id}`
- ✅ Admin deletes product → 204
- ✅ Non-admin → 403
- ✅ Non-existent product → 404
- ✅ Missing token → 401

### `GET /api/v1/cart`
- ✅ Authenticated user → 200 + empty cart contract
- ⬜ No token → 401

### `POST /api/v1/cart/items`
- ✅ Add existing product → 200 + cart updated
- ✅ Product not found → 404
- ✅ Invalid quantity (0 or negative) → 400
- ✅ No token → 401

### `PUT /api/v1/cart/items/{productId}`
- ✅ Update quantity → 200
- ✅ Item not in cart → 404
- ✅ Invalid quantity → 400
- ✅ No token → 401

### `DELETE /api/v1/cart/items/{productId}`
- ✅ Remove existing item → 200
- ✅ Item not in cart → 404
- ✅ No token → 401

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
- ✅ No token → 401
- ✅ Invalid token → 401

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
| `LocalEmailOutboxController` | Annotated with `@Profile("local")` — only active in the `local` Spring profile. Phase 1 now covers the helper endpoint; password-reset/email tests should reuse `LocalEmailOutboxClient`. |
| `PUT /api/v1/orders/{id}/status` and `GET /api/v1/orders/admin` | Documented as ADMIN-only via `@PreAuthorize("hasRole('ROLE_ADMIN')")` — this is method-level security, not filter-chain security. Verify 403 is returned (not 401) for non-admin authenticated users. |
| Password reset endpoints return `429` | `AuthRateLimitGuard` enforces rate limits. These scenarios are documented in the OpenAPI spec but no tests exist. |

---

## Maintenance

### Adding a new endpoint
1. Add a row to the **Endpoint Inventory** table under the appropriate module section.
2. Add it to the **Auth Split** section under the right heading.
3. Add it to the appropriate phase in [`API_TESTS_PHASES.md`](./API_TESTS_PHASES.md) based on complexity, priority, and dependencies.
4. Add recommended scenarios in the **Scenarios** section.
5. Recalculate the **Coverage Summary** table.

### Updating coverage after adding tests
1. Change the `Status` emoji from ⬜ to ✅ (or 🟡 if partial).
2. Fill in `Existing Test File(s)` with the relative path (e.g., `tests/api/products/products.get.api.spec.ts`).
3. Update `Current Coverage` from `None` → `Partial` or `Covered`.
4. Update the matching increment status in [`API_TESTS_PHASES.md`](./API_TESTS_PHASES.md).
5. Recalculate coverage percentages:

```
overall coverage % = covered_endpoints / total_endpoints * 100
auth coverage % = covered_auth_endpoints / total_auth_endpoints * 100
non-auth coverage % = covered_non_auth_endpoints / total_non_auth_endpoints * 100
```

### Coverage rules (for consistency)
- **Covered** = automated tests for happy path + at least one negative/auth/validation scenario present
- **Partial** = some tests exist but important scenario groups are missing (e.g., happy path only, no 401, no validation)
- **None** = no meaningful automated test found for this endpoint

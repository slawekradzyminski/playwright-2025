# API Test Plan — JWT Authentication & Shop Service

This plan is designed to be copy-pasted into your repo (e.g. `/docs/api-test-plan.md`) and updated as you go. It's trackable via checkboxes and keeps naming aligned with your existing `login.api.spec.ts` / `loginClient.ts` pattern. Tooling assumes Playwright Test for API, with one spec file per endpoint and one client per endpoint.

## Goals

- Achieve complete functional coverage of all documented endpoints (31 operations)
- One spec per endpoint: `<operationId>.api.spec.ts`
- One typed client per endpoint: `<operationId>Client.ts`
- Stable, repeatable tests: clear fixtures, data management, and auth flows
- Contract checks against the OpenAPI spec
- Lightweight non-functional checks (p95 latency smoke) on critical endpoints

**Source of truth:** OpenAPI `api-docs.json`. Endpoints include users, products, orders, cart, QR, email, ollama, traffic, etc., with JWT bearer security on most routes.

## Conventions

- **Runner:** Playwright Test (`@playwright/test`) with request fixture
- **Auth:** Re-use `loginClient.ts` to mint tokens; provide `getClientToken(role)` helper
- **Per-endpoint client:** `<operationId>Client.ts` exporting a small typed wrapper (method, URL, DTOs)
- **DTO typing:** Generate types from OpenAPI (e.g. `openapi-typescript`) or hand-rolled minimal interfaces in clients
- **Contract checks:** Validate responses with `ajv` compiled from OpenAPI schemas; assert status codes & content-type
- **Naming:** Exactly match OpenAPI `operationId` (e.g. `getByUsername.api.spec.ts`, `getByUsernameClient.ts`). This keeps parity with `login.*`
- **Tags:** Use `@smoke`, `@regression`, `@admin`, `@contract`, `@perf`

## Definition of Done (per endpoint)

- ✅ Client implemented (`<operationId>Client.ts`)
- ✅ Happy path test(s)
- ✅ Auth & RBAC tests (401 / 403)
- ✅ Validation/negative tests (400 / 422 / 404)
- ✅ Contract assertions (Ajv + schema)
- ✅ Idempotency / side-effects assertions (where relevant)
- ✅ Basic perf smoke (p95 < target; see Perf section)

## Test Data & Roles

- **Users:** admin (`ROLE_ADMIN`), client (`ROLE_CLIENT`)
- **Products:** Seed at least one valid product for cart/order paths
- **Orders:** Created during tests; clean up on teardown
- **Tokens:** Acquire via `/users/signin` login endpoint (already covered)

## Execution Order (recommended)

1. **Auth core:** login, refresh, whoAmI, signup
2. **Users:** getByUsername, edit, delete, getSystemPrompt, updateSystemPrompt, getAll
3. **Products:** getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
4. **Cart:** getCart, addToCart, updateCartItem, removeFromCart, clearCart
5. **Orders:** createOrder, getUserOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus
6. **Other:** createQrCode, sendEmail, getTrafficInfo, ollama (generateText, chat)

*(These correspond to the OpenAPI tags and paths)*

## Coverage Matrix (track progress)

Tick ✅ Spec when the `<operationId>.api.spec.ts` is complete and ✅ Client when `<operationId>Client.ts` is implemented.

| Tag | Method | Path | operationId | Spec | Client |
|-----|--------|------|-------------|------|--------|
| users | POST | `/users/signin` | login | ✅ (existing) | ✅ (existing) |
| users | GET | `/users/refresh` | refresh | [ ] | [ ] |
| users | GET | `/users/me` | whoAmI | [ ] | [ ] |
| users | POST | `/users/signup` | signup | [ ] | [ ] |
| users | GET | `/users` | getAll | [ ] | [ ] |
| users | GET | `/users/{username}` | getByUsername | [ ] | [ ] |
| users | PUT | `/users/{username}` | edit | [ ] | [ ] |
| users | DELETE | `/users/{username}` | delete | [ ] | [ ] |
| users | GET | `/users/{username}/system-prompt` | getSystemPrompt | [ ] | [ ] |
| users | PUT | `/users/{username}/system-prompt` | updateSystemPrompt | [ ] | [ ] |
| Products | GET | `/api/products` | getAllProducts | [ ] | [ ] |
| Products | POST | `/api/products` | createProduct | [ ] | [ ] |
| Products | GET | `/api/products/{id}` | getProductById | [ ] | [ ] |
| Products | PUT | `/api/products/{id}` | updateProduct | [ ] | [ ] |
| Products | DELETE | `/api/products/{id}` | deleteProduct | [ ] | [ ] |
| Cart | GET | `/api/cart` | getCart | [ ] | [ ] |
| Cart | DELETE | `/api/cart` | clearCart | [ ] | [ ] |
| Cart | POST | `/api/cart/items` | addToCart | [ ] | [ ] |
| Cart | PUT | `/api/cart/items/{productId}` | updateCartItem | [ ] | [ ] |
| Cart | DELETE | `/api/cart/items/{productId}` | removeFromCart | [ ] | [ ] |
| Orders | POST | `/api/orders` | createOrder | [ ] | [ ] |
| Orders | GET | `/api/orders` | getUserOrders | [ ] | [ ] |
| Orders | GET | `/api/orders/{id}` | getOrder | [ ] | [ ] |
| Orders | POST | `/api/orders/{id}/cancel` | cancelOrder | [ ] | [ ] |
| Orders (Admin) | GET | `/api/orders/admin` | getAllOrders | [ ] | [ ] |
| Orders (Admin) | PUT | `/api/orders/{id}/status` | updateOrderStatus | [ ] | [ ] |
| QR | POST | `/qr/create` | createQrCode | [ ] | [ ] |
| email | POST | `/email` | sendEmail | [ ] | [ ] |
| Traffic Monitoring | GET | `/api/traffic/info` | getTrafficInfo | [ ] | [ ] |
| ollama | POST | `/api/ollama/generate` | generateText | [ ] | [ ] |
| ollama | POST | `/api/ollama/chat` | chat | [ ] | [ ] |

*All endpoints and operation IDs are taken directly from `api-docs.json`*

**Progress:** 1 / 31 complete (3.2%)

## Per-Endpoint Scenario Catalogue (what to cover)

Below are concise scenario sets. Reuse patterns; implement per endpoint spec.

### Auth

- **login** (`/users/signin`) — already covered. Ensure 200 returns token & user payload, 400 validation, 422 bad creds
- **refresh** — 200 new token; 401 when missing/invalid token. Assert `Authorization: Bearer` required
- **whoAmI** — 200 user payload; 401 unauthenticated
- **signup** — 201 created; 400 validation (e.g., short password, missing required fields)

### Users

- **getAll** — 200 list; 401 when token missing
- **getByUsername** — 200 user; 404 unknown; 401 unauthenticated
- **edit** — 200 updated entity; 404 unknown; 401/403 RBAC (client can edit self? enforce rules as per backend; at minimum 403 for insufficient permissions is documented). Validate `UserEditDto` constraints
- **delete** — 204 on success; 404 unknown; 401/403 as per RBAC
- **getSystemPrompt / updateSystemPrompt** — 200 on get/put; 401/403/404; validate `SystemPromptDto` (max 500)

### Products

- **getAllProducts** — 200 array; 401 unauthenticated. *Perf-smoke candidate*
- **getProductById** — 200 DTO; 404; 401
- **createProduct / updateProduct / deleteProduct** — Admin only: 201/200/204; 400 invalid input, 403 forbidden, 404 not found. Validate numeric price, `stockQuantity >= 0`, name length ≥ 3

### Cart

- **getCart** — 200 cart content; 401
- **addToCart** — 200 cart; 400 invalid, 404 product; 401. Validate `quantity ≥ 1`
- **updateCartItem** — 200 cart; 400 invalid, 404 item; 401
- **removeFromCart** — 200 cart; 404 item; 401
- **clearCart** — 200 cleared; 401. Ensure idempotency (second clear still 200 with empty state)

### Orders

- **createOrder** — 201 with `OrderDto`; 400 invalid input / empty cart; 401. Requires seeded cart. Validate `AddressDto` (zipCode pattern)
- **getUserOrders** — 200 page; support page, size, status filters; 401. Validate paging fields
- **getOrder** — 200, 404, 401. Enforce ownership (non-admin cannot fetch others' orders → expect 403 if backend enforces; at minimum ensure 401/404 as documented)
- **cancelOrder** — 200; 400 cannot cancel (e.g., already shipped); 404; 401. Assert state transition rules
- **getAllOrders (Admin)** — 200 page; 401/403; filter by status
- **updateOrderStatus (Admin)** — 200; 400 invalid transition; 401/403; 404. *Enumerated statuses: PENDING|PAID|SHIPPED|DELIVERED|CANCELLED*

### Other

- **createQrCode** — 200 PNG (`image/png`); 400 invalid; 401. Assert binary non-empty and content-type; test QR text variability
- **sendEmail** — 200; 400 invalid; 401. Validate `EmailDto` required fields
- **getTrafficInfo** — 200 info payload; 401. Validate WebSocket endpoint fields
- **ollama generateText / chat** — 200 SSE stream; 400 invalid; 401; 404 model not found; 500 server error. Assert streaming chunks shape (`done`, `response`), and graceful close

## File Layout (scaffold)

```
/tests/api/
  /clients/
    loginClient.ts                      ✅ (existing)
    refreshClient.ts
    whoAmIClient.ts
    signupClient.ts
    getAllClient.ts
    getByUsernameClient.ts
    editClient.ts
    deleteClient.ts
    getSystemPromptClient.ts
    updateSystemPromptClient.ts
    getAllProductsClient.ts
    createProductClient.ts
    getProductByIdClient.ts
    updateProductClient.ts
    deleteProductClient.ts
    getCartClient.ts
    clearCartClient.ts
    addToCartClient.ts
    updateCartItemClient.ts
    removeFromCartClient.ts
    createOrderClient.ts
    getUserOrdersClient.ts
    getOrderClient.ts
    cancelOrderClient.ts
    getAllOrdersClient.ts
    updateOrderStatusClient.ts
    createQrCodeClient.ts
    sendEmailClient.ts
    getTrafficInfoClient.ts
    generateTextClient.ts
    chatClient.ts

  /specs/
    login.api.spec.ts                   ✅ (existing)
    refresh.api.spec.ts
    whoAmI.api.spec.ts
    signup.api.spec.ts
    getAll.api.spec.ts
    getByUsername.api.spec.ts
    edit.api.spec.ts
    delete.api.spec.ts
    getSystemPrompt.api.spec.ts
    updateSystemPrompt.api.spec.ts
    getAllProducts.api.spec.ts
    createProduct.api.spec.ts
    getProductById.api.spec.ts
    updateProduct.api.spec.ts
    deleteProduct.api.spec.ts
    getCart.api.spec.ts
    clearCart.api.spec.ts
    addToCart.api.spec.ts
    updateCartItem.api.spec.ts
    removeFromCart.api.spec.ts
    createOrder.api.spec.ts
    getUserOrders.api.spec.ts
    getOrder.api.spec.ts
    cancelOrder.api.spec.ts
    getAllOrders.api.spec.ts
    updateOrderStatus.api.spec.ts
    createQrCode.api.spec.ts
    sendEmail.api.spec.ts
    getTrafficInfo.api.spec.ts
    generateText.api.spec.ts
    chat.api.spec.ts
```


*Each spec focuses solely on one endpoint and imports only its matching client.*

## Shared Utilities & Fixtures

- **auth.fixtures.ts:** `getClientToken(role)`, `asAdmin`, `asClient`, `asAnonymous`
- **schemas.ts:** Compile Ajv validators from OpenAPI `components.schemas` for contract assertions
- **data.fixtures.ts:** Product seeding, cart seed/cleanup, order cleanup
- **expectations.ts:** Helpers like `expectUnauthorized`, `expectForbidden`, `expectValidationError`
- **streams.ts:** SSE helper verifying `text/event-stream` and assembling chunks (ollama endpoints)

## Example Acceptance Checklist (copy into each spec)

- ✅ Client implemented & typed
- ✅ 2xx happy path with contract check
- ✅ 4xx/5xx negative paths as per spec
- ✅ RBAC (401/403) as applicable
- ✅ Side-effects verified (DB via API observables)
- ✅ p95 latency ≤ target (perf smoke)

## Risk-Based Priorities

**High:** login, refresh, whoAmI, cart (addToCart, updateCartItem, removeFromCart, getCart, clearCart), orders (createOrder, cancelOrder), products read (getAllProducts, getProductById)

**Medium:** products admin CRUD, users profile/system-prompt, sendEmail, createQrCode

**Lower:** getTrafficInfo, ollama endpoints (unless core to product)

## Non-Functional (quick perf smoke)

Add a minimal k6 smoke for:

- `GET /api/products` (public catalogue view behind auth)
- `GET /api/orders` (user list)

Aim for p95 < 300ms on dev environments; tune per env. Trigger from CI nightly; thresholds only, no load soak.

## CI & Reporting

Run all specs on PR; tag-driven subsets:

- `@smoke` on each push
- Full `@regression` nightly

**Publish:**
- JUnit XML for CI
- HTML report with per-endpoint pass/fail
- Lightweight latency histograms for smoke endpoints

## How to Update Progress

- Tick the checkboxes in the Coverage Matrix and in each spec's Acceptance Checklist
- Update the Progress line at the top of the matrix (e.g. 12 / 31)
- Add notes to Changelog when contracts or behaviour change

## Changelog

**24 Sep 2025** — Plan created. login already covered. Remaining endpoints mapped from OpenAPI

## Notes & gotchas per endpoint family

**RBAC:** Admin-only endpoints (createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus) must assert 403 when using client token

**Validation:** Use OpenAPI min/max/enum:
- `UserRegisterDto.password` min length 8
- `ProductCreateDto.name` min 3
- `UpdateCartItemDto.quantity ≥ 1`
- Order status enum on updates

**SSE:** ollama responses are `text/event-stream`; assert chunk shape (`done`, `response`) and handle 404 model errors via `ModelNotFoundDto`

**Binary:** `/qr/create` returns PNG bytes; assert type and non-zero length

**Paging:** `getUserOrders` & `getAllOrders` accept page, size, status filters; verify `PageDtoOrderDto` fields

---

*If you'd like, I can also generate the client/spec boilerplate for the next few top-priority endpoints to speed you up (e.g., refresh, whoAmI, getAllProducts).*
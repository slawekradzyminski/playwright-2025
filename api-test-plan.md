# API Test Plan

## Goal
Build complete automated API coverage for the OpenAPI spec in `api-docs.json` (40 endpoint-method operations), with clear progress tracking and a repeatable implementation pattern.

## Current Coverage Snapshot
- Implemented and passing:
1. `POST /users/signin`
2. `POST /users/signup`
3. `GET /users/me`
4. `POST /users/password/forgot`
5. `POST /users/password/reset`
6. `POST /users/refresh`
7. `POST /users/logout`
8. `GET /users/chat-system-prompt`
9. `PUT /users/chat-system-prompt`
10. `GET /users/tool-system-prompt`
11. `PUT /users/tool-system-prompt`
12. `GET /local/email/outbox`
13. `DELETE /local/email/outbox`
14. `POST /qr/create`
15. `GET /api/traffic/info`
16. `POST /email`
17. `GET /users`
18. `GET /users/{username}`
19. `PUT /users/{username}`
20. `DELETE /users/{username}`
21. `GET /api/products`
22. `GET /api/products/{id}`
23. `POST /api/products`
24. `PUT /api/products/{id}`
25. `DELETE /api/products/{id}`
- Remaining operations: **15 / 40**

## AI Generation Contract (Mandatory)
For every operation in `api-docs.json`, generate:
1. Exactly one HTTP client helper file (request wrapper).
2. Exactly one dedicated test spec file for that operation.
3. Separate files per method-path combination (`GET` and `POST` on same path are different files).

Use this convention for all new work:
1. HTTP helper: `http/<tag>/<operationId>Request.ts`
2. Test file: `tests/api/<tag>/<operationId>.api.spec.ts`
3. Keep assertions contract-driven from `api-docs.json`:
   - status code
   - `content-type`
   - required response fields
   - validation/error payloads for negative cases

## Test Design Standards
Each operation test should include:
1. Happy path (expected success status and schema checks).
2. Auth check (missing/invalid token) for secured endpoints.
3. Validation/error cases for invalid input.
4. Resource-not-found/forbidden checks where documented (`404`, `403`).
5. Deterministic data generation (faker seeded per test via fixture/hooks, optional `TEST_SEED` override).

## Execution Roadmap
1. Phase 1: Public auth and account bootstrap
   - Finish and harden public `/users/*` and password-reset flows.
2. Phase 2: Authenticated user profile/settings
   - `/users` management and prompt settings endpoints.
3. Phase 3: Core commerce domain
   - Products, cart, orders (+ admin/role checks).
4. Phase 4: Integrations and utilities
   - Email, QR, Ollama, traffic, local outbox.
5. Phase 5: Stabilization
   - Shared assertions/utilities cleanup, flaky test hardening, CI parallelization.

## Phase Backlog (Trackable)
1. Phase 1 (5 ops): `signup`, `login`, `refresh`, `forgotPassword`, `resetPassword`
2. Phase 2 (10 ops): `whoAmI`, `logout`, `getAll` (users), `getByUsername`, `edit`, `delete`, `getChatSystemPrompt`, `updateChatSystemPrompt`, `getToolSystemPrompt`, `updateToolSystemPrompt`
3. Phase 3 (16 ops): all `Products`, `Cart`, and `Orders` operations
4. Phase 4 (9 ops): all `ollama`, `email`, `QR`, `Traffic Monitoring`, and `local-email-outbox` operations
5. Phase 5: hardening pass on all implemented suites

## Definition Of Done (Per Operation)
1. HTTP helper exists and is used by tests (no inline raw request calls except explicit negative auth checks).
2. Spec validates documented success and error responses.
3. Any required preconditions are handled through fixtures/factories (user/product/order setup).
4. Tests are independent and can run in parallel workers.
5. Endpoint spec is included in CI run (`npm run test:api`).

## Recommended Working Path (Easiest -> Hardest)
1. Public auth primitives (no auth setup needed): `signup`, `login`, `forgotPassword`, `resetPassword`, `refresh`
2. Authenticated self endpoints (single-user context): `whoAmI`, `logout`, prompt get/update endpoints
3. Public utility endpoints: local outbox (`getOutbox`, `clearOutbox`)
4. Simple authenticated utilities: `createQrCode`, `getTrafficInfo`, `sendEmail`
5. User management and permissions: `getAll`, `getByUsername`, `edit`, `delete`
6. Products domain (CRUD + role restrictions)
7. Cart domain (depends on products and user auth)
8. Orders domain (depends on cart/product state + admin/user role behavior)
9. Ollama endpoints last (external dependency, most brittle/nondeterministic)

## Progress Tracker (Ordered: Easiest -> Hardest)
Status legend: `[x]` done, `[ ]` pending.

| Status | Operation | Difficulty | HTTP client file | Test file |
|---|---|---|---|---|
| [x] | `POST /users/signup` | Easy | `http/users/signupRequest.ts` | `tests/api/users/register.api.spec.ts` |
| [x] | `POST /users/signin` | Easy | `http/users/loginRequest.ts` | `tests/api/users/login.api.spec.ts` |
| [x] | `POST /users/password/forgot` | Easy | `http/password-reset/forgotPasswordRequest.ts` | `tests/api/password-reset/forgotPassword.api.spec.ts` |
| [x] | `POST /users/password/reset` | Easy | `http/password-reset/resetPasswordRequest.ts` | `tests/api/password-reset/resetPassword.api.spec.ts` |
| [x] | `POST /users/refresh` | Easy | `http/users/refreshRequest.ts` | `tests/api/users/refresh.api.spec.ts` |
| [x] | `GET /users/me` | Easy | `http/users/meRequest.ts` | `tests/api/users/me.api.spec.ts` |
| [x] | `POST /users/logout` | Easy | `http/users/logoutRequest.ts` | `tests/api/users/logout.api.spec.ts` |
| [x] | `GET /users/chat-system-prompt` | Easy | `http/users/getChatSystemPromptRequest.ts` | `tests/api/users/getChatSystemPrompt.api.spec.ts` |
| [x] | `PUT /users/chat-system-prompt` | Easy | `http/users/updateChatSystemPromptRequest.ts` | `tests/api/users/updateChatSystemPrompt.api.spec.ts` |
| [x] | `GET /users/tool-system-prompt` | Easy | `http/users/getToolSystemPromptRequest.ts` | `tests/api/users/getToolSystemPrompt.api.spec.ts` |
| [x] | `PUT /users/tool-system-prompt` | Easy | `http/users/updateToolSystemPromptRequest.ts` | `tests/api/users/updateToolSystemPrompt.api.spec.ts` |
| [x] | `GET /local/email/outbox` | Easy | `http/local-email-outbox/getOutboxRequest.ts` | `tests/api/local-email-outbox/getOutbox.api.spec.ts` |
| [x] | `DELETE /local/email/outbox` | Easy | `http/local-email-outbox/clearOutboxRequest.ts` | `tests/api/local-email-outbox/clearOutbox.api.spec.ts` |
| [x] | `POST /qr/create` | Medium | `http/qr/createQrCodeRequest.ts` | `tests/api/qr/createQrCode.api.spec.ts` |
| [x] | `GET /api/traffic/info` | Medium | `http/traffic-monitoring/getTrafficInfoRequest.ts` | `tests/api/traffic-monitoring/getTrafficInfo.api.spec.ts` |
| [x] | `POST /email` | Medium | `http/email/sendEmailRequest.ts` | `tests/api/email/sendEmail.api.spec.ts` |
| [x] | `GET /users` | Medium | `http/users/getAllRequest.ts` | `tests/api/users/getAll.api.spec.ts` |
| [x] | `GET /users/{username}` | Medium | `http/users/getByUsernameRequest.ts` | `tests/api/users/getByUsername.api.spec.ts` |
| [x] | `PUT /users/{username}` | Medium | `http/users/editRequest.ts` | `tests/api/users/edit.api.spec.ts` |
| [x] | `DELETE /users/{username}` | Medium | `http/users/deleteRequest.ts` | `tests/api/users/delete.api.spec.ts` |
| [x] | `GET /api/products` | Medium | `http/products/getAllProductsRequest.ts` | `tests/api/products/getAllProducts.api.spec.ts` |
| [x] | `GET /api/products/{id}` | Medium | `http/products/getProductByIdRequest.ts` | `tests/api/products/getProductById.api.spec.ts` |
| [x] | `POST /api/products` | Medium | `http/products/createProductRequest.ts` | `tests/api/products/createProduct.api.spec.ts` |
| [x] | `PUT /api/products/{id}` | Medium | `http/products/updateProductRequest.ts` | `tests/api/products/updateProduct.api.spec.ts` |
| [x] | `DELETE /api/products/{id}` | Medium | `http/products/deleteProductRequest.ts` | `tests/api/products/deleteProduct.api.spec.ts` |
| [ ] | `GET /api/cart` | Medium | `http/cart/getCartRequest.ts` | `tests/api/cart/getCart.api.spec.ts` |
| [ ] | `POST /api/cart/items` | Medium | `http/cart/addToCartRequest.ts` | `tests/api/cart/addToCart.api.spec.ts` |
| [ ] | `PUT /api/cart/items/{productId}` | Medium | `http/cart/updateCartItemRequest.ts` | `tests/api/cart/updateCartItem.api.spec.ts` |
| [ ] | `DELETE /api/cart/items/{productId}` | Medium | `http/cart/removeFromCartRequest.ts` | `tests/api/cart/removeFromCart.api.spec.ts` |
| [ ] | `DELETE /api/cart` | Medium | `http/cart/clearCartRequest.ts` | `tests/api/cart/clearCart.api.spec.ts` |
| [ ] | `POST /api/orders` | Hard | `http/orders/createOrderRequest.ts` | `tests/api/orders/createOrder.api.spec.ts` |
| [ ] | `GET /api/orders` | Hard | `http/orders/getUserOrdersRequest.ts` | `tests/api/orders/getUserOrders.api.spec.ts` |
| [ ] | `GET /api/orders/{id}` | Hard | `http/orders/getOrderRequest.ts` | `tests/api/orders/getOrder.api.spec.ts` |
| [ ] | `POST /api/orders/{id}/cancel` | Hard | `http/orders/cancelOrderRequest.ts` | `tests/api/orders/cancelOrder.api.spec.ts` |
| [ ] | `GET /api/orders/admin` | Hard | `http/orders/getAllOrdersRequest.ts` | `tests/api/orders/getAllOrders.api.spec.ts` |
| [ ] | `PUT /api/orders/{id}/status` | Hard | `http/orders/updateOrderStatusRequest.ts` | `tests/api/orders/updateOrderStatus.api.spec.ts` |
| [ ] | `GET /api/ollama/chat/tools/definitions` | Hard | `http/ollama/getToolDefinitionsRequest.ts` | `tests/api/ollama/getToolDefinitions.api.spec.ts` |
| [x] | `POST /api/ollama/generate` | Hard | `http/ollama/generateTextRequest.ts` | `tests/api/ollama/generateText.api.spec.ts` |
| [x] | `POST /api/ollama/chat` | Hard | `http/ollama/chatRequest.ts` | `tests/api/ollama/chat.api.spec.ts` |
| [x] | `POST /api/ollama/chat/tools` | Hard | `http/ollama/chatWithToolsRequest.ts` | `tests/api/ollama/chatWithTools.api.spec.ts` |

# API Test Plan

## Goal
Build complete automated API coverage for the OpenAPI spec in `api-docs.json` (40 endpoint-method operations), with clear progress tracking and a repeatable implementation pattern.

## Current Coverage Snapshot
- Implemented and passing:
1. `POST /users/signin`
2. `POST /users/signup`
3. `GET /users/me`
- Remaining operations: **37 / 40**

## AI Generation Contract (Mandatory)
For every operation in `api-docs.json`, generate:
1. Exactly one HTTP client helper file (request wrapper).
2. Exactly one dedicated test spec file for that operation.
3. Separate files per method-path combination (`GET` and `POST` on same path are different files).

Use this convention for all new work:
1. HTTP helper: `tests/api/http/<operationId>Request.ts`
2. Test file: `tests/api/<operationId>.api.spec.ts`
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
5. Deterministic data generation (faker seeded via existing setup).

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
| [x] | `POST /users/signup` | Easy | `tests/api/http/signupRequest.ts` | `tests/api/register.api.spec.ts` |
| [x] | `POST /users/signin` | Easy | `tests/api/http/loginRequest.ts` | `tests/api/login.api.spec.ts` |
| [x] | `POST /users/password/forgot` | Easy | `tests/api/http/forgotPasswordRequest.ts` | `tests/api/forgotPassword.api.spec.ts` |
| [x] | `POST /users/password/reset` | Easy | `tests/api/http/resetPasswordRequest.ts` | `tests/api/resetPassword.api.spec.ts` |
| [x] | `POST /users/refresh` | Easy | `tests/api/http/refreshRequest.ts` | `tests/api/refresh.api.spec.ts` |
| [x] | `GET /users/me` | Easy | `tests/api/http/meRequest.ts` | `tests/api/me.api.spec.ts` |
| [ ] | `POST /users/logout` | Easy | `tests/api/http/logoutRequest.ts` | `tests/api/logout.api.spec.ts` |
| [ ] | `GET /users/chat-system-prompt` | Easy | `tests/api/http/getChatSystemPromptRequest.ts` | `tests/api/getChatSystemPrompt.api.spec.ts` |
| [ ] | `PUT /users/chat-system-prompt` | Easy | `tests/api/http/updateChatSystemPromptRequest.ts` | `tests/api/updateChatSystemPrompt.api.spec.ts` |
| [ ] | `GET /users/tool-system-prompt` | Easy | `tests/api/http/getToolSystemPromptRequest.ts` | `tests/api/getToolSystemPrompt.api.spec.ts` |
| [ ] | `PUT /users/tool-system-prompt` | Easy | `tests/api/http/updateToolSystemPromptRequest.ts` | `tests/api/updateToolSystemPrompt.api.spec.ts` |
| [ ] | `GET /local/email/outbox` | Easy | `tests/api/http/getOutboxRequest.ts` | `tests/api/getOutbox.api.spec.ts` |
| [ ] | `DELETE /local/email/outbox` | Easy | `tests/api/http/clearOutboxRequest.ts` | `tests/api/clearOutbox.api.spec.ts` |
| [ ] | `POST /qr/create` | Medium | `tests/api/http/createQrCodeRequest.ts` | `tests/api/createQrCode.api.spec.ts` |
| [ ] | `GET /api/traffic/info` | Medium | `tests/api/http/getTrafficInfoRequest.ts` | `tests/api/getTrafficInfo.api.spec.ts` |
| [ ] | `POST /email` | Medium | `tests/api/http/sendEmailRequest.ts` | `tests/api/sendEmail.api.spec.ts` |
| [ ] | `GET /users` | Medium | `tests/api/http/getAllRequest.ts` | `tests/api/getAll.api.spec.ts` |
| [ ] | `GET /users/{username}` | Medium | `tests/api/http/getByUsernameRequest.ts` | `tests/api/getByUsername.api.spec.ts` |
| [ ] | `PUT /users/{username}` | Medium | `tests/api/http/editRequest.ts` | `tests/api/edit.api.spec.ts` |
| [ ] | `DELETE /users/{username}` | Medium | `tests/api/http/deleteRequest.ts` | `tests/api/delete.api.spec.ts` |
| [ ] | `GET /api/products` | Medium | `tests/api/http/getAllProductsRequest.ts` | `tests/api/getAllProducts.api.spec.ts` |
| [ ] | `GET /api/products/{id}` | Medium | `tests/api/http/getProductByIdRequest.ts` | `tests/api/getProductById.api.spec.ts` |
| [ ] | `POST /api/products` | Medium | `tests/api/http/createProductRequest.ts` | `tests/api/createProduct.api.spec.ts` |
| [ ] | `PUT /api/products/{id}` | Medium | `tests/api/http/updateProductRequest.ts` | `tests/api/updateProduct.api.spec.ts` |
| [ ] | `DELETE /api/products/{id}` | Medium | `tests/api/http/deleteProductRequest.ts` | `tests/api/deleteProduct.api.spec.ts` |
| [ ] | `GET /api/cart` | Medium | `tests/api/http/getCartRequest.ts` | `tests/api/getCart.api.spec.ts` |
| [ ] | `POST /api/cart/items` | Medium | `tests/api/http/addToCartRequest.ts` | `tests/api/addToCart.api.spec.ts` |
| [ ] | `PUT /api/cart/items/{productId}` | Medium | `tests/api/http/updateCartItemRequest.ts` | `tests/api/updateCartItem.api.spec.ts` |
| [ ] | `DELETE /api/cart/items/{productId}` | Medium | `tests/api/http/removeFromCartRequest.ts` | `tests/api/removeFromCart.api.spec.ts` |
| [ ] | `DELETE /api/cart` | Medium | `tests/api/http/clearCartRequest.ts` | `tests/api/clearCart.api.spec.ts` |
| [ ] | `POST /api/orders` | Hard | `tests/api/http/createOrderRequest.ts` | `tests/api/createOrder.api.spec.ts` |
| [ ] | `GET /api/orders` | Hard | `tests/api/http/getUserOrdersRequest.ts` | `tests/api/getUserOrders.api.spec.ts` |
| [ ] | `GET /api/orders/{id}` | Hard | `tests/api/http/getOrderRequest.ts` | `tests/api/getOrder.api.spec.ts` |
| [ ] | `POST /api/orders/{id}/cancel` | Hard | `tests/api/http/cancelOrderRequest.ts` | `tests/api/cancelOrder.api.spec.ts` |
| [ ] | `GET /api/orders/admin` | Hard | `tests/api/http/getAllOrdersRequest.ts` | `tests/api/getAllOrders.api.spec.ts` |
| [ ] | `PUT /api/orders/{id}/status` | Hard | `tests/api/http/updateOrderStatusRequest.ts` | `tests/api/updateOrderStatus.api.spec.ts` |
| [ ] | `GET /api/ollama/chat/tools/definitions` | Hard | `tests/api/http/getToolDefinitionsRequest.ts` | `tests/api/getToolDefinitions.api.spec.ts` |
| [ ] | `POST /api/ollama/generate` | Hard | `tests/api/http/generateTextRequest.ts` | `tests/api/generateText.api.spec.ts` |
| [ ] | `POST /api/ollama/chat` | Hard | `tests/api/http/chatRequest.ts` | `tests/api/chat.api.spec.ts` |
| [ ] | `POST /api/ollama/chat/tools` | Hard | `tests/api/http/chatWithToolsRequest.ts` | `tests/api/chatWithTools.api.spec.ts` |

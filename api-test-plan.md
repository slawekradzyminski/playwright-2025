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

## Progress Tracker (Operation Checklist)
Status legend: `[x]` done, `[ ]` pending.

| Status | Operation | Tag | Auth | HTTP client file | Test file |
|---|---|---|---|---|---|
| [ ] | `DELETE /api/cart/items/{productId}` | `Cart` | `yes` | `tests/api/http/removeFromCartRequest.ts` | `tests/api/removeFromCart.api.spec.ts` |
| [ ] | `DELETE /api/cart` | `Cart` | `yes` | `tests/api/http/clearCartRequest.ts` | `tests/api/clearCart.api.spec.ts` |
| [ ] | `DELETE /api/products/{id}` | `Products` | `yes` | `tests/api/http/deleteProductRequest.ts` | `tests/api/deleteProduct.api.spec.ts` |
| [ ] | `DELETE /local/email/outbox` | `local-email-outbox` | `no` | `tests/api/http/clearOutboxRequest.ts` | `tests/api/clearOutbox.api.spec.ts` |
| [ ] | `DELETE /users/{username}` | `users` | `yes` | `tests/api/http/deleteRequest.ts` | `tests/api/delete.api.spec.ts` |
| [ ] | `GET /api/cart` | `Cart` | `yes` | `tests/api/http/getCartRequest.ts` | `tests/api/getCart.api.spec.ts` |
| [ ] | `GET /api/ollama/chat/tools/definitions` | `ollama` | `yes` | `tests/api/http/getToolDefinitionsRequest.ts` | `tests/api/getToolDefinitions.api.spec.ts` |
| [ ] | `GET /api/orders/admin` | `Orders` | `yes` | `tests/api/http/getAllOrdersRequest.ts` | `tests/api/getAllOrders.api.spec.ts` |
| [ ] | `GET /api/orders/{id}` | `Orders` | `yes` | `tests/api/http/getOrderRequest.ts` | `tests/api/getOrder.api.spec.ts` |
| [ ] | `GET /api/orders` | `Orders` | `yes` | `tests/api/http/getUserOrdersRequest.ts` | `tests/api/getUserOrders.api.spec.ts` |
| [ ] | `GET /api/products/{id}` | `Products` | `yes` | `tests/api/http/getProductByIdRequest.ts` | `tests/api/getProductById.api.spec.ts` |
| [ ] | `GET /api/products` | `Products` | `yes` | `tests/api/http/getAllProductsRequest.ts` | `tests/api/getAllProducts.api.spec.ts` |
| [ ] | `GET /api/traffic/info` | `Traffic Monitoring` | `yes` | `tests/api/http/getTrafficInfoRequest.ts` | `tests/api/getTrafficInfo.api.spec.ts` |
| [ ] | `GET /local/email/outbox` | `local-email-outbox` | `no` | `tests/api/http/getOutboxRequest.ts` | `tests/api/getOutbox.api.spec.ts` |
| [ ] | `GET /users/chat-system-prompt` | `users` | `yes` | `tests/api/http/getChatSystemPromptRequest.ts` | `tests/api/getChatSystemPrompt.api.spec.ts` |
| [ ] | `GET /users/tool-system-prompt` | `users` | `yes` | `tests/api/http/getToolSystemPromptRequest.ts` | `tests/api/getToolSystemPrompt.api.spec.ts` |
| [ ] | `GET /users/{username}` | `users` | `yes` | `tests/api/http/getByUsernameRequest.ts` | `tests/api/getByUsername.api.spec.ts` |
| [ ] | `GET /users` | `users` | `yes` | `tests/api/http/getAllRequest.ts` | `tests/api/getAll.api.spec.ts` |
| [ ] | `POST /api/cart/items` | `Cart` | `yes` | `tests/api/http/addToCartRequest.ts` | `tests/api/addToCart.api.spec.ts` |
| [ ] | `POST /api/ollama/chat/tools` | `ollama` | `yes` | `tests/api/http/chatWithToolsRequest.ts` | `tests/api/chatWithTools.api.spec.ts` |
| [ ] | `POST /api/ollama/chat` | `ollama` | `yes` | `tests/api/http/chatRequest.ts` | `tests/api/chat.api.spec.ts` |
| [ ] | `POST /api/ollama/generate` | `ollama` | `yes` | `tests/api/http/generateTextRequest.ts` | `tests/api/generateText.api.spec.ts` |
| [ ] | `POST /api/orders/{id}/cancel` | `Orders` | `yes` | `tests/api/http/cancelOrderRequest.ts` | `tests/api/cancelOrder.api.spec.ts` |
| [ ] | `POST /api/orders` | `Orders` | `yes` | `tests/api/http/createOrderRequest.ts` | `tests/api/createOrder.api.spec.ts` |
| [ ] | `POST /api/products` | `Products` | `yes` | `tests/api/http/createProductRequest.ts` | `tests/api/createProduct.api.spec.ts` |
| [ ] | `POST /email` | `email` | `yes` | `tests/api/http/sendEmailRequest.ts` | `tests/api/sendEmail.api.spec.ts` |
| [ ] | `POST /qr/create` | `QR` | `yes` | `tests/api/http/createQrCodeRequest.ts` | `tests/api/createQrCode.api.spec.ts` |
| [ ] | `POST /users/logout` | `users` | `yes` | `tests/api/http/logoutRequest.ts` | `tests/api/logout.api.spec.ts` |
| [ ] | `POST /users/password/forgot` | `password-reset` | `no` | `tests/api/http/forgotPasswordRequest.ts` | `tests/api/forgotPassword.api.spec.ts` |
| [ ] | `POST /users/password/reset` | `password-reset` | `no` | `tests/api/http/resetPasswordRequest.ts` | `tests/api/resetPassword.api.spec.ts` |
| [ ] | `POST /users/refresh` | `users` | `no` | `tests/api/http/refreshRequest.ts` | `tests/api/refresh.api.spec.ts` |
| [ ] | `PUT /api/cart/items/{productId}` | `Cart` | `yes` | `tests/api/http/updateCartItemRequest.ts` | `tests/api/updateCartItem.api.spec.ts` |
| [ ] | `PUT /api/orders/{id}/status` | `Orders` | `yes` | `tests/api/http/updateOrderStatusRequest.ts` | `tests/api/updateOrderStatus.api.spec.ts` |
| [ ] | `PUT /api/products/{id}` | `Products` | `yes` | `tests/api/http/updateProductRequest.ts` | `tests/api/updateProduct.api.spec.ts` |
| [ ] | `PUT /users/chat-system-prompt` | `users` | `yes` | `tests/api/http/updateChatSystemPromptRequest.ts` | `tests/api/updateChatSystemPrompt.api.spec.ts` |
| [ ] | `PUT /users/tool-system-prompt` | `users` | `yes` | `tests/api/http/updateToolSystemPromptRequest.ts` | `tests/api/updateToolSystemPrompt.api.spec.ts` |
| [ ] | `PUT /users/{username}` | `users` | `yes` | `tests/api/http/editRequest.ts` | `tests/api/edit.api.spec.ts` |
| [x] | `GET /users/me` | `users` | `yes` | `tests/api/http/meRequest.ts` | `tests/api/me.api.spec.ts` |
| [x] | `POST /users/signin` | `users` | `no` | `tests/api/http/loginRequest.ts` | `tests/api/login.api.spec.ts` |
| [x] | `POST /users/signup` | `users` | `no` | `tests/api/http/signupRequest.ts` | `tests/api/register.api.spec.ts` |

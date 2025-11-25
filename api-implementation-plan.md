# API Implementation Plan

This plan covers every endpoint listed in `api-docs.json`, records what already has automated API coverage, and defines the next actionable task for each missing test. Endpoints are ordered from the simplest (top) to the most complex (bottom) so that the hardest flows are deferred until last. Status codes:

- `DONE` – automated coverage exists (see noted spec file)
- `TODO` – coverage missing; notes describe the next verifiable behavior to implement
- `LATE` – intentionally deferred complex scenarios to finish after everything else


## Completed Endpoints

| Order | Method & Endpoint | Status | Coverage / Next Step |
| --- | --- | --- | --- |
| 1 | `POST /users/signup` | DONE | Exercised by `tests/api/users/signup.api.spec.ts`; covers happy path, duplicate data, and validation branches. |
| 2 | `POST /users/signin` | DONE | Exercised by `tests/api/users/login.api.spec.ts`; validates token issuance and error states. |
| 3 | `GET /users` | DONE | Exercised by `tests/api/users/users.api.spec.ts`; verifies auth and payload schema. |
| 4 | `GET /users/me` | DONE | Exercised by `tests/api/users/getUsersMe.api.spec.ts`; validates both client/admin tokens and 401 paths. |
| 5 | `GET /users/refresh` | DONE | Exercised by `tests/api/users/getUsersRefresh.api.spec.ts`; ensures refreshed JWT is returned and 401 errors. |
| 6 | `GET /users/system-prompt` | DONE | Exercised by `tests/api/users/getSystemPrompt.api.spec.ts`; covers null and existing prompts plus 401 cases. |
| 7 | `PUT /users/system-prompt` | DONE | Exercised by `tests/api/users/updateSystemPrompt.api.spec.ts`; covers happy path and 401 cases. |
| 8 | `GET /users/{username}` | DONE | Exercised by `tests/api/users/getUserByUsername.api.spec.ts`; covers own-profile, admin lookup, and 401/404 paths. |
| 9 | `PUT /users/{username}` | DONE | Exercised by `tests/api/users/updateUser.api.spec.ts`; checks client self-edit, admin edit, and error branches. |
| 10 | `DELETE /users/{username}` | DONE | Exercised by `tests/api/users/deleteUser.api.spec.ts`; covers admin deletes plus 401/403/404 cases. |
| 14 | `GET /api/products` | DONE | Exercised by `tests/api/products/getProducts.api.spec.ts`; seeds catalog via admin and validates 200 plus 401 cases. |
| 15 | `POST /api/products` | DONE | Exercised by `tests/api/products/createProduct.api.spec.ts`; covers happy path, validation, and auth failures. |
| 16 | `GET /api/products/{id}` | DONE | Exercised by `tests/api/products/getProductById.api.spec.ts`; verifies retrieval, 401 paths, and 404 missing product. |
| 17 | `PUT /api/products/{id}` | DONE | Exercised by `tests/api/products/updateProduct.api.spec.ts`; covers admin update, validation error, auth, and forbidden cases. |
| 18 | `DELETE /api/products/{id}` | DONE | Exercised by `tests/api/products/deleteProduct.api.spec.ts`; ensures admin delete plus 401/403/404 flows. |
| 19 | `GET /api/cart` | DONE | Exercised by `tests/api/cart/getCart.api.spec.ts`; confirms empty cart response plus 401 cases. |
| 20 | `DELETE /api/cart` | DONE | Exercised by `tests/api/cart/deleteCart.api.spec.ts`; seeds items, clears cart, and checks 401 paths. |
| 21 | `POST /api/cart/items` | DONE | Exercised by `tests/api/cart/postCartItems.api.spec.ts`; covers add, quantity merge, validation, and auth errors. |
| 22 | `PUT /api/cart/items/{productId}` | DONE | Exercised by `tests/api/cart/updateCartItem.api.spec.ts`; verifies quantity updates plus 400/401/404 cases. |
| 23 | `DELETE /api/cart/items/{productId}` | DONE | Exercised by `tests/api/cart/deleteCartItem.api.spec.ts`; ensures removal behavior and auth/not-found handling. |
| 24 | `POST /api/orders` | DONE | Covered by `tests/api/orders/createOrder.api.spec.ts`; seeds cart, asserts 201 payload, empty cart 400, and missing token 401. |
| 25 | `GET /api/orders` | DONE | Covered by `tests/api/orders/getOrders.api.spec.ts`; validates own order listing, status filter, and 401 when unauthenticated. |
| 26 | `GET /api/orders/{id}` | DONE | Covered by `tests/api/orders/getOrderById.api.spec.ts`; owner/admin happy paths plus 401, cross-user 404, and missing order 404. |
| 27 | `GET /api/orders/admin` | DONE | Covered by `tests/api/orders/getAdminOrders.api.spec.ts`; admin listing, filtering, and 401/403 failures. |
| 28 | `POST /api/orders/{id}/cancel` | DONE | Covered by `tests/api/orders/cancelOrder.api.spec.ts`; happy path, double cancel 400, 401, 404, and fixme documenting missing 403 protection. |
| 29 | `PUT /api/orders/{id}/status` | DONE | Covered by `tests/api/orders/updateOrderStatus.api.spec.ts`; admin update, invalid status 400, 401/403 cases, and missing order 404. |

## Remaining Endpoints (TODO / LATE)

| Order | Method & Endpoint | Status | Coverage / Next Step |
| --- | --- | --- | --- |
| 11 | `POST /email` | TODO | Draft tests that send a basic templated payload, assert success per spec, and check validation for missing recipients. |
| 12 | `POST /qr/create` | TODO | Add coverage that posts the documented payload and asserts the QR artifact URL or bytes are returned, plus validation failure for malformed content. |
| 13 | `GET /api/traffic/info` | TODO | Simple auth-only fetch verifying structure of `TrafficInfoDto` (requests, errors, timestamp) and 401 behavior. |
| 30 | `POST /api/ollama/chat` | LATE | Hardest: responses may be long/async. Plan to stabilize by capturing deterministic prompt/response pairs or by mocking upstream service before adding assertions. |
| 31 | `POST /api/ollama/generate` | LATE | Hardest: streaming/generative output. Approach similarly to chat endpoint and run last once mocking strategy is defined. |

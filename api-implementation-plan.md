# API Implementation Plan

This plan covers every endpoint listed in `api-docs.json`, records what already has automated API coverage, and defines the next actionable task for each missing test. Endpoints are ordered from the simplest (top) to the most complex (bottom) so that the hardest flows are deferred until last. Status codes:

- `DONE` – automated coverage exists (see noted spec file)
- `TODO` – coverage missing; notes describe the next verifiable behavior to implement
- `LATE` – intentionally deferred complex scenarios to finish after everything else

| Order | Method & Endpoint | Status | Coverage / Next Step |
| --- | --- | --- | --- |
| 1 | `POST /users/signup` | DONE | Exercised by `tests/api/signup.api.spec.ts`; covers happy path, duplicate data, and validation branches. |
| 2 | `POST /users/signin` | DONE | Exercised by `tests/api/login.api.spec.ts`; validates token issuance and error states. |
| 3 | `GET /users` | DONE | Exercised by `tests/api/users.api.spec.ts`; verifies auth and payload schema. |
| 4 | `GET /users/me` | DONE | Exercised by `tests/api/getUsersMe.api.spec.ts`; validates both client/admin tokens and 401 paths. |
| 5 | `GET /users/refresh` | DONE | Exercised by `tests/api/getUsersRefresh.api.spec.ts`; ensures refreshed JWT is returned and 401 errors. |
| 6 | `GET /users/system-prompt` | DONE | Exercised by `tests/api/getSystemPrompt.api.spec.ts`; covers null and existing prompts plus 401 cases. |
| 7 | `PUT /users/system-prompt` | DONE | Exercised by `tests/api/updateSystemPrompt.api.spec.ts`; covers happy path and 401 cases. |
| 8 | `GET /users/{username}` | DONE | Exercised by `tests/api/getUserByUsername.api.spec.ts`; covers own-profile, admin lookup, and 401/404 paths. |
| 9 | `PUT /users/{username}` | DONE | Exercised by `tests/api/updateUser.api.spec.ts`; checks client self-edit, admin edit, and error branches. |
| 10 | `DELETE /users/{username}` | DONE | Exercised by `tests/api/deleteUser.api.spec.ts`; covers admin deletes plus 401/403/404 cases. |
| 11 | `POST /email` | TODO | Draft tests that send a basic templated payload, assert success per spec, and check validation for missing recipients. |
| 12 | `POST /qr/create` | TODO | Add coverage that posts the documented payload and asserts the QR artifact URL or bytes are returned, plus validation failure for malformed content. |
| 13 | `GET /api/traffic/info` | TODO | Simple auth-only fetch verifying structure of `TrafficInfoDto` (requests, errors, timestamp) and 401 behavior. |
| 14 | `GET /api/products` | DONE | Exercised by `tests/api/getProducts.api.spec.ts`; seeds catalog via admin and validates 200 plus 401 cases. |
| 15 | `POST /api/products` | DONE | Exercised by `tests/api/createProduct.api.spec.ts`; covers happy path, validation, and auth failures. |
| 16 | `GET /api/products/{id}` | DONE | Exercised by `tests/api/getProductById.api.spec.ts`; verifies retrieval, 401 paths, and 404 missing product. |
| 17 | `PUT /api/products/{id}` | DONE | Exercised by `tests/api/updateProduct.api.spec.ts`; covers admin update, validation error, auth, and forbidden cases. |
| 18 | `DELETE /api/products/{id}` | DONE | Exercised by `tests/api/deleteProduct.api.spec.ts`; ensures admin delete plus 401/403/404 flows. |
| 19 | `GET /api/cart` | DONE | Exercised by `tests/api/getCart.api.spec.ts`; confirms empty cart response plus 401 cases. |
| 20 | `DELETE /api/cart` | DONE | Exercised by `tests/api/deleteCart.api.spec.ts`; seeds items, clears cart, and checks 401 paths. |
| 21 | `POST /api/cart/items` | DONE | Exercised by `tests/api/postCartItems.api.spec.ts`; covers add, quantity merge, validation, and auth errors. |
| 22 | `PUT /api/cart/items/{productId}` | DONE | Exercised by `tests/api/updateCartItem.api.spec.ts`; verifies quantity updates plus 400/401/404 cases. |
| 23 | `DELETE /api/cart/items/{productId}` | DONE | Exercised by `tests/api/deleteCartItem.api.spec.ts`; ensures removal behavior and auth/not-found handling. |
| 24 | `POST /api/orders` | TODO | Seed cart then submit `AddressDto`; verify 201 with order number and 400 for empty cart. |
| 25 | `GET /api/orders` | TODO | Assert paginated list returns only the caller's orders and supports status filter; include 401 case. |
| 26 | `GET /api/orders/{id}` | TODO | Validate owner (or admin) can fetch order details and others receive 403/404. |
| 27 | `GET /api/orders/admin` | TODO | Admin-only view of all orders; include 403 when using client token. |
| 28 | `POST /api/orders/{id}/cancel` | TODO | After creating order in PENDING status, verify client can cancel once, cannot cancel twice, and receives 403 for others. |
| 29 | `PUT /api/orders/{id}/status` | TODO | Admin workflow to transition statuses (e.g., PENDING→PAID); cover invalid transitions returning 400. |
| 30 | `POST /api/ollama/chat` | LATE | Hardest: responses may be long/async. Plan to stabilize by capturing deterministic prompt/response pairs or by mocking upstream service before adding assertions. |
| 31 | `POST /api/ollama/generate` | LATE | Hardest: streaming/generative output. Approach similarly to chat endpoint and run last once mocking strategy is defined. |

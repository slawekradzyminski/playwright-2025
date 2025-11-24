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
| 4 | `GET /users/me` | TODO | Add test ensuring both client/admin tokens return the authenticated profile and that missing tokens are rejected (per `UsersController#getCurrentUser`). |
| 5 | `GET /users/refresh` | TODO | Validate that a valid refresh token returns a new JWT and that expired/invalid tokens fail with 401. |
| 6 | `GET /users/system-prompt` | DONE | Exercised by `tests/api/getSystemPrompt.api.spec.ts`; covers null and existing prompts plus 401 cases. |
| 7 | `PUT /users/system-prompt` | DONE | Exercised by `tests/api/updateSystemPrompt.api.spec.ts`; covers happy path and 401 cases. |
| 8 | `GET /users/{username}` | TODO | Cover admin-only lookup of arbitrary users plus 404 for unknown usernames; reuse signup helper for setup. |
| 9 | `PUT /users/{username}` | DONE | Exercised by `tests/api/updateUser.api.spec.ts`; checks client self-edit, admin edit, and error branches. |
| 10 | `DELETE /users/{username}` | TODO | Verify admin can delete arbitrary users, client can delete self (if allowed), and proper 401/403/404 responses. |
| 11 | `POST /email` | TODO | Draft tests that send a basic templated payload, assert success per spec, and check validation for missing recipients. |
| 12 | `POST /qr/create` | TODO | Add coverage that posts the documented payload and asserts the QR artifact URL or bytes are returned, plus validation failure for malformed content. |
| 13 | `GET /api/traffic/info` | TODO | Simple auth-only fetch verifying structure of `TrafficInfoDto` (requests, errors, timestamp) and 401 behavior. |
| 14 | `GET /api/products` | TODO | Add coverage for pagination parameters and ensure 200 payload matches `ProductDto` array; include 401 for missing token if required. |
| 15 | `POST /api/products` | DONE | Exercised by `tests/api/createProduct.api.spec.ts`; covers happy path, validation, and auth failures. |
| 16 | `GET /api/products/{id}` | TODO | Create a product, then verify retrieval works for clients/admins and returns 404 for invalid IDs. |
| 17 | `PUT /api/products/{id}` | TODO | Ensure admin can update mutable fields, include validation errors (price, stock), and assert 403 for client token. |
| 18 | `DELETE /api/products/{id}` | TODO | Verify only admins can delete and that deleting removes the product (follow-up GET returns 404). |
| 19 | `GET /api/cart` | TODO | Assert client token returns cart contents reflecting previously added items and that unauthenticated requests fail. |
| 20 | `DELETE /api/cart` | TODO | After seeding cart items, ensure clearing the cart empties item list and total, and returns 200. |
| 21 | `POST /api/cart/items` | TODO | Add coverage for adding an item (requires existing product), handling duplicates by increasing qty, and invalid quantities. |
| 22 | `PUT /api/cart/items/{productId}` | TODO | Verify updating quantity adjusts totals, includes 404 for missing product in cart, and 400 for invalid qty. |
| 23 | `DELETE /api/cart/items/{productId}` | TODO | Ensure removing a specific item leaves others intact; include 404 for not-in-cart product. |
| 24 | `POST /api/orders` | TODO | Seed cart then submit `AddressDto`; verify 201 with order number and 400 for empty cart. |
| 25 | `GET /api/orders` | TODO | Assert paginated list returns only the caller's orders and supports status filter; include 401 case. |
| 26 | `GET /api/orders/{id}` | TODO | Validate owner (or admin) can fetch order details and others receive 403/404. |
| 27 | `GET /api/orders/admin` | TODO | Admin-only view of all orders; include 403 when using client token. |
| 28 | `POST /api/orders/{id}/cancel` | TODO | After creating order in PENDING status, verify client can cancel once, cannot cancel twice, and receives 403 for others. |
| 29 | `PUT /api/orders/{id}/status` | TODO | Admin workflow to transition statuses (e.g., PENDING→PAID); cover invalid transitions returning 400. |
| 30 | `POST /api/ollama/chat` | LATE | Hardest: responses may be long/async. Plan to stabilize by capturing deterministic prompt/response pairs or by mocking upstream service before adding assertions. |
| 31 | `POST /api/ollama/generate` | LATE | Hardest: streaming/generative output. Approach similarly to chat endpoint and run last once mocking strategy is defined. |

# API Test Plan :)

This plan tracks Playwright API coverage for the backend described by `api-docs.json`.
Before adding tests for any endpoint, explore the endpoint with `curl`, then automate it using the existing client/helper style.

## Working Rules

- Run `npm run test:api` after changing API tests.
- Keep tests inside each spec ordered by expected status code ascending: `200`, `201`, `202`, `204`, `400`, `401`, `403`, `404`, `422`, `429`, `500`.
- Use the `// given`, `// when`, `// then` pattern.
- Prefer endpoint-specific HTTP clients over raw `request` calls in specs.
- Assert both status code and response contract. For state-changing tests, also assert the follow-up state.
- Use seeded demo data only when it is stable. For ownership-sensitive scenarios, create fresh users/products/cart state in the test.
- Admin API tests should use `tests/api/fixtures/adminAuthFixture.ts`. The seeded admin is a shared actor, not shared mutable data.
- Admin tests can run in parallel only when they are read-only or each test creates and cleans up its own data.
- Admin tests that mutate shared seeded data or depend on ordered transitions must use `test.describe.configure({ mode: 'serial' })` and include `@serial-admin` in the describe title.

## Status Legend

| Status | Meaning |
| --- | --- |
| DONE | Test coverage already exists |
| NEXT | Best next candidate |
| TODO | Not started yet |
| BLOCKED | Depends on missing test data, environment, role setup, or another endpoint |

## Coverage Snapshot

| Status | Endpoint count |
| --- | ---: |
| DONE | 22 |
| NEXT | 2 |
| TODO | 19 |
| BLOCKED | 0 |
| Total | 43 |

Already covered:

- `POST /api/v1/users/signup`
- `POST /api/v1/users/signin`
- `GET /api/v1/users/me`
- `POST /api/v1/users/refresh`
- `POST /api/v1/users/logout`
- `GET /api/v1/users`
- `GET /api/v1/users/{username}`
- `PUT /api/v1/users/{username}`
- `DELETE /api/v1/users/{username}`
- `GET /api/v1/users/chat-system-prompt`
- `PUT /api/v1/users/chat-system-prompt`
- `GET /api/v1/users/tool-system-prompt`
- `PUT /api/v1/users/tool-system-prompt`
- `GET /api/v1/products`
- `GET /api/v1/products/{id}`
- `POST /api/v1/products`
- `PUT /api/v1/products/{id}`
- `DELETE /api/v1/products/{id}`
- `GET /api/v1/cart`
- `DELETE /api/v1/cart`
- `POST /api/v1/cart/items`
- `GET /api/v1/orders/admin`

## Recommended Delivery Order

The original phase list was close, but the first useful milestone should build reusable infrastructure for the rest of the suite: token refresh/logout, admin auth, products, and cart setup. After that, orders become much cheaper and less brittle.

1. **Auth lifecycle and helpers** :)
   Finish refresh/logout/password reset and add reusable helpers for client and admin users.
2. **Products as test fixtures**
   Cover product read paths first, then admin-only create/update/delete. Product fixtures unlock cart and order tests.
3. **Cart lifecycle**
   Validate empty cart, add/update/remove/clear, and missing-product/item behavior.
4. **Orders**
   Cover create/list/detail/cancel, then admin list/status transitions.
5. **User management and prompts**
   Cover user list/detail/update/delete and prompt preferences after auth/admin helpers exist.
6. **Email observability**
   Test password reset side effects through local outbox and `/me/email-events`.
7. **Utility and monitoring**
   Add QR and traffic-monitoring tests.
8. **Ollama streaming**
   Keep this later because it depends on external model availability and needs deterministic stream helpers.

## Endpoint Inventory

| ID | Phase | Area | Method | Endpoint | Auth | Expected status order | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AUTH-001 | 1 | Users | POST | `/api/v1/users/signin` | No | `200`, `400`, `422`, `429` | High | DONE | Covered for valid login, validation, and invalid credentials. |
| AUTH-002 | 1 | Users | POST | `/api/v1/users/signup` | No | `201`, `400`, `429` | High | DONE | Covered for registration, duplicate username/email, and validation. |
| AUTH-003 | 1 | Users | POST | `/api/v1/users/refresh` | No | `200`, `401`, `429` | High | DONE | Covered token rotation, invalid token, and already rotated token. |
| AUTH-004 | 1 | Users | POST | `/api/v1/users/logout` | Yes | `200`, `401` | High | DONE | Covered authenticated logout, refresh token revocation, and missing JWT. |
| AUTH-005 | 1 | Password Reset | POST | `/api/v1/users/password/forgot` | No | `202`, `400`, `429` | High | NEXT | Use local outbox in local profile to verify reset email side effect. |
| AUTH-006 | 1 | Password Reset | POST | `/api/v1/users/password/reset` | No | `200`, `400`, `429` | High | NEXT | Validate valid token, invalid token, password mismatch, and token reuse. |
| USER-001 | 5 | Users | GET | `/api/v1/users/me` | Yes | `200`, `401` | High | DONE | Covered authenticated self endpoint. |
| USER-002 | 5 | Users | GET | `/api/v1/users` | Yes | `200`, `401` | Medium | DONE | Covered authenticated client list response shape and missing JWT. Avoid exact global count assertions. |
| USER-003 | 5 | Users | GET | `/api/v1/users/{username}` | Yes | `200`, `401`, `404` | Medium | DONE | Covered existing generated user, missing JWT, and missing username. |
| USER-004 | 5 | Users | PUT | `/api/v1/users/{username}` | Yes | `200`, `401`, `403`, `404` | High | DONE | Covered self update, admin update of generated user, forbidden client update, and missing username with valid `UserEditDto`. |
| USER-005 | 5 | Users | DELETE | `/api/v1/users/{username}` | Yes | `204`, `401`, `403`, `404` | High | DONE | Covered admin delete of generated user, missing JWT, client forbidden, and missing username. |
| USER-006 | 5 | Users | GET | `/api/v1/users/chat-system-prompt` | Yes | `200`, `401` | Medium | DONE | Covered effective fallback retrieval after blanking the prompt and missing JWT. |
| USER-007 | 5 | Users | PUT | `/api/v1/users/chat-system-prompt` | Yes | `200`, `400`, `401` | Medium | DONE | Covered update persistence, max-length validation, and missing JWT. |
| USER-008 | 5 | Users | GET | `/api/v1/users/tool-system-prompt` | Yes | `200`, `401` | Medium | DONE | Covered authenticated prompt retrieval and missing JWT. |
| USER-009 | 5 | Users | PUT | `/api/v1/users/tool-system-prompt` | Yes | `200`, `400`, `401` | Medium | DONE | Covered update persistence, max-length validation, and missing JWT. |
| USER-010 | 6 | Email Events | GET | `/api/v1/users/me/email-events` | Yes | `200`, `401` | Medium | TODO | Best tested after password reset or email send scenarios create events. |
| PROD-001 | 2 | Products | GET | `/api/v1/products` | Yes | `200`, `401` | High | DONE | Covered authenticated product list and missing JWT. |
| PROD-002 | 2 | Products | GET | `/api/v1/products/{id}` | Yes | `200`, `401`, `404` | High | DONE | Covered existing product, missing JWT, and missing product. |
| PROD-003 | 2 | Products | POST | `/api/v1/products` | Yes | `201`, `400`, `401`, `403` | High | DONE | Covered admin create with generated disposable product, validation, missing JWT, and client forbidden. |
| PROD-004 | 2 | Products | PUT | `/api/v1/products/{id}` | Yes | `200`, `400`, `401`, `403`, `404` | High | DONE | Covered admin update against generated test-owned products only. |
| PROD-005 | 2 | Products | DELETE | `/api/v1/products/{id}` | Yes | `204`, `401`, `403`, `404` | High | DONE | Covered admin delete against generated test-owned products and follow-up `404`. |
| CART-001 | 3 | Cart | GET | `/api/v1/cart` | Yes | `200`, `401` | High | DONE | Covered empty cart for fresh user and missing JWT. |
| CART-002 | 3 | Cart | POST | `/api/v1/cart/items` | Yes | `200`, `400`, `401`, `404` | High | DONE | Covered add valid item, invalid quantity, missing JWT, and missing product. |
| CART-003 | 3 | Cart | PUT | `/api/v1/cart/items/{productId}` | Yes | `200`, `400`, `401`, `404` | High | TODO | Validate quantity updates. Curl-check whether quantity `0` clears or fails. |
| CART-004 | 3 | Cart | DELETE | `/api/v1/cart/items/{productId}` | Yes | `200`, `401`, `404` | High | TODO | Validate remove existing and non-existing item. |
| CART-005 | 3 | Cart | DELETE | `/api/v1/cart` | Yes | `204`, `401` | High | DONE | Covered clear behavior and missing JWT. |
| ORDER-001 | 4 | Orders | POST | `/api/v1/orders` | Yes | `201`, `400`, `401` | High | TODO | Requires populated cart and valid address payload. |
| ORDER-002 | 4 | Orders | GET | `/api/v1/orders` | Yes | `200`, `401` | High | TODO | Validate paging, default values, and status filter. |
| ORDER-003 | 4 | Orders | GET | `/api/v1/orders/{id}` | Yes | `200`, `401`, `404` | High | TODO | Validate owner/admin access and missing order. |
| ORDER-004 | 4 | Orders | POST | `/api/v1/orders/{id}/cancel` | Yes | `200`, `400`, `401`, `403`, `404` | High | TODO | Validate allowed and forbidden status transitions. |
| ORDER-005 | 4 | Orders | GET | `/api/v1/orders/admin` | Yes | `200`, `401`, `403` | High | DONE | Covered admin shape-based response, missing JWT, and client forbidden. Avoid exact global count assertions. |
| ORDER-006 | 4 | Orders | PUT | `/api/v1/orders/{id}/status` | Yes | `200`, `400`, `401`, `403`, `404` | High | TODO | Admin-only. Validate valid and invalid transitions. |
| EMAIL-001 | 6 | Email | POST | `/api/v1/email` | Yes | `200`, `400`, `401`, `429` | Medium | TODO | Validate send flow, validation, rate limit, and event/outbox side effects. |
| EMAIL-002 | 6 | Local Email Outbox | GET | `/local/email/outbox` | No | `200` | Medium | TODO | Local profile only. Use after email-triggering actions. |
| EMAIL-003 | 6 | Local Email Outbox | DELETE | `/local/email/outbox` | No | `200`, `500` | Low | TODO | Local profile only. Clear before password/email side-effect tests. |
| UTIL-001 | 7 | QR | POST | `/api/v1/qr/create` | Yes | `200`, `400`, `401`, `429` | Medium | TODO | Validate PNG response headers/body and invalid text. |
| MON-001 | 7 | Traffic Monitoring | GET | `/api/v1/traffic/info` | No | `200` | Low | TODO | Validate stable info contract. |
| MON-002 | 7 | Traffic Monitoring | GET | `/api/v1/traffic/logs` | No | `200` | Low | TODO | Validate paging, filters, and max page size behavior. |
| MON-003 | 7 | Traffic Monitoring | GET | `/api/v1/traffic/logs/{correlationId}` | No | `200`, `404` | Low | TODO | Generate a known traffic entry first, then verify detail lookup. |
| OLLAMA-001 | 8 | Ollama | GET | `/api/v1/ollama/chat/tools/definitions` | Yes | `200`, `401` | Medium | TODO | Start Ollama coverage here because it does not require a running model. |
| OLLAMA-002 | 8 | Ollama | POST | `/api/v1/ollama/generate` | Yes | `200`, `400`, `401`, `404`, `500` | Medium | TODO | Validate streamed response, invalid model, invalid payload, and backend failure mapping. |
| OLLAMA-003 | 8 | Ollama | POST | `/api/v1/ollama/chat` | Yes | `200`, `400`, `401`, `404`, `500` | Medium | TODO | Validate streamed stateless chat behavior. |
| OLLAMA-004 | 8 | Ollama | POST | `/api/v1/ollama/chat/tools` | Yes | `200`, `400`, `401`, `500` | Medium | TODO | Validate tool-enabled streaming chat with deterministic assertions. |

## Phase Checklists

### Phase 1: Auth Lifecycle :)

Goal: prove user creation, login, refresh, logout, and password reset are stable enough to support the rest of the suite.

Recommended coverage:

- Refresh token happy path.
- Invalid, missing, and reused refresh token.
- Logout revokes the server-side refresh token.
- Forgot password returns `202` and creates a local outbox email in local profile.
- Reset password accepts a valid token and rejects invalid/reused tokens.
- Rate-limit scenarios only when they can be deterministic and isolated.

Exit criteria:

- Client and admin auth helpers are reusable.
- Tests can create fresh authenticated users without relying on shared state.
- Password reset side effects are observable without manual inspection.

### Phase 2: Products As Fixtures

Goal: make product lookup and admin product setup reliable before testing carts and orders.

Recommended coverage:

- Authenticated product list and single-product lookup.
- Missing product returns `404`.
- Client users receive `403` for create/update/delete.
- Admin users can create, update, and delete products.
- Invalid product payloads return `400`.

Exit criteria:

- A reusable `generateProduct()` helper exists for disposable product setup.
- Cart/order tests can request a known product ID without hard-coding fragile data.

### Phase 3: Cart Lifecycle

Goal: cover the user cart as a clean state machine: empty -> item added -> item updated -> item removed -> cleared.

Recommended coverage:

- Empty cart for a fresh user.
- Add/update/remove/clear happy paths.
- Invalid quantity and missing product/item paths.
- Unauthorized access for every endpoint.

Exit criteria:

- Cart tests leave no shared state behind.
- Cart helper can prepare a populated cart for order tests.

### Phase 4: Orders

Goal: cover order creation from a cart and lifecycle management by user and admin.

Recommended coverage:

- Create order from populated cart.
- Reject order creation from empty cart.
- User list/detail with paging and status filter.
- Cancel allowed order and reject invalid transitions.
- Admin list and admin status update.
- Client forbidden responses for admin endpoints.

Exit criteria:

- At least one full flow is covered: product -> cart -> order -> status update.
- Invalid transition rules are explicitly asserted.
- Shared order transition suites are constrained with `test.describe.configure({ mode: 'serial' })` and tagged `@serial-admin`.

### Phase 5: User Management And Prompts

Goal: validate authenticated user data, permissions, and prompt preference persistence.

Recommended coverage:

- User list/detail access behavior after curl confirms admin rules.
- Self/admin update and forbidden update.
- Delete user permissions.
- Chat/tool prompt get and update.
- Prompt persistence verified by read-back.

Exit criteria:

- Role-sensitive user operations are covered.
- Prompt tests are independent and use fresh users.

### Phase 6: Email Observability

Goal: verify email-triggering behavior through API-visible side effects.

Recommended coverage:

- Send email success and validation failures.
- Local outbox get/clear in local profile.
- `/api/v1/users/me/email-events` after email-triggering actions.
- Consistency between trigger response, outbox entry, and email event.

Exit criteria:

- Email tests can verify side effects without logs or manual UI checks.

### Phase 7: Utility And Monitoring

Goal: cover utility endpoints that are useful but not part of the core shopping flow.

Recommended coverage:

- QR binary response: status, content type, non-empty body.
- QR invalid input and unauthorized access.
- Traffic info contract.
- Traffic logs paging/filter behavior.
- Traffic log detail found/not-found behavior.

Exit criteria:

- Utility endpoints have smoke-level confidence.
- Monitoring tests do not depend on exact global traffic history.

### Phase 8: Ollama Streaming

Goal: validate stream handling, auth, schema contracts, and predictable error mapping.

Recommended coverage:

- Tool definitions schema first.
- Stream consumption helper for generate/chat endpoints.
- Invalid payload and missing/unknown model.
- Backend failure mapping when Ollama is unavailable.
- Auth enforcement.

Exit criteria:

- Streaming assertions are deterministic.
- Tests can be skipped or isolated when the model service is intentionally unavailable.

## Spec File Suggestions

Suggested files, keeping the current resource-folder and endpoint-per-spec style:

- `tests/api/users/post-password-forgot.api.spec.ts`
- `tests/api/users/post-password-reset.api.spec.ts`
- `tests/api/cart/put-cart-items.api.spec.ts`
- `tests/api/cart/delete-cart-items.api.spec.ts`
- `tests/api/orders/post-orders.api.spec.ts`
- `tests/api/orders/get-orders.api.spec.ts`
- `tests/api/orders/get-order-by-id.api.spec.ts`
- `tests/api/orders/post-order-cancel.api.spec.ts`
- `tests/api/orders/put-order-status.api.spec.ts`
- `tests/api/email/post-email.api.spec.ts`
- `tests/api/email/get-local-email-outbox.api.spec.ts`
- `tests/api/email/delete-local-email-outbox.api.spec.ts`
- `tests/api/qr/post-qr-create.api.spec.ts`
- `tests/api/traffic/get-traffic-info.api.spec.ts`
- `tests/api/traffic/get-traffic-logs.api.spec.ts`
- `tests/api/traffic/get-traffic-log-by-correlation-id.api.spec.ts`
- `tests/api/ollama/get-chat-tools-definitions.api.spec.ts`
- `tests/api/ollama/post-ollama-generate.api.spec.ts`
- `tests/api/ollama/post-ollama-chat.api.spec.ts`
- `tests/api/ollama/post-ollama-chat-tools.api.spec.ts`

Keep each spec internally ordered by status code, even when the endpoint inventory is ordered by dependency.

## Notes To Verify With Curl Before Automating

- For `PUT /api/v1/cart/items/{productId}`, does quantity `0` remove the item or return `400`?
- Which exact validation messages are returned for product, cart, address, prompt, QR, and email payload errors?
- Are local outbox endpoints available in the environment used by Playwright (`local` profile only)?
- What deterministic response shape is returned when Ollama is unavailable?

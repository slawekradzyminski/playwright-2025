# API Test Plan

Derived from `api-docs.json` and cross-checked against backend controllers/security in `/Users/admin/IdeaProjects/test-secure-backend`.

## Source of truth

- OpenAPI: `api-docs.json`
- Security allow-list: `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/security/WebSecurityConfig.java`
- Controllers: `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/**`

## Coverage Summary

- Total endpoints: 40
- Covered by this repo: 2
- Remaining TODO: 38
- Non-protected endpoints: 7
- Protected endpoints: 33

## Non-Protected Endpoints (No JWT required)

| Coverage | Method | Path | Assertion order (HTTP) | Backend code | Notes |
|---|---|---|---|---|---|
| TODO | DELETE | `/local/email/outbox` | 200 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/email/LocalEmailOutboxController.java` | Add API tests |
| TODO | GET | `/local/email/outbox` | 200 | `` | Add API tests |
| TODO | POST | `/users/password/forgot` | 202 -> 400 | `` | Add API tests |
| TODO | POST | `/users/password/reset` | 200 -> 400 | `` | Add API tests |
| TODO | POST | `/users/refresh` | 200 -> 401 | `` | Add API tests |
| Covered | POST | `/users/signin` | 200 -> 400 -> 422 | `` | Tests: `tests/api/login.api.spec.ts` |
| Covered | POST | `/users/signup` | 201 -> 400 | `` | Tests: `tests/api/signup.api.spec.ts` |

## Protected Endpoints (JWT required)

| Coverage | Method | Path | Assertion order (HTTP) | Auth/Role rule | Backend code | Notes |
|---|---|---|---|---|---|---|
| TODO | DELETE | `/api/cart` | 204 -> 401 | JWT required | `` | Add API tests |
| TODO | GET | `/api/cart` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | POST | `/api/cart/items` | 200 -> 400 -> 401 -> 404 | JWT required | `` | Add API tests |
| TODO | DELETE | `/api/cart/items/{productId}` | 200 -> 401 -> 404 | JWT required | `` | Add API tests |
| TODO | PUT | `/api/cart/items/{productId}` | 200 -> 400 -> 401 -> 404 | JWT required | `` | Add API tests |
| TODO | POST | `/api/ollama/chat` | 200 -> 400 -> 401 -> 404 -> 500 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Add API tests |
| TODO | POST | `/api/ollama/chat/tools` | 200 -> 400 -> 401 -> 500 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Add API tests |
| TODO | GET | `/api/ollama/chat/tools/definitions` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Add API tests |
| TODO | POST | `/api/ollama/generate` | 200 -> 400 -> 401 -> 404 -> 500 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Add API tests |
| TODO | GET | `/api/orders` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | POST | `/api/orders` | 201 -> 400 -> 401 | JWT required | `` | Add API tests |
| TODO | GET | `/api/orders/admin` | 200 -> 401 -> 403 | JWT required | `` | Add API tests |
| TODO | GET | `/api/orders/{id}` | 200 -> 401 -> 404 | JWT required | `` | Add API tests |
| TODO | POST | `/api/orders/{id}/cancel` | 200 -> 400 -> 401 -> 404 | JWT required | `` | Add API tests |
| TODO | PUT | `/api/orders/{id}/status` | 200 -> 400 -> 401 -> 403 -> 404 | JWT required | `` | Add API tests |
| TODO | GET | `/api/products` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | POST | `/api/products` | 201 -> 400 -> 401 -> 403 | JWT required | `` | Add API tests |
| TODO | DELETE | `/api/products/{id}` | 204 -> 401 -> 403 -> 404 | JWT required | `` | Add API tests |
| TODO | GET | `/api/products/{id}` | 200 -> 401 -> 404 | JWT required | `` | Add API tests |
| TODO | PUT | `/api/products/{id}` | 200 -> 400 -> 401 -> 403 -> 404 | JWT required | `` | Add API tests |
| TODO | GET | `/api/traffic/info` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | POST | `/email` | 200 -> 400 -> 401 | JWT required | `` | Add API tests |
| TODO | POST | `/qr/create` | 200 -> 400 -> 401 | JWT required | `` | Add API tests |
| TODO | GET | `/users` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | GET | `/users/chat-system-prompt` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | PUT | `/users/chat-system-prompt` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | POST | `/users/logout` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | GET | `/users/me` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | GET | `/users/tool-system-prompt` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | PUT | `/users/tool-system-prompt` | 200 -> 401 | JWT required | `` | Add API tests |
| TODO | DELETE | `/users/{username}` | 204 -> 401 -> 403 -> 404 | JWT required | `` | Add API tests |
| TODO | GET | `/users/{username}` | 200 -> 401 -> 404 | JWT required | `` | Add API tests |
| TODO | PUT | `/users/{username}` | 200 -> 401 -> 403 -> 404 | JWT required | `` | Add API tests |

## Recommended Execution Strategy

1. Prioritize non-protected endpoints to stabilize request/response contracts.
2. For each endpoint, assert statuses in ascending order (for example `200 -> 400 -> 401 -> 403 -> 404`).
3. For protected endpoints, add `401` first, then authorized happy-path, then role-based `403` where applicable.
4. Keep `400` validation scenarios minimal (representative only).

## Backend/Spec Drift Notes

- `DELETE /local/email/outbox` returns `204` in code (`LocalEmailOutboxController`) but `api-docs.json` lists `200`.

# API Test Plan

Derived from `api-docs.json` and cross-checked against backend controllers/security in `/Users/admin/IdeaProjects/test-secure-backend`.

## Source of truth

- OpenAPI: `api-docs.json`
- Security allow-list: `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/security/WebSecurityConfig.java`
- Controllers: `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/**`

## Coverage Summary

- Total endpoints: 40
- Covered by this repo: 40
- Remaining TODO: 0
- Non-protected endpoints: 7
- Protected endpoints: 33

## Non-Protected Endpoints (No JWT required)

| Coverage | Method | Path | Assertion order (HTTP) | Backend code | Notes |
|---|---|---|---|---|---|
| Covered | DELETE | `/local/email/outbox` | 200 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/email/LocalEmailOutboxController.java` | Tests: `tests/api/local/localEmailOutbox.api.spec.ts` |
| Covered | GET | `/local/email/outbox` | 200 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/email/LocalEmailOutboxController.java` | Tests: `tests/api/local/localEmailOutbox.api.spec.ts` |
| Covered | POST | `/users/password/forgot` | 202 -> 400 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/PasswordResetController.java` | Tests: `tests/api/auth/passwordReset.api.spec.ts` |
| Covered | POST | `/users/password/reset` | 200 -> 400 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/PasswordResetController.java` | Tests: `tests/api/auth/passwordReset.api.spec.ts` |
| Covered | POST | `/users/refresh` | 200 -> 401 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserRefreshController.java` | Tests: `tests/api/auth/refresh.api.spec.ts` |
| Covered | POST | `/users/signin` | 200 -> 400 -> 422 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserSignInController.java` | Tests: `tests/api/auth/login.api.spec.ts` |
| Covered | POST | `/users/signup` | 201 -> 400 | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserSignUpController.java` | Tests: `tests/api/auth/signup.api.spec.ts` |

## Protected Endpoints (JWT required)

| Coverage | Method | Path | Assertion order (HTTP) | Auth/Role rule | Backend code | Notes |
|---|---|---|---|---|---|---|
| Covered | DELETE | `/api/cart` | 204 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/cart/CartController.java` | Tests: `tests/api/cart/cartDelete.api.spec.ts` |
| Covered | GET | `/api/cart` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/cart/CartController.java` | Tests: `tests/api/cart/cartGet.api.spec.ts` |
| Covered | POST | `/api/cart/items` | 200 -> 400 -> 401 -> 404 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/cart/CartItemsController.java` | Tests: `tests/api/cart/items/cartItemsCreate.api.spec.ts` |
| Covered | DELETE | `/api/cart/items/{productId}` | 200 -> 401 -> 404 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/cart/CartItemsController.java` | Tests: `tests/api/cart/items/cartItemsDelete.api.spec.ts` |
| Covered | PUT | `/api/cart/items/{productId}` | 200 -> 400 -> 401 -> 404 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/cart/CartItemsController.java` | Tests: `tests/api/cart/items/cartItemsUpdate.api.spec.ts` |
| Covered | POST | `/api/ollama/chat` | 200 -> 400 -> 401 -> 404 -> 500 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Tests: `tests/api/ollama/ollamaChat.api.spec.ts` |
| Covered | POST | `/api/ollama/chat/tools` | 200 -> 400 -> 401 -> 500 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Tests: `tests/api/ollama/ollamaChatTools.api.spec.ts` |
| Covered | GET | `/api/ollama/chat/tools/definitions` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Tests: `tests/api/ollama/ollamaToolDefinitions.api.spec.ts` |
| Covered | POST | `/api/ollama/generate` | 200 -> 400 -> 401 -> 404 -> 500 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OllamaController.java` | Tests: `tests/api/ollama/ollamaGenerate.api.spec.ts` |
| Covered | GET | `/api/orders` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OrderController.java` | Tests: `tests/api/orders/ordersGet.api.spec.ts` |
| Covered | POST | `/api/orders` | 201 -> 400 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OrderController.java` | Tests: `tests/api/orders/ordersCreate.api.spec.ts` |
| Covered | GET | `/api/orders/admin` | 200 -> 401 -> 403 | JWT + hasRole('ROLE_ADMIN') | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OrderController.java` | Tests: `tests/api/orders/ordersGetAdmin.api.spec.ts` |
| Covered | GET | `/api/orders/{id}` | 200 -> 401 -> 404 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OrderController.java` | Tests: `tests/api/orders/ordersGetById.api.spec.ts` |
| Covered | POST | `/api/orders/{id}/cancel` | 200 -> 400 -> 401 -> 404 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OrderController.java` | Tests: `tests/api/orders/ordersCancel.api.spec.ts` |
| Covered | PUT | `/api/orders/{id}/status` | 200 -> 400 -> 401 -> 403 -> 404 | JWT + hasRole('ROLE_ADMIN') | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/OrderController.java` | Tests: `tests/api/orders/ordersUpdateStatus.api.spec.ts` |
| Covered | GET | `/api/products` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/ProductController.java` | Tests: `tests/api/products/productsGetAll.api.spec.ts` |
| Covered | POST | `/api/products` | 201 -> 400 -> 401 -> 403 | JWT + hasRole('ROLE_ADMIN') | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/ProductController.java` | Tests: `tests/api/products/productsCreate.api.spec.ts` |
| Covered | DELETE | `/api/products/{id}` | 204 -> 401 -> 403 -> 404 | JWT + hasRole('ROLE_ADMIN') | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/ProductController.java` | Tests: `tests/api/products/productsDelete.api.spec.ts` |
| Covered | GET | `/api/products/{id}` | 200 -> 401 -> 404 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/ProductController.java` | Tests: `tests/api/products/productsGetById.api.spec.ts` |
| Covered | PUT | `/api/products/{id}` | 200 -> 400 -> 401 -> 403 -> 404 | JWT + hasRole('ROLE_ADMIN') | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/ProductController.java` | Tests: `tests/api/products/productsUpdate.api.spec.ts` |
| Covered | GET | `/api/traffic/info` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/TrafficController.java` | Tests: `tests/api/traffic/trafficInfo.api.spec.ts` |
| Covered | POST | `/email` | 200 -> 400 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/EmailController.java` | Tests: `tests/api/email/emailSend.api.spec.ts` |
| Covered | POST | `/qr/create` | 200 -> 400 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/QrController.java` | Tests: `tests/api/qr/qrCreate.api.spec.ts` |
| Covered | GET | `/users` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserGetUsersController.java` | Tests: `tests/api/users/account/users.api.spec.ts` |
| Covered | GET | `/users/chat-system-prompt` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserPromptController.java` | Tests: `tests/api/users/prompts/usersPrompts.api.spec.ts` |
| Covered | PUT | `/users/chat-system-prompt` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserPromptController.java` | Tests: `tests/api/users/prompts/usersPrompts.api.spec.ts` |
| Covered | POST | `/users/logout` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserLogoutController.java` | Tests: `tests/api/users/session/usersLogout.api.spec.ts` |
| Covered | GET | `/users/me` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserMeController.java` | Tests: `tests/api/users/account/usersMe.api.spec.ts` |
| Covered | GET | `/users/tool-system-prompt` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserPromptController.java` | Tests: `tests/api/users/prompts/usersPrompts.api.spec.ts` |
| Covered | PUT | `/users/tool-system-prompt` | 200 -> 401 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserPromptController.java` | Tests: `tests/api/users/prompts/usersPrompts.api.spec.ts` |
| Covered | DELETE | `/users/{username}` | 204 -> 401 -> 403 -> 404 | JWT + hasRole('ROLE_ADMIN') | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserDeleteController.java` | Tests: `tests/api/users/account/usersSingle.api.spec.ts` |
| Covered | GET | `/users/{username}` | 200 -> 401 -> 404 | JWT required | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserGetSingleUserController.java` | Tests: `tests/api/users/account/usersSingle.api.spec.ts` |
| Covered | PUT | `/users/{username}` | 200 -> 401 -> 403 -> 404 | JWT + @userService.exists(#username) and (hasRole('ROLE_ADMIN') or #username == authentication.principal.username) | `/Users/admin/IdeaProjects/test-secure-backend/src/main/java/com/awesome/testing/controller/users/UserEditController.java` | Tests: `tests/api/users/account/usersSingle.api.spec.ts` |

## Recommended Execution Strategy

1. Prioritize non-protected endpoints to stabilize request/response contracts.
2. For each endpoint, assert statuses in ascending order (for example `200 -> 400 -> 401 -> 403 -> 404`).
3. For protected endpoints, add `401` first, then authorized happy-path, then role-based `403` where applicable.
4. Keep `400` validation scenarios minimal (representative only).

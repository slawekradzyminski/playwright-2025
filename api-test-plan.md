# API Test Plan (Playwright, TypeScript)

**Source of truth:** `api-docs.json` (OpenAPI 3.1) for JWT Authentication API, base URL: `http://localhost:4001`

## Legend & Conventions

**Status icons:** ✅ Done · 🏗️ In-progress · ⏳ To-do

**Test style:** Given / When / Then comments in each test.

**Ordering inside specs:** by response code → 200/201 → 400 → 401 → 403 → 404 (include other documented codes afterwards if present, e.g. 422/500).

**One endpoint = one client + one spec** (e.g. `loginClient.ts` ⇆ `login.api.spec.ts`).

**Auth:** Use Playwright's APIRequestContext with per-test bearer injection.

**Fixtures:** `authHelper` (create users, login, get admin/non-admin tokens), `productFactory`, `cartFactory`, `orderFactory`.

**Data hygiene:** Create, assert, and tear down test records you own.

**Validation scope:** keep 400 cases lean (input validation mostly unit-tested).

## Execution Order (easiest → hardest)

1. `/users/signup` ✅ 
2. `/users/refresh`, `/users/me`, `/api/traffic/info` 
3. read-only lists/gets 
4. cart flows 
5. email/QR 
6. products CRUD (admin) 
7. orders (user) 
8. orders (admin & transitions) 
9. users by username + system prompt 
10. Ollama streaming

## Coverage Matrix

| Endpoint | Method | Client file | Spec file | Status | Notes / Role |
|----------|--------|-------------|-----------|--------|--------------|
| `/users/signin` | POST | `loginClient.ts` | `login.api.spec.ts` | ✅ | Already covered |
| `/users/signup` | POST | `signupClient.ts` | `signup.api.spec.ts` | ✅ | Completed with faker.js |
| `/users/refresh` | GET | `refreshTokenClient.ts` | `refreshToken.api.spec.ts` | ✅ | Auth required |
| `/users/me` | GET | `whoAmIClient.ts` | `whoAmI.api.spec.ts` | ✅ | Auth required |
| `/users` | GET | `getAllUsersClient.ts` | `getAllUsers.api.spec.ts` | ✅ | Admin only (403 on non-admin) |
| `/users/{username}` | GET | `getUserByUsernameClient.ts` | `getUserByUsername.api.spec.ts` | ✅ | Auth; 404 on missing |
| `/users/{username}` | PUT | `updateUserClient.ts` | `updateUser.api.spec.ts` | ✅ | Auth; 403 on insufficient perms |
| `/users/{username}` | DELETE | `deleteUserClient.ts` | `deleteUser.api.spec.ts` | ✅ | Auth; 204 success; 403/404 |
| `/users/{username}/system-prompt` | GET | `getUserSystemPromptClient.ts` | `getUserSystemPrompt.api.spec.ts` | ⏳ | Auth; 403/404 |
| `/users/{username}/system-prompt` | PUT | `updateUserSystemPromptClient.ts` | `updateUserSystemPrompt.api.spec.ts` | ⏳ | Auth; 403/404 |
| `/api/products` | GET | `getAllProductsClient.ts` | `getAllProducts.api.spec.ts` | ⏳ | Auth |
| `/api/products` | POST | `createProductClient.ts` | `createProduct.api.spec.ts` | ⏳ | Admin; 201 on success |
| `/api/products/{id}` | GET | `getProductByIdClient.ts` | `getProductById.api.spec.ts` | ⏳ | Auth; 404 |
| `/api/products/{id}` | PUT | `updateProductClient.ts` | `updateProduct.api.spec.ts` | ⏳ | Admin; 400/403/404 |
| `/api/products/{id}` | DELETE | `deleteProductClient.ts` | `deleteProduct.api.spec.ts` | ⏳ | Admin; 204/403/404 |
| `/api/cart` | GET | `getCartClient.ts` | `getCart.api.spec.ts` | ⏳ | Auth |
| `/api/cart` | DELETE | `clearCartClient.ts` | `clearCart.api.spec.ts` | ⏳ | Auth |
| `/api/cart/items` | POST | `addToCartClient.ts` | `addToCart.api.spec.ts` | ⏳ | Auth; 404 product; 400 invalid |
| `/api/cart/items/{productId}` | PUT | `updateCartItemClient.ts` | `updateCartItem.api.spec.ts` | ⏳ | Auth; 400/404 |
| `/api/cart/items/{productId}` | DELETE | `removeFromCartClient.ts` | `removeFromCart.api.spec.ts` | ⏳ | Auth; 404 |
| `/api/orders` | POST | `createOrderClient.ts` | `createOrder.api.spec.ts` | ⏳ | Auth; needs cart; 201/400 |
| `/api/orders` | GET | `getUserOrdersClient.ts` | `getUserOrders.api.spec.ts` | ⏳ | Auth; paging/filter |
| `/api/orders/{id}` | GET | `getOrderClient.ts` | `getOrder.api.spec.ts` | ⏳ | Auth; 404 |
| `/api/orders/{id}/cancel` | POST | `cancelOrderClient.ts` | `cancelOrder.api.spec.ts` | ⏳ | Auth; 400/404 |
| `/api/orders/admin` | GET | `getAllOrdersAdminClient.ts` | `getAllOrdersAdmin.api.spec.ts` | ⏳ | Admin; 403 |
| `/api/orders/{id}/status` | PUT | `updateOrderStatusClient.ts` | `updateOrderStatus.api.spec.ts` | ⏳ | Admin; transitions/400/403/404 |
| `/email` | POST | `sendEmailClient.ts` | `sendEmail.api.spec.ts` | ⏳ | Auth; 400 |
| `/qr/create` | POST | `createQrCodeClient.ts` | `createQrCode.api.spec.ts` | ✅ | Auth; PNG body |
| `/api/ollama/chat` | POST | `chatClient.ts` | `chat.api.spec.ts` | ⏳ | Auth; SSE; 400/404/500 |
| `/api/ollama/generate` | POST | `generateTextClient.ts` | `generateText.api.spec.ts` | ⏳ | Auth; SSE; 400/404/500 |
| `/api/traffic/info` | GET | `getTrafficInfoClient.ts` | `getTrafficInfo.api.spec.ts` | ⏳ | Auth |

## Global Setup & Utilities

- **`/fixtures/authHelper.ts`**: helpers to `signup()`, `signin()`, `asUser()`, `asAdmin()`, `omitToken()`
- **`/fixtures/factories.ts`**: `createProduct()`, `deleteProduct()`, `addToCart()`, `clearCart()`, `placeOrder()`

**Environment:** `BASE_URL=http://localhost:4001` (from OpenAPI servers)

**Headers:** JSON + `Authorization: Bearer <jwt>` where required (see security: bearerAuth)

## Test Cases by Endpoint

Each block follows **200/201 → 400 → 401 → 403 → 404**, with **Given / When / Then** comments. Only a small set of 400s per endpoint (validation covered in unit tests).

### 1) `/users/signin` (DONE) — Authenticate and return JWT

**Files:** `loginClient.ts`, `login.api.spec.ts` ✅  
**Expect:** 200, 400, 422

#### 200
- **Given:** valid username/password
- **When:** posting to `/users/signin`
- **Then:** receive token and user profile fields

#### 400 (minimal)
- **Given:** missing username
- **When:** posting
- **Then:** 400 field validation failed

#### 422
- **Given:** wrong password
- **When:** posting
- **Then:** 422 invalid credentials

### 2) `/users/signup` (DONE) — Create account

**Files:** `signupClient.ts`, `signup.api.spec.ts` ✅  
**Expect:** 201, 400

#### 201
- **Given:** unique username/email and valid payload (`UserRegisterDto`)
- **When:** POST `/users/signup`
- **Then:** 201 created (optionally assert ability to sign in)

#### 400 (single minimal)
- **Given:** payload missing roles or password
- **When:** POST
- **Then:** 400 validation failed

#### 400 (username already exists)
- **Given:** username already exists
- **When:** POST
- **Then:** 400 username already exists

### 3) `/users/refresh` (DONE) — Refresh JWT

**Files:** `refreshTokenClient.ts`, `refreshToken.api.spec.ts` ✅  
**Expect:** 200, 401

#### 200
- **Given:** valid user token
- **When:** GET `/users/refresh`
- **Then:** 200 string token returned

#### 401
- **Given:** no/invalid token
- **When:** GET
- **Then:** 401

### 4) `/users/me` (DONE) — Current user

**Files:** `whoAmIClient.ts`, `whoAmI.api.spec.ts` ✅  
**Expect:** 200, 401

#### 200
- **Given:** logged-in user
- **When:** GET `/users/me`
- **Then:** user details match token subject

#### 401
- **Given:** no token
- **When:** GET
- **Then:** 401

### 5) `/users` (DONE) — Get all users (admin) ✅

**Files:** `getAllUsersClient.ts`, `getAllUsers.api.spec.ts`  
**Expect:** 200, 401, 403

#### 200
- **Given:** admin token
- **When:** GET `/users`
- **Then:** 200 list (non-empty if seed/admin present)

#### 401
- **Given:** no token
- **When:** GET
- **Then:** 401

### 6) `/users/{username}` (DONE) — GET/PUT/DELETE ✅

**Files:** `getUserByUsernameClient.ts`, `getUserByUsername.api.spec.ts`; `updateUserClient.ts`, `updateUser.api.spec.ts`; `deleteUserClient.ts`, `deleteUser.api.spec.ts`

#### GET
- **200:** Given token, When GET existing username, Then user details
- **401:** no token → 401
- **404:** unknown username → 404

#### PUT
- **200:** token with permission (self/admin), valid `UserEditDto` → 200 updated entity
- **400:** minimal invalid (e.g., bad email format) → 400
- **401:** no token → 401
- **403:** other user without admin → 403
- **404:** unknown username → 404

#### DELETE
- **204:** admin or self with allowed policy → 204
- **401:** no token → 401
- **403:** non-admin deleting other user → 403
- **404:** unknown username → 404

### 7) `/users/{username}/system-prompt` — GET/PUT

**Files:** `getUserSystemPromptClient.ts`, `getUserSystemPrompt.api.spec.ts`; `updateUserSystemPromptClient.ts`, `updateUserSystemPrompt.api.spec.ts`

#### GET
- **200:** owner/admin token → system prompt returned
- **401:** no token
- **403:** other user (non-admin)
- **404:** unknown username

#### PUT
- **200:** owner/admin + valid `SystemPromptDto` → updated doc
- **400:** minimal invalid (e.g., exceeds 500 chars) → 400
- **401/403/404:** as above

### 8) Products

#### `/api/products` — GET / POST

**Files:** `getAllProductsClient.ts` / `getAllProducts.api.spec.ts`; `createProductClient.ts` / `createProduct.api.spec.ts`

**GET:**
- **200:** auth token → list array shape
- **401:** no token → 401

**POST:**
- **201:** admin + valid `ProductCreateDto` → product created; capture id
- **400:** minimal invalid (e.g., missing name) → 400
- **401/403:** missing token / non-admin → 401/403

#### `/api/products/{id}` — GET / PUT / DELETE

**Files:** `getProductByIdClient.ts`, `updateProductClient.ts`, `deleteProductClient.ts` (+ specs)

**GET:**
- **200:** existing id → dto fields match created product
- **401:** no token
- **404:** non-existent id

**PUT:**
- **200:** admin + valid `ProductUpdateDto` → updated fields
- **400:** e.g., negative price → 400
- **401/403/404:** as documented

**DELETE:**
- **204:** admin deletes created id → 204
- **401/403/404:** as documented

### 9) Cart

#### `/api/cart` — GET / DELETE

**Files:** `getCartClient.ts`, `clearCartClient.ts` (+ specs)

**GET:**
- **200:** token → cart shape (`CartDto`)
- **401:** no token

**DELETE:**
- **200:** token → cart cleared
- **401:** no token

#### `/api/cart/items` — POST (add)

**Files:** `addToCartClient.ts`, `addToCart.api.spec.ts`

- **200:** token + existing productId + qty → cart reflects item
- **400:** qty < 1 → 400
- **401:** no token
- **404:** unknown productId

#### `/api/cart/items/{productId}` — PUT (update qty) / DELETE

**Files:** `updateCartItemClient.ts`, `removeFromCartClient.ts` (+ specs)

**PUT:**
- **200:** update to new qty; totals reflect
- **400:** qty < 1 → 400
- **401:** no token
- **404:** item not in cart

**DELETE:**
- **200:** remove existing item
- **401:** no token
- **404:** item not in cart

### 10) Orders (User)

#### `/api/orders` — POST (from cart) / GET (paged)

**Files:** `createOrderClient.ts`, `getUserOrdersClient.ts` (+ specs)

**POST:**
- **201:** token + non-empty cart + valid `AddressDto` → returns `OrderDto` with PENDING
- **400:** empty cart or invalid zip format → 400
- **401:** no token

**GET:**
- **200:** token → page dto; verify status filter & pagination work
- **401:** no token

#### `/api/orders/{id}` — GET

**Files:** `getOrderClient.ts`, `getOrder.api.spec.ts`

- **200:** token owner of order → details match created order
- **401:** no token
- **404:** unknown id

#### `/api/orders/{id}/cancel` — POST

**Files:** `cancelOrderClient.ts`, `cancelOrder.api.spec.ts`

- **200:** token + cancellable state (e.g., PENDING) → status becomes CANCELLED
- **400:** not cancellable (e.g., DELIVERED) → 400
- **401:** no token
- **404:** unknown id

### 11) Orders (Admin)

#### `/api/orders/admin` — GET all (with filters)

**Files:** `getAllOrdersAdminClient.ts`, `getAllOrdersAdmin.api.spec.ts`

- **200:** admin token → page dto; verify status filter and paging
- **401:** no token
- **403:** non-admin

#### `/api/orders/{id}/status` — PUT (status transitions)

**Files:** `updateOrderStatusClient.ts`, `updateOrderStatus.api.spec.ts`

- **200:** admin updates PENDING → PAID → SHIPPED → DELIVERED step-wise; assert each transition
- **400:** invalid transition (e.g., DELIVERED → PAID) → 400
- **401:** no token
- **403:** non-admin
- **404:** unknown order id

### 12) Email & QR

#### `/email` — POST

**Files:** `sendEmailClient.ts`, `sendEmail.api.spec.ts`

- **200:** token + minimal valid `EmailDto` → success
- **400:** missing subject or message → 400
- **401:** no token

#### `/qr/create` — POST

**Files:** `createQrCodeClient.ts`, `createQrCode.api.spec.ts`

- **200:** token + `{ text: "https://example" }` → response image/png bytes (assert content-type and PNG signature)
- **400:** missing text → 400
- **401:** no token

### 13) Ollama (Streaming SSE)

#### `/api/ollama/chat` — POST (SSE)

**Files:** `chatClient.ts`, `chat.api.spec.ts`

- **200:** token + valid `ChatRequestDto` → text/event-stream; read incremental events until done:true
- **400:** malformed body → 400
- **401:** no token
- **404:** unknown model → structured `ModelNotFoundDto`
- **500:** simulate backend error (if injectable) → 500

#### `/api/ollama/generate` — POST (SSE)

**Files:** `generateTextClient.ts`, `generateText.api.spec.ts`

- **200:** token + `StreamedRequestDto` → verify streamed `GenerateResponseDto` frames until done
- **400/401/404/500:** as above

### 14) Traffic Monitoring

#### `/api/traffic/info` — GET

**Files:** `getTrafficInfoClient.ts`, `getTrafficInfo.api.spec.ts`

- **200:** token → verify webSocketEndpoint + topic fields
- **401:** no token

## Testing Notes & Dependencies

**Admin vs Client:** Create two fixtures at signup: `adminUser` (ROLE_ADMIN), `clientUser` (ROLE_CLIENT). Use for 403 assertions.

**IDs:** For 404s, use a large unused id (e.g., 99999999) or UUID-like username.

**Data chaining:**
- Products CRUD precedes Cart
- Cart precedes Order create  
- Order create precedes cancel/status tests
- Keep artefacts isolated per test (unique names) and delete where possible

**Streaming:** For SSE endpoints, assert `content-type: text/event-stream`, parse lines, and assert a terminating `done:true` frame.

**PNG assertion:** Check first 8 bytes `89 50 4E 47 0D 0A 1A 0A` and a reasonable payload length (non-zero).

### `/fixtures/`
```
apiAuth.ts
uiAuth.ts
```

## Coverage Tracker

**Endpoints total:** 31 specs (including method splits)

**Status:** ✅ 9 · 🏗️ 0 · ⏳ 23

*Update this list PR-by-PR; keep status icons and links current.*
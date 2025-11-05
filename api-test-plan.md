# JWT Authentication API Test Plan

**AI-Ready Test Plan for Playwright API Testing**

**Reader:** This plan is written for AI agents to execute autonomously.  
**Project Type:** Playwright + REST (TypeScript)  
**Base URL:** http://localhost:4001 (configure via `BASE_URL` environment variable)

---

## 📋 Progress Overview

**Status Legend:**
- ✅ **DONE** - Already implemented and owned by existing files
- ⏳ **TODO** - To be implemented per conventions in §2
- 🚫 **N/A** - Not applicable

**Current Progress:** 3/42 test files implemented (7%)

---

## 🎯 Current Assets (DONE ✅)

| Component | Files |
|-----------|-------|
| **Tests** | `login.api.spec.ts`, `registration.api.spec.ts`, `users.api.spec.ts`, `tests/api/users/users.username.get.api.spec.ts`, `tests/api/users/users.username.put.api.spec.ts`, `tests/api/users/users.username.delete.api.spec.ts`, `tests/api/users/users.me.get.api.spec.ts`, `tests/api/users/users.refresh.get.api.spec.ts`, `tests/api/users/system-prompt.get.api.spec.ts`, `tests/api/users/system-prompt.put.api.spec.ts`, `tests/api/products/products.collection.get.api.spec.ts`, `tests/api/products/products.collection.post.api.spec.ts`, `tests/api/products/products.by-id.get.api.spec.ts`, `tests/api/products/products.by-id.put.api.spec.ts`, `tests/api/products/products.by-id.delete.api.spec.ts` |
| **Clients** | `loginClient.ts`, `registrationClient.ts`, `usersClient.ts`, `http/users/usersByUsernameGetClient.ts`, `http/users/usersByUsernamePutClient.ts`, `http/users/usersByUsernameDeleteClient.ts`, `http/users/usersMeClient.ts`, `http/users/usersRefreshClient.ts`, `http/users/systemPromptGetClient.ts`, `http/users/systemPromptPutClient.ts`, `http/products/productsCollectionGetClient.ts`, `http/products/productsCollectionPostClient.ts`, `http/products/productsByIdGetClient.ts`, `http/products/productsByIdPutClient.ts`, `http/products/productsByIdDeleteClient.ts` |

---

## 📊 Scope & Endpoints

### Users Management
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/users/signin` | POST | ✅ DONE | Login flow covered by `login.api.spec.ts` + `loginClient.ts` |
| `/users/signup` | POST | ✅ DONE | Registration flow covered by `registration.api.spec.ts` + `registrationClient.ts` |
| `/users` | GET | ✅ DONE | User listing handled by `users.api.spec.ts` + `usersClient.ts` |
| `/users/{username}` | GET | ✅ DONE | Covered by `tests/api/users/users.username.get.api.spec.ts` + `http/users/usersByUsernameGetClient.ts` |
| `/users/{username}` | PUT | ✅ DONE | Covered by `tests/api/users/users.username.put.api.spec.ts` + `http/users/usersByUsernamePutClient.ts` |
| `/users/{username}` | DELETE | ✅ DONE | Covered by `tests/api/users/users.username.delete.api.spec.ts` + `http/users/usersByUsernameDeleteClient.ts` |
| `/users/me` | GET | ✅ DONE | Covered by `tests/api/users/users.me.get.api.spec.ts` + `http/users/usersMeClient.ts` |
| `/users/refresh` | GET | ✅ DONE | Covered by `tests/api/users/users.refresh.get.api.spec.ts` + `http/users/usersRefreshClient.ts` |
| `/users/system-prompt` | GET | ✅ DONE | Covered by `tests/api/users/system-prompt.get.api.spec.ts` + `http/users/systemPromptGetClient.ts` |
| `/users/system-prompt` | PUT | ✅ DONE | Covered by `tests/api/users/system-prompt.put.api.spec.ts` + `http/users/systemPromptPutClient.ts` |

### Products Management
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/products` | GET | ✅ DONE | Covered by `tests/api/products/products.collection.get.api.spec.ts` + `http/products/productsCollectionGetClient.ts` |
| `/api/products` | POST | ✅ DONE | Covered by `tests/api/products/products.collection.post.api.spec.ts` + `http/products/productsCollectionPostClient.ts` |
| `/api/products/{id}` | GET | ✅ DONE | Covered by `tests/api/products/products.by-id.get.api.spec.ts` + `http/products/productsByIdGetClient.ts` |
| `/api/products/{id}` | PUT | ✅ DONE | Covered by `tests/api/products/products.by-id.put.api.spec.ts` + `http/products/productsByIdPutClient.ts` |
| `/api/products/{id}` | DELETE | ✅ DONE | Covered by `tests/api/products/products.by-id.delete.api.spec.ts` + `http/products/productsByIdDeleteClient.ts` |

### Shopping Cart
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/cart` | GET | ⏳ TODO | Get current user's cart |
| `/api/cart` | DELETE | ⏳ TODO | Clear user's cart |
| `/api/cart/items` | POST | ⏳ TODO | Add item to cart |
| `/api/cart/items/{productId}` | PUT | ⏳ TODO | Update cart item quantity |
| `/api/cart/items/{productId}` | DELETE | ⏳ TODO | Remove item from cart |

### Orders Management
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/orders` | GET | ⏳ TODO | Get user's orders |
| `/api/orders` | POST | ⏳ TODO | Create order from cart |
| `/api/orders/{id}` | GET | ⏳ TODO | Get order by ID |
| `/api/orders/{id}/cancel` | POST | ⏳ TODO | Cancel order (state rules apply) |
| `/api/orders/{id}/status` | PUT | ⏳ TODO | Update order status (admin only) |
| `/api/orders/admin` | GET | ⏳ TODO | Get all orders (admin only) |

### AI Integration (Ollama)
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/ollama/generate` | POST | ⏳ TODO | Generate text using Ollama model (SSE stream) |
| `/api/ollama/chat` | POST | ⏳ TODO | Chat with Ollama model (SSE stream) |

### Utilities
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/qr/create` | POST | ⏳ TODO | Generate QR code (returns PNG bytes) |
| `/email` | POST | ⏳ TODO | Send email |
| `/api/traffic/info` | GET | ⏳ TODO | Get traffic monitoring info (WebSocket endpoints) |

---

## 📁 File Structure & Conventions

**General Rule:** One test file + one HTTP client per endpoint method.

### Directory Structure

```
tests/api/
├── users/
│   ├── users.username.get.api.spec.ts     # /users/{username} GET
│   ├── users.username.put.api.spec.ts     # /users/{username} PUT
│   ├── users.username.delete.api.spec.ts  # /users/{username} DELETE
│   ├── users.me.api.spec.ts               # /users/me GET
│   ├── users.refresh.api.spec.ts          # /users/refresh GET
│   ├── system-prompt.get.api.spec.ts      # /users/system-prompt GET
│   └── system-prompt.put.api.spec.ts      # /users/system-prompt PUT
├── products/
│   ├── products.collection.get.api.spec.ts    # /api/products GET
│   ├── products.collection.post.api.spec.ts   # /api/products POST
│   ├── products.by-id.get.api.spec.ts         # /api/products/{id} GET
│   ├── products.by-id.put.api.spec.ts         # /api/products/{id} PUT
│   └── products.by-id.delete.api.spec.ts      # /api/products/{id} DELETE
├── cart/
│   ├── cart.collection.get.api.spec.ts        # /api/cart GET
│   ├── cart.collection.delete.api.spec.ts     # /api/cart DELETE
│   ├── cart.items.collection.post.api.spec.ts # /api/cart/items POST
│   ├── cart.items.by-id.put.api.spec.ts       # /api/cart/items/{productId} PUT
│   └── cart.items.by-id.delete.api.spec.ts    # /api/cart/items/{productId} DELETE
├── orders/
│   ├── orders.collection.get.api.spec.ts      # /api/orders GET
│   ├── orders.collection.post.api.spec.ts     # /api/orders POST
│   ├── orders.by-id.api.spec.ts               # /api/orders/{id} GET
│   ├── orders.cancel.api.spec.ts              # /api/orders/{id}/cancel POST
│   ├── orders.status.api.spec.ts              # /api/orders/{id}/status PUT
│   └── orders.admin.api.spec.ts               # /api/orders/admin GET
├── ollama/
│   ├── ollama.generate.api.spec.ts            # /api/ollama/generate POST
│   └── ollama.chat.api.spec.ts                 # /api/ollama/chat POST
├── qr/
│   └── qr.create.api.spec.ts                   # /qr/create POST
├── email/
│   └── email.send.api.spec.ts                  # /email POST
└── traffic/
    └── traffic.info.api.spec.ts                # /api/traffic/info GET

http/
├── users/
│   ├── usersByUsernameGetClient.ts
│   ├── usersByUsernamePutClient.ts
│   ├── usersByUsernameDeleteClient.ts
│   ├── usersMeClient.ts
│   ├── usersRefreshClient.ts
│   ├── systemPromptGetClient.ts
│   └── systemPromptPutClient.ts
├── products/
│   ├── productsCollectionGetClient.ts
│   ├── productsCollectionPostClient.ts
│   ├── productsByIdGetClient.ts
│   ├── productsByIdPutClient.ts
│   └── productsByIdDeleteClient.ts
├── cart/
│   ├── cartCollectionGetClient.ts
│   ├── cartCollectionDeleteClient.ts
│   ├── cartItemsCollectionPostClient.ts
│   ├── cartItemsByIdPutClient.ts
│   └── cartItemsByIdDeleteClient.ts
├── orders/
│   ├── ordersCollectionGetClient.ts
│   ├── ordersCollectionPostClient.ts
│   ├── ordersByIdClient.ts
│   ├── ordersCancelClient.ts
│   ├── ordersStatusClient.ts
│   └── ordersAdminClient.ts
├── ollama/
│   ├── ollamaGenerateClient.ts
│   └── ollamaChatClient.ts
├── qr/
│   └── qrCreateClient.ts
├── email/
│   └── emailSendClient.ts
└── traffic/
    └── trafficInfoClient.ts
```

---

## 🔧 Infrastructure Setup

### Installation & Environment Setup ✅ DONE
- **Node.js/NPM validation:** `node -v`, `npm ci`
- **Playwright validation:** `npx playwright validate`
- **Environment variables:** `BASE_URL`, `ADMIN_USER`, `ADMIN_PASS`, `CLIENT_USER`, `CLIENT_PASS`

### User Authentication Flow ✅ DONE
- **Registration → Login → Profile access**
- Covered by: `registration.api.spec.ts` + `login.api.spec.ts`
- Token reuse via fixtures

---

## 🏗️ Testing Architecture

### Execution Policy
- **Deterministic tests** with unique data (timestamps/UUIDs)
- **Self-cleaning** writes (delete created resources)
- **Concurrency:** Serial per resource group, parallel across groups (`--workers` by tag)

### Authentication Strategy
- JWT tokens acquired via `/users/signin`
- Fixtures: `getAdminToken()`, `getClientToken()`
- Auto-attached `Authorization: Bearer <token>` headers

### Data Contracts
- Strict JSON schema validation against OpenAPI DTOs
- Types: `UserResponseDto`, `ProductDto`, `OrderDto`, `CartDto`, `SystemPromptDto`

### Security Testing (RBAC)
- 401/403 responses tested wherever declared in OpenAPI
- Admin-gated endpoints: products write operations, order status updates

### Special Cases

#### Streaming Endpoints (`/api/ollama/*`)
- SSE framing validation
- Response latency budgeting
- `done` flag assertions in final events
- Error handling (model not found → JSON responses)

#### Binary Endpoints (`/qr/create`)
- `image/png` content-type validation
- Non-zero buffer length checks

#### Stateful Flows (Cart → Orders)
- Valid enum transitions
- Invalid transition rejection (400 responses)
- Cart-to-order conversion logic

### Observability
- Request/response logging with sensitive data redaction
- Contract snapshots for breaking change detection

---

## 📝 AI-Executable Checklist (YAML)

```yaml
meta:
  reader: AI-agent
  base_url_env: BASE_URL
  jwt_env:
    admin_user: ADMIN_USER
    admin_pass: ADMIN_PASS
    client_user: CLIENT_USER
    client_pass: CLIENT_PASS
status-legend: { DONE: implemented, TODO: to be done }
conventions:
  files_per_method: 1
  client_per_method: 1
  naming: kebabToDots(".api.spec.ts"), PascalCaseClient("Client.ts")

work:
  # Infrastructure
  - id: install-smoke
    kind: infra
    status: DONE
    actions:
      - ensure node/npm/playwright present
      - ensure env keys present
  - id: user-completion
    kind: flow
    status: DONE
    covers: ["/users/signup:POST", "/users/signin:POST"]

  # Users Management
  - id: users-username-get
    path: /users/{username}
    method: GET
    test: tests/api/users/users.username.get.api.spec.ts
    client: http/users/usersByUsernameGetClient.ts
    status: TODO
  - id: users-username-put
    path: /users/{username}
    method: PUT
    test: tests/api/users/users.username.put.api.spec.ts
    client: http/users/usersByUsernamePutClient.ts
    status: TODO
  - id: users-username-delete
    path: /users/{username}
    method: DELETE
    test: tests/api/users/users.username.delete.api.spec.ts
    client: http/users/usersByUsernameDeleteClient.ts
    status: TODO
  - id: users-me
    path: /users/me
    method: GET
    test: tests/api/users/users.me.api.spec.ts
    client: http/users/usersMeClient.ts
    status: TODO
  - id: users-refresh
    path: /users/refresh
    method: GET
    test: tests/api/users/users.refresh.api.spec.ts
    client: http/users/usersRefreshClient.ts
    status: TODO
  - id: system-prompt-get
    path: /users/system-prompt
    method: GET
    test: tests/api/users/system-prompt.get.api.spec.ts
    client: http/users/systemPromptGetClient.ts
    status: TODO
  - id: system-prompt-put
    path: /users/system-prompt
    method: PUT
    test: tests/api/users/system-prompt.put.api.spec.ts
    client: http/users/systemPromptPutClient.ts
    status: TODO

  # Products Management
  - id: products-collection-get
    path: /api/products
    method: GET
    test: tests/api/products/products.collection.get.api.spec.ts
    client: http/products/productsCollectionGetClient.ts
    status: TODO
  - id: products-collection-post
    path: /api/products
    method: POST
    test: tests/api/products/products.collection.post.api.spec.ts
    client: http/products/productsCollectionPostClient.ts
    status: TODO
  - id: products-by-id-get
    path: /api/products/{id}
    method: GET
    test: tests/api/products/products.by-id.get.api.spec.ts
    client: http/products/productsByIdGetClient.ts
    status: TODO
  - id: products-by-id-put
    path: /api/products/{id}
    method: PUT
    test: tests/api/products/products.by-id.put.api.spec.ts
    client: http/products/productsByIdPutClient.ts
    status: TODO
  - id: products-by-id-delete
    path: /api/products/{id}
    method: DELETE
    test: tests/api/products/products.by-id.delete.api.spec.ts
    client: http/products/productsByIdDeleteClient.ts
    status: TODO

  # Shopping Cart
  - id: cart-collection-get
    path: /api/cart
    method: GET
    test: tests/api/cart/cart.collection.get.api.spec.ts
    client: http/cart/cartCollectionGetClient.ts
    status: TODO
  - id: cart-collection-delete
    path: /api/cart
    method: DELETE
    test: tests/api/cart/cart.collection.delete.api.spec.ts
    client: http/cart/cartCollectionDeleteClient.ts
    status: TODO
  - id: cart-items-collection-post
    path: /api/cart/items
    method: POST
    test: tests/api/cart/cart.items.collection.post.api.spec.ts
    client: http/cart/cartItemsCollectionPostClient.ts
    status: TODO
  - id: cart-items-by-id-put
    path: /api/cart/items/{productId}
    method: PUT
    test: tests/api/cart/cart.items.by-id.put.api.spec.ts
    client: http/cart/cartItemsByIdPutClient.ts
    status: TODO
  - id: cart-items-by-id-delete
    path: /api/cart/items/{productId}
    method: DELETE
    test: tests/api/cart/cart.items.by-id.delete.api.spec.ts
    client: http/cart/cartItemsByIdDeleteClient.ts
    status: TODO

  # Orders Management
  - id: orders-collection-get
    path: /api/orders
    method: GET
    test: tests/api/orders/orders.collection.get.api.spec.ts
    client: http/orders/ordersCollectionGetClient.ts
    status: TODO
  - id: orders-collection-post
    path: /api/orders
    method: POST
    test: tests/api/orders/orders.collection.post.api.spec.ts
    client: http/orders/ordersCollectionPostClient.ts
    status: TODO
  - id: orders-by-id
    path: /api/orders/{id}
    method: GET
    test: tests/api/orders/orders.by-id.api.spec.ts
    client: http/orders/ordersByIdClient.ts
    status: TODO
  - id: orders-cancel
    path: /api/orders/{id}/cancel
    method: POST
    test: tests/api/orders/orders.cancel.api.spec.ts
    client: http/orders/ordersCancelClient.ts
    status: TODO
  - id: orders-status
    path: /api/orders/{id}/status
    method: PUT
    test: tests/api/orders/orders.status.api.spec.ts
    client: http/orders/ordersStatusClient.ts
    status: TODO
  - id: orders-admin
    path: /api/orders/admin
    method: GET
    test: tests/api/orders/orders.admin.api.spec.ts
    client: http/orders/ordersAdminClient.ts
    status: TODO

  # AI Integration (Ollama)
  - id: ollama-generate
    path: /api/ollama/generate
    method: POST
    test: tests/api/ollama/ollama.generate.api.spec.ts
    client: http/ollama/ollamaGenerateClient.ts
    status: TODO
  - id: ollama-chat
    path: /api/ollama/chat
    method: POST
    test: tests/api/ollama/ollama.chat.api.spec.ts
    client: http/ollama/ollamaChatClient.ts
    status: TODO

  # Utilities
  - id: qr-create
    path: /qr/create
    method: POST
    test: tests/api/qr/qr.create.api.spec.ts
    client: http/qr/qrCreateClient.ts
    status: TODO
  - id: email-send
    path: /email
    method: POST
    test: tests/api/email/email.send.api.spec.ts
    client: http/email/emailSendClient.ts
    status: TODO
  - id: traffic-info
    path: /api/traffic/info
    method: GET
    test: tests/api/traffic/traffic.info.api.spec.ts
    client: http/traffic/trafficInfoClient.ts
    status: TODO
```

---

## 🎯 Test Design Notes (per Area)

### Users Management
- **`/users/{username}`:** GET (200/404/401), PUT (UserEditDto validation, email required, 403 for insufficient roles), DELETE (403 for insufficient roles)
- **`/users/me` + `/users/refresh`:** Bearer token required, schema validation, token rotation semantics
- **System Prompt:** Separate GET/PUT files, SystemPromptDto validation, max length ≤ 500 chars, idempotency checks

### Products Management
- **Admin-gated operations:** POST/PUT/DELETE require admin role (403 responses)
- **DTO validation:** Name length (3-100), price ≥ 0.01, stock ≥ 0, category/imageUrl patterns

### Shopping Cart
- **Item management:** Add/update/remove with quantity validation
- **Cart totals:** Verify price calculations and item counts on CartDto
- **Error handling:** 404 for missing products, 400 for invalid input

### Orders Management
- **Order creation:** From cart with AddressDto (required fields, ZIP patterns)
- **State transitions:** Cancel rules (400 for illegal states), admin status updates
- **Admin listing:** Full order access for administrators

### AI Integration (Ollama)
- **SSE validation:** Stream framing, done flags, latency budgets
- **Error handling:** Model not found (404 → JSON), server errors (500)

### Utilities
- **QR Code:** PNG binary response, content-type validation, buffer length checks
- **Email:** Required fields validation, 400 for invalid email data
- **Traffic Info:** WebSocket endpoint/topic metadata retrieval

---

## 🤖 AI Agent Execution Guidelines

### Resource Management
- **Unique identifiers:** Append timestamps/UUIDs to all created resources
- **Cleanup strategy:** Self-deleting writes (products, orders, users where permitted)

### Test Organization
- **Fixture sharing:** Use `test.extend` for auth tokens only
- **Parallel execution:** Group by tags (`@users`, `@products`, `@cart`, `@orders`, etc.)

### Contract Testing
- **Schema snapshots:** Store DTO shapes in stable folder
- **Breaking change detection:** Fail on schema mismatches

### Development Workflow
- **Scaffolding available:** Request empty test/client file templates
- **Incremental implementation:** One endpoint method at a time
- **Validation order:** Follow OpenAPI response codes (200 → 400 → 401 → 403 → 404)

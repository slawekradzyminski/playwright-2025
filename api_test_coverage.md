# API Test Coverage Plan

Last verified: 2026-01-30
Source of truth:
- OpenAPI specification: `api-docs.json`
- Base URL: http://localhost:4001

## Current Playwright API coverage (existing tests)
- Covered endpoints:
  - `POST /users/signin` (tests/api/login.api.spec.ts)

## Endpoint inventory + coverage status
Legend: [x] covered, [~] partial, [ ] not covered

### Authentication & User Management (users)
- [x] `POST /users/signin` - Authenticate user and return JWT token
- [ ] `POST /users/signup` - Create a new user account
- [ ] `POST /users/refresh` - Refresh JWT token using refresh token
- [ ] `POST /users/logout` - Logout user and revoke refresh token
- [ ] `GET /users/me` - Get current user information
- [ ] `GET /users` - Get all users (protected)
- [ ] `GET /users/{username}` - Get user by username
- [ ] `PUT /users/{username}` - Update user
- [ ] `DELETE /users/{username}` - Delete user
- [ ] `GET /users/chat-system-prompt` - Get your chat system prompt
- [ ] `PUT /users/chat-system-prompt` - Update your chat system prompt
- [ ] `GET /users/tool-system-prompt` - Get your tool system prompt
- [ ] `PUT /users/tool-system-prompt` - Update your tool system prompt

### Password Reset (password-reset)
- [ ] `POST /users/password/forgot` - Start password reset flow
- [ ] `POST /users/password/reset` - Complete password reset with a valid token

### Products (Products)
- [ ] `GET /api/products` - Get all products (protected)
- [ ] `GET /api/products/{id}` - Get product by ID
- [ ] `POST /api/products` - Create new product (admin only)
- [ ] `PUT /api/products/{id}` - Update existing product (admin only)
- [ ] `DELETE /api/products/{id}` - Delete product (admin only)

### Cart (Cart)
- [ ] `GET /api/cart` - Get current user's cart
- [ ] `POST /api/cart/items` - Add item to cart
- [ ] `PUT /api/cart/items/{productId}` - Update item quantity
- [ ] `DELETE /api/cart/items/{productId}` - Remove item from cart
- [ ] `DELETE /api/cart` - Clear cart

### Orders (Orders)
- [ ] `GET /api/orders` - Get user's orders (with pagination & status filter)
- [ ] `GET /api/orders/{id}` - Get order by ID
- [ ] `POST /api/orders` - Create a new order from cart
- [ ] `POST /api/orders/{id}/cancel` - Cancel order
- [ ] `GET /api/orders/admin` - Get all orders (admin only, with pagination)
- [ ] `PUT /api/orders/{id}/status` - Update order status (admin only)

### Ollama/LLM (ollama)
- [ ] `POST /api/ollama/chat` - Chat with Ollama model (stateless, SSE)
- [ ] `POST /api/ollama/generate` - Generate text using Ollama model (SSE)
- [ ] `POST /api/ollama/chat/tools` - Chat with Ollama using function calling (SSE)
- [ ] `GET /api/ollama/chat/tools/definitions` - List tool definitions

### Utilities
- [ ] `POST /qr/create` - Generate QR code (returns image/png)
- [ ] `POST /email` - Send email
- [ ] `GET /api/traffic/info` - Get traffic monitoring information

### Local Testing Helpers (local-email-outbox)
- [ ] `GET /local/email/outbox` - Fetch all queued emails (local profile only)
- [ ] `DELETE /local/email/outbox` - Clear the local outbox buffer

## Implementation plan (trackable)

### P0: Core authentication flows
- [x] Add `login.api.spec.ts` for `POST /users/signin`
  - Valid credentials (200), empty username (400), short username (400), short password (400), invalid credentials (422)
- [ ] Add `signup.api.spec.ts` for `POST /users/signup`
  - Valid registration (201), missing required fields (400), duplicate username (400), invalid email format (400)
- [ ] Add `refresh.api.spec.ts` for `POST /users/refresh`
  - Valid refresh token (200), invalid token (401), missing token (400)
- [ ] Add `logout.api.spec.ts` for `POST /users/logout`
  - Successful logout (200), unauthorized without token (401)

### P0: Product catalog
- [ ] Add `products.api.spec.ts` for `GET /api/products` and `GET /api/products/{id}`
  - List all products (200), get specific product (200), product not found (404), unauthorized (401)
- [ ] Add `productsAdmin.api.spec.ts` for `POST/PUT/DELETE /api/products`
  - Create product (201), update product (200), delete product (204), unauthorized (401), forbidden for non-admin (403), validation errors (400), not found (404)

### P1: Shopping cart flow
- [ ] Add `cart.api.spec.ts` for cart endpoints
  - Get empty cart (200), add item (200), update quantity (200), remove item (200), clear cart (204), product not found (404), cart item not found (404), invalid quantity (400), unauthorized (401)

### P1: Order management
- [ ] Add `orders.api.spec.ts` for user order endpoints
  - Get orders with pagination (200), get order by ID (200), create order from cart (201), cancel order (200), empty cart (400), order not found (404), cannot cancel (400), unauthorized (401)
- [ ] Add `ordersAdmin.api.spec.ts` for admin order endpoints
  - Get all orders with filters (200), update order status (200), invalid status transition (400), forbidden for non-admin (403), unauthorized (401)

### P1: User management
- [ ] Add `users.api.spec.ts` for user CRUD
  - Get all users (200), get user by username (200), update user (200), delete user (204), user not found (404), unauthorized (401), forbidden (403)
- [ ] Add `userPrompts.api.spec.ts` for system prompts
  - Get chat prompt (200), update chat prompt (200), get tool prompt (200), update tool prompt (200), unauthorized (401)

### P2: Password recovery
- [ ] Add `passwordReset.api.spec.ts`
  - Forgot password (202), reset password (200), invalid token (400), invalid payload (400)

### P3: LLM endpoints
- [ ] Add `ollama.api.spec.ts`
  - Chat endpoint SSE response (200), generate endpoint SSE response (200), tools endpoint SSE response (200), get tool definitions (200), model not found (404), invalid request (400), unauthorized (401), server error (500)

### P3: Utilities
- [ ] Add `qr.api.spec.ts`
  - Generate QR code (200), invalid input (400), unauthorized (401)
- [ ] Add `email.api.spec.ts`
  - Send email (200), invalid data (400), unauthorized (401)
- [ ] Add `traffic.api.spec.ts`
  - Get traffic info (200), unauthorized (401)

### P4: Local helpers (testing only)
- [ ] Add `localEmailOutbox.api.spec.ts`
  - Get outbox (200), clear outbox (200)

## Test data assumptions
- Admin credentials in `.env`: admin/admin
- Client credentials in `.env`: client/client
- Products seeded in database
- JWT token expiration: 1 hour (adjust test timing if needed)
- Refresh token rotation enabled
- Local email outbox only available in local profile

## Testing patterns
- Use `auth.setup.ts` for authenticated requests (Bearer token)
- Store tokens in test context for reuse across tests
- Validate response schemas match OpenAPI definitions
- Test both success and error paths
- Test pagination, filtering, and sorting where applicable
- Test SSE (Server-Sent Events) for streaming endpoints (ollama)
- Use test fixtures for common request bodies
- Clean up test data where necessary (orders, cart items)

## Security testing considerations
- Verify all protected endpoints require Bearer token (401 without token)
- Verify role-based access control (403 for insufficient permissions)
- Verify admin-only endpoints reject non-admin users
- Verify users can only access their own data (cart, orders, profile)
- Verify JWT token validation and expiration
- Verify refresh token rotation and revocation

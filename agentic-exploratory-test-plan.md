# Agentic-Led Exploratory API Testing Plan

This plan outlines agentic-led exploratory testing sessions for API endpoints. The agent can use the documentation available in `api-docs.json` and execute curl commands interactively to explore endpoint behavior, edge cases, and integration flows. Endpoints are ordered from foundational authentication flows (top) to more complex operations (bottom).

## Testing Approach

The agent should:
- Reference `api-docs.json` for endpoint specifications, request/response schemas, and status codes
- Use curl commands to interact with the API running at `http://localhost:4001`
- Explore happy paths, error conditions, validation boundaries, and integration scenarios
- Document findings, unexpected behaviors, and potential issues discovered during exploration
- Test authentication flows first, then use obtained tokens for authenticated endpoints

## Example curl Command Format

```bash
curl -X 'POST' \
  'http://localhost:4001/users/signin' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "admin",
  "password": "admin"
}'
```

## Exploratory Testing Sessions

### Session 1: Authentication Foundation

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 1 | `POST /users/signup` | Happy path registration, validation errors (email format, password length, username constraints), duplicate username/email handling, role assignment | `curl -X 'POST' 'http://localhost:4001/users/signup' -H 'accept: */*' -H 'Content-Type: application/json' -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","roles":["ROLE_CLIENT"]}'` |
| 2 | `POST /users/signin` | Successful authentication with valid credentials, invalid username/password combinations, missing fields, malformed JSON, token structure validation | `curl -X 'POST' 'http://localhost:4001/users/signin' -H 'accept: */*' -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin"}'` |

### Session 2: User Profile & Management

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 3 | `GET /users/me` | Retrieve own profile with valid token, expired/invalid token handling, token format validation | `curl -X 'GET' 'http://localhost:4001/users/me' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 4 | `GET /users/refresh` | Token refresh mechanism, expired token refresh, invalid token refresh | `curl -X 'GET' 'http://localhost:4001/users/refresh' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 5 | `GET /users` | List all users (admin), unauthorized access attempts, pagination if applicable | `curl -X 'GET' 'http://localhost:4001/users' -H 'accept: */*' -H 'Authorization: Bearer <admin_token>'` |
| 6 | `GET /users/{username}` | Retrieve user by username (own profile vs admin viewing others), non-existent user, unauthorized access | `curl -X 'GET' 'http://localhost:4001/users/testuser' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 7 | `PUT /users/{username}` | Self-update profile, admin updating others, validation errors, permission boundaries | `curl -X 'PUT' 'http://localhost:4001/users/testuser' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"email":"updated@example.com","firstName":"Updated","lastName":"Name"}'` |
| 8 | `DELETE /users/{username}` | Admin deletion, self-deletion attempts, non-existent user deletion, permission checks | `curl -X 'DELETE' 'http://localhost:4001/users/testuser' -H 'accept: */*' -H 'Authorization: Bearer <admin_token>'` |

### Session 3: System Prompt Management

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 9 | `GET /users/system-prompt` | Retrieve system prompt (null vs existing), authenticated access only | `curl -X 'GET' 'http://localhost:4001/users/system-prompt' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 10 | `PUT /users/system-prompt` | Update system prompt, length validation (max 500 chars), empty prompt handling | `curl -X 'PUT' 'http://localhost:4001/users/system-prompt' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"systemPrompt":"You are a helpful assistant."}'` |

### Session 4: Product Catalog

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 11 | `GET /api/products` | List all products, empty catalog, authenticated access | `curl -X 'GET' 'http://localhost:4001/api/products' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 12 | `POST /api/products` | Create product (admin only), validation (price, stock, name length), unauthorized creation attempts | `curl -X 'POST' 'http://localhost:4001/api/products' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>' -d '{"name":"Test Product","description":"A test product","price":99.99,"stockQuantity":10,"category":"Electronics"}'` |
| 13 | `GET /api/products/{id}` | Retrieve product by ID, non-existent product, invalid ID format | `curl -X 'GET' 'http://localhost:4001/api/products/1' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 14 | `PUT /api/products/{id}` | Update product (admin only), partial updates, validation errors | `curl -X 'PUT' 'http://localhost:4001/api/products/1' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>' -d '{"name":"Updated Product","price":149.99}'` |
| 15 | `DELETE /api/products/{id}` | Delete product (admin only), deletion of non-existent product, unauthorized attempts | `curl -X 'DELETE' 'http://localhost:4001/api/products/1' -H 'accept: */*' -H 'Authorization: Bearer <admin_token>'` |

### Session 5: Shopping Cart

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 16 | `GET /api/cart` | Retrieve cart (empty vs populated), authenticated access | `curl -X 'GET' 'http://localhost:4001/api/cart' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 17 | `POST /api/cart/items` | Add item to cart, quantity handling, non-existent product, invalid quantity | `curl -X 'POST' 'http://localhost:4001/api/cart/items' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"productId":1,"quantity":2}'` |
| 18 | `PUT /api/cart/items/{productId}` | Update cart item quantity, zero quantity, negative quantity, non-existent cart item | `curl -X 'PUT' 'http://localhost:4001/api/cart/items/1' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"quantity":5}'` |
| 19 | `DELETE /api/cart/items/{productId}` | Remove item from cart, non-existent item removal | `curl -X 'DELETE' 'http://localhost:4001/api/cart/items/1' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 20 | `DELETE /api/cart` | Clear entire cart, empty cart clearing | `curl -X 'DELETE' 'http://localhost:4001/api/cart' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |

### Session 6: Order Management

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 21 | `POST /api/orders` | Create order from cart, empty cart handling, address validation, order total calculation | `curl -X 'POST' 'http://localhost:4001/api/orders' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"street":"123 Main St","city":"New York","state":"NY","zipCode":"10001","country":"USA"}'` |
| 22 | `GET /api/orders` | List user's orders, status filtering, pagination, empty order list | `curl -X 'GET' 'http://localhost:4001/api/orders?status=PENDING' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 23 | `GET /api/orders/{id}` | Retrieve order by ID, own order vs admin viewing any order, non-existent order | `curl -X 'GET' 'http://localhost:4001/api/orders/1' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 24 | `GET /api/orders/admin` | Admin order listing, status filtering, pagination, unauthorized access | `curl -X 'GET' 'http://localhost:4001/api/orders/admin?status=PAID' -H 'accept: */*' -H 'Authorization: Bearer <admin_token>'` |
| 25 | `POST /api/orders/{id}/cancel` | Cancel order, double cancellation, canceling non-existent order, status transition validation | `curl -X 'POST' 'http://localhost:4001/api/orders/1/cancel' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |
| 26 | `PUT /api/orders/{id}/status` | Update order status (admin only), invalid status transitions, status enum validation | `curl -X 'PUT' 'http://localhost:4001/api/orders/1/status' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <admin_token>' -d '"SHIPPED"'` |

### Session 7: Additional Features

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 27 | `POST /email` | Send email, recipient validation, subject/message requirements, unauthorized access | `curl -X 'POST' 'http://localhost:4001/email' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"to":"recipient@example.com","subject":"Test Subject","message":"Test message"}'` |
| 28 | `POST /qr/create` | Generate QR code, text validation, response format (image/png), unauthorized access | `curl -X 'POST' 'http://localhost:4001/qr/create' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"text":"https://awesome-testing.com"}'` |
| 29 | `GET /api/traffic/info` | Retrieve traffic monitoring info, WebSocket endpoint details, authenticated access | `curl -X 'GET' 'http://localhost:4001/api/traffic/info' -H 'accept: */*' -H 'Authorization: Bearer <token>'` |

### Session 8: Advanced Features (LATE)

| Order | Method & Endpoint | Focus Areas | Example curl Command |
| --- | --- | --- | --- |
| 30 | `POST /api/ollama/chat` | Chat with Ollama model, streaming response handling, model availability, conversation history, system prompt integration | `curl -X 'POST' 'http://localhost:4001/api/ollama/chat' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"model":"qwen3:0.6b","messages":[{"role":"user","content":"Hello"}],"think":false}'` |
| 31 | `POST /api/ollama/generate` | Text generation, streaming output, model options, prompt validation | `curl -X 'POST' 'http://localhost:4001/api/ollama/generate' -H 'accept: */*' -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{"model":"qwen3:0.6b","prompt":"Hello, how are you?","think":false}'` |

## Notes for Agent

- Always start with Session 1 (authentication) to obtain valid tokens for subsequent sessions
- Save tokens from signin responses for use in authenticated endpoints
- Test both client (`ROLE_CLIENT`) and admin (`ROLE_ADMIN`) user flows where applicable
- Pay attention to response status codes, headers, and body structures as documented in `api-docs.json`
- Explore edge cases: boundary values, missing fields, invalid formats, unauthorized access attempts
- Document any discrepancies between actual API behavior and the OpenAPI specification
- Test integration flows: signup → signin → use token → perform operations → verify state changes


# API Test Plan

This document tracks the testing progress for all endpoints defined in the API documentation. Tests follow the established patterns using HTTP clients and the `apiAuthFixture.ts` structure.

## Test Coverage Status

### ✅ **COMPLETED** - Fully Tested Endpoints

#### Authentication & Registration
- **POST** `/users/signup` - User registration
  - ✅ Valid user creation (201)
  - ✅ Username validation (400) - too short, minimum length
  - ✅ Password validation (400) - too short, minimum length
  - ✅ Email validation (400) - invalid format
  - ✅ Roles validation (400) - missing roles

- **POST** `/users/signin` - User login
  - ✅ Valid credentials authentication (200)
  - ✅ Username validation (400) - empty, too short
  - ✅ Password validation (400) - too short
  - ✅ Invalid credentials handling (422)

- **GET** `/users` - Get all users
  - ✅ Successful retrieval with valid token (200)
  - ✅ Unauthorized access without token (401)
  - ✅ Invalid token handling (401)

#### Products
- **POST** `/api/products` - Create new product
  - ✅ Valid product creation for admin (201)
  - ✅ Product validation (400) - invalid name, negative price
  - ✅ Authorization checks (401, 403)
  - ✅ Role-based access control (admin vs client)

### 🔄 **IN PROGRESS** - Currently Being Implemented

*No endpoints currently in progress*

### 📝 **TODO** - Need Implementation

#### User Management (High Priority)
- **GET** `/users/refresh` - Token refresh
  - Valid token refresh (200)
  - Invalid/expired token handling (401)

- **GET** `/users/me` - Get current user information
  - Current user retrieval (200)
  - Authorization checks (401)

- **GET** `/users/{username}` - Get user by username
  - Existing user retrieval (200)
  - Non-existent user (404)
  - Authorization checks (401, 403)

- **PUT** `/users/{username}` - Update user
  - Successful update (200)
  - Non-existent user (404)
  - Authorization checks (401, 403)
  - Validation errors (400)

- **DELETE** `/users/{username}` - Delete user
  - Successful deletion (204)
  - Non-existent user (404)
  - Authorization checks (401, 403)

- **GET** `/users/{username}/system-prompt` - Get user's system prompt
  - Retrieve system prompt (200)
  - Non-existent user (404)
  - Authorization checks (401, 403)

- **PUT** `/users/{username}/system-prompt` - Update user's system prompt
  - Update system prompt (200)
  - Non-existent user (404)
  - Authorization checks (401, 403)
  - Validation errors (400)

#### Products (Medium Priority)
- **GET** `/api/products` - Get all products
  - Retrieve all products (200)
  - Authorization checks (401)
  - Response validation

- **GET** `/api/products/{id}` - Get product by ID
  - Existing product retrieval (200)
  - Non-existent product (404)
  - Authorization checks (401)

- **PUT** `/api/products/{id}` - Update existing product
  - Successful update (200)
  - Non-existent product (404)
  - Authorization checks (401, 403)
  - Validation errors (400)

- **DELETE** `/api/products/{id}` - Delete product
  - Successful deletion (204)
  - Non-existent product (404)
  - Authorization checks (401, 403)

#### Orders (Medium Priority)
- **GET** `/api/orders` - Get user's orders
  - Retrieve user orders (200)
  - Authorization checks (401)
  - Pagination parameters
  - Status filtering

- **POST** `/api/orders` - Create a new order from cart
  - Order creation from cart (201)
  - Empty cart handling (400)
  - Authorization checks (401)
  - Address validation

- **GET** `/api/orders/{id}` - Get order by ID
  - Existing order retrieval (200)
  - Non-existent order (404)
  - Authorization checks (401)

- **PUT** `/api/orders/{id}/status` - Update order status (Admin only)
  - Status update (200)
  - Invalid status transition (400)
  - Non-existent order (404)
  - Authorization checks (401, 403)

- **POST** `/api/orders/{id}/cancel` - Cancel order
  - Order cancellation (200)
  - Non-cancellable order (400)
  - Non-existent order (404)
  - Authorization checks (401)

- **GET** `/api/orders/admin` - Get all orders (Admin only)
  - Retrieve all orders (200)
  - Status filtering
  - Pagination parameters
  - Authorization checks (401, 403)

#### Cart (Medium Priority)
- **GET** `/api/cart` - Get current user's cart
  - Retrieve cart (200)
  - Authorization checks (401)

- **DELETE** `/api/cart` - Clear cart
  - Cart clearing (200)
  - Authorization checks (401)

- **POST** `/api/cart/items` - Add item to cart
  - Add item (200)
  - Product not found (404)
  - Authorization checks (401)
  - Validation errors (400)

- **PUT** `/api/cart/items/{productId}` - Update item quantity
  - Update quantity (200)
  - Cart item not found (404)
  - Authorization checks (401)
  - Validation errors (400)

- **DELETE** `/api/cart/items/{productId}` - Remove item from cart
  - Remove item (200)
  - Cart item not found (404)
  - Authorization checks (401)

#### Other Endpoints (Low Priority)
- **POST** `/qr/create` - Generate QR code
  - QR code generation (200)
  - Invalid input (400)
  - Authorization checks (401)

- **POST** `/email` - Send email
  - Email sending (200)
  - Invalid email data (400)
  - Authorization checks (401)

- **POST** `/api/ollama/generate` - Generate text using Ollama model
  - Text generation (200)
  - Model not found (404)
  - Invalid request (400)
  - Authorization checks (401)
  - Server error handling (500)

- **POST** `/api/ollama/chat` - Chat with Ollama model
  - Chat response (200)
  - Model not found (404)
  - Invalid request (400)
  - Authorization checks (401)
  - Server error handling (500)

- **GET** `/api/traffic/info` - Get traffic monitoring information
  - Traffic info retrieval (200)
  - Authorization checks (401)

## Implementation Guidelines

### HTTP Client Structure
Each endpoint group should have its own HTTP client file in the `http/` folder:

```
http/
├── authClient.ts          # Authentication endpoints (signin, refresh, me)
├── userManagementClient.ts # User CRUD and system prompt endpoints
├── productsClient.ts      # All product endpoints (extend existing)
├── ordersClient.ts        # All order endpoints
├── cartClient.ts          # All cart endpoints
├── qrClient.ts           # QR code endpoints
├── emailClient.ts        # Email endpoints
├── ollamaClient.ts       # Ollama endpoints
└── trafficClient.ts      # Traffic monitoring endpoints
```

### Test Structure
Each endpoint should have its own test file in the `tests/api/` folder:

```
tests/api/
├── auth.api.spec.ts           # Authentication tests
├── user-management.api.spec.ts # User management tests
├── products-read.api.spec.ts  # Product GET endpoints
├── products-crud.api.spec.ts  # Product PUT/DELETE endpoints
├── orders.api.spec.ts         # Order management tests
├── cart.api.spec.ts           # Cart management tests
├── qr.api.spec.ts            # QR code tests
├── email.api.spec.ts          # Email tests
├── ollama.api.spec.ts         # Ollama tests
└── traffic.api.spec.ts        # Traffic monitoring tests
```

### Test Patterns
Follow established patterns from existing tests:

1. **Given/When/Then** structure in comments
2. **Authentication fixtures** for role-based testing
3. **Response validation** functions for complex responses
4. **Error response testing** - focus on key error cases, not exhaustive validation testing
5. **Order tests by response code** (200 → 400 → 401 → 403 → 404 → etc.)

### Required HTTP Client Functions

#### authClient.ts
```typescript
export const refreshToken = async (request: APIRequestContext, token: string)
export const getCurrentUser = async (request: APIRequestContext, token: string)
```

#### userManagementClient.ts
```typescript
export const getUserByUsername = async (request: APIRequestContext, username: string, token: string)
export const updateUser = async (request: APIRequestContext, username: string, userData: UserEditDto, token: string)
export const deleteUser = async (request: APIRequestContext, username: string, token: string)
export const getUserSystemPrompt = async (request: APIRequestContext, username: string, token: string)
export const updateUserSystemPrompt = async (request: APIRequestContext, username: string, promptData: SystemPromptDto, token: string)
```

#### productsClient.ts (extend existing)
```typescript
export const getAllProducts = async (request: APIRequestContext, token?: string)
export const getProductById = async (request: APIRequestContext, id: number, token?: string)
export const updateProduct = async (request: APIRequestContext, id: number, productData: ProductUpdateDto, token: string)
export const deleteProduct = async (request: APIRequestContext, id: number, token: string)
```

#### ordersClient.ts
```typescript
export const getUserOrders = async (request: APIRequestContext, token: string, params?: { page?: number, size?: number, status?: string })
export const createOrder = async (request: APIRequestContext, addressData: AddressDto, token: string)
export const getOrderById = async (request: APIRequestContext, id: number, token: string)
export const updateOrderStatus = async (request: APIRequestContext, id: number, status: string, token: string)
export const cancelOrder = async (request: APIRequestContext, id: number, token: string)
export const getAllOrdersAdmin = async (request: APIRequestContext, token: string, params?: { status?: string, page?: number, size?: number })
```

#### cartClient.ts
```typescript
export const getCart = async (request: APIRequestContext, token: string)
export const clearCart = async (request: APIRequestContext, token: string)
export const addToCart = async (request: APIRequestContext, itemData: CartItemDto, token: string)
export const updateCartItem = async (request: APIRequestContext, productId: number, quantityData: UpdateCartItemDto, token: string)
export const removeFromCart = async (request: APIRequestContext, productId: number, token: string)
```

#### qrClient.ts
```typescript
export const createQrCode = async (request: APIRequestContext, qrData: CreateQrDto, token: string)
```

#### emailClient.ts
```typescript
export const sendEmail = async (request: APIRequestContext, emailData: EmailDto, token: string)
```

#### ollamaClient.ts
```typescript
export const generateText = async (request: APIRequestContext, generateData: StreamedRequestDto, token: string)
export const chatWithModel = async (request: APIRequestContext, chatData: ChatRequestDto, token: string)
```

#### trafficClient.ts
```typescript
export const getTrafficInfo = async (request: APIRequestContext, token: string)
```

## Progress Tracking

### Phase 1: Authentication & User Management (High Priority)
- [ ] Token refresh functionality
- [ ] Current user information retrieval
- [ ] User CRUD operations
- [ ] System prompt management

### Phase 2: Products (Medium Priority)
- [ ] Product retrieval endpoints
- [ ] Product update and deletion
- [ ] Complete product CRUD cycle

### Phase 3: Orders & Cart (Medium Priority)
- [ ] Order management system
- [ ] Shopping cart functionality
- [ ] Complete e-commerce flow

### Phase 4: Additional Features (Low Priority)
- [ ] QR code generation
- [ ] Email functionality
- [ ] Ollama integration
- [ ] Traffic monitoring

## Next Steps

1. Start with **Phase 1** - implement missing authentication and user management endpoints
2. Create required HTTP clients following the existing pattern
3. Write comprehensive tests with proper error handling
4. Update this document as each endpoint is completed
5. Follow the established testing patterns and structure

---

*Last updated: October 2025*
*Track progress by updating completion status and moving items between sections*

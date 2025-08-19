# API Test Coverage Plan

## Overview
This document tracks the implementation status of API tests for all endpoints in the JWT Authentication API.

**Base URL:** `http://localhost:4001`

## Coverage Status Legend
- ✅ **DONE** - Tests implemented and complete
- 🚧 **IN_PROGRESS** - Currently being implemented
- 📋 **TODO** - Not yet started
- ⚠️ **BLOCKED** - Waiting for dependencies or clarification

---

## Test Coverage by Endpoint

### 1. Authentication Endpoints

#### `/users/signin` (POST) - User Login
**Status:** ✅ **DONE**
- ✅ 200 - Successfully authenticate with valid credentials
- ✅ 400 - Field validation failed (empty username)
- ✅ 422 - Invalid username/password supplied
- **File:** `tests/api/login.api.spec.ts`

#### `/users/signup` (POST) - User Registration
**Status:** ✅ **DONE**
- ✅ 201 - User was successfully created
- ✅ 400 - Validation failed (various field validations)
- ✅ 500 - Server error for certain invalid inputs
- **File:** `tests/api/registration.api.spec.ts`

#### `/users/refresh` (GET) - Refresh JWT Token
**Status:** ✅ **DONE**
- ✅ 200 - New JWT token
- ✅ 401 - Unauthorized – Missing or invalid token
- **File:** `tests/api/auth-refresh.api.spec.ts`

### 2. User Management Endpoints

#### `/users` (GET) - Get All Users
**Status:** ✅ **DONE**
- ✅ 200 - List of users
- ✅ 401 - Unauthorized – Missing or invalid token
- **File:** `tests/api/users.api.spec.ts`

#### `/users/me` (GET) - Get Current User
**Status:** ✅ **DONE**
- ✅ 200 - Current user details
- ✅ 401 - Unauthorized – Missing or invalid token
- **File:** `tests/api/users.api.spec.ts`

#### `/users/{username}` (GET) - Get User by Username
**Status:** ✅ **DONE**
- ✅ 200 - User details
- ✅ 401 - Unauthorized – Missing or invalid token
- ✅ 404 - The user doesn't exist
- **File:** `tests/api/users.api.spec.ts`

#### `/users/{username}` (PUT) - Update User
**Status:** 📋 **TODO**
- 📋 200 - User was updated
- 📋 401 - Unauthorized – Missing or invalid token
- 📋 403 - Forbidden – Insufficient permissions
- 📋 404 - The user doesn't exist
- **File:** `tests/api/users.api.spec.ts`

#### `/users/{username}` (DELETE) - Delete User
**Status:** 📋 **TODO**
- 📋 204 - User was deleted
- 📋 401 - Unauthorized – Missing or invalid token
- 📋 403 - Forbidden – Insufficient permissions
- 📋 404 - The user doesn't exist
- **File:** `tests/api/users.api.spec.ts`

#### `/users/{username}/system-prompt` (GET) - Get User's System Prompt
**Status:** 📋 **TODO**
- 📋 200 - System prompt retrieved successfully
- 📋 401 - Unauthorized - Missing or invalid token
- 📋 403 - Forbidden - Insufficient permissions
- 📋 404 - The user doesn't exist
- **File:** `tests/api/users.api.spec.ts`

#### `/users/{username}/system-prompt` (PUT) - Update User's System Prompt
**Status:** 📋 **TODO**
- 📋 200 - System prompt was updated
- 📋 401 - Unauthorized - Missing or invalid token
- 📋 403 - Forbidden - Insufficient permissions
- 📋 404 - The user doesn't exist
- **File:** `tests/api/users.api.spec.ts`

### 3. Product Management Endpoints

#### `/api/products` (GET) - Get All Products
**Status:** 📋 **TODO**
- 📋 200 - Successfully retrieved products
- 📋 401 - Unauthorized
- **File:** `tests/api/products.api.spec.ts`

#### `/api/products` (POST) - Create New Product
**Status:** 📋 **TODO**
- 📋 201 - Product created successfully
- 📋 400 - Invalid input
- 📋 401 - Unauthorized
- 📋 403 - Forbidden - requires admin role
- **File:** `tests/api/products.api.spec.ts`

#### `/api/products/{id}` (GET) - Get Product by ID
**Status:** 📋 **TODO**
- 📋 200 - Successfully retrieved product
- 📋 401 - Unauthorized
- 📋 404 - Product not found
- **File:** `tests/api/products.api.spec.ts`

#### `/api/products/{id}` (PUT) - Update Product
**Status:** 📋 **TODO**
- 📋 200 - Product updated successfully
- 📋 400 - Invalid input
- 📋 401 - Unauthorized
- 📋 403 - Forbidden - requires admin role
- 📋 404 - Product not found
- **File:** `tests/api/products.api.spec.ts`

#### `/api/products/{id}` (DELETE) - Delete Product
**Status:** 📋 **TODO**
- 📋 204 - Product deleted successfully
- 📋 401 - Unauthorized
- 📋 403 - Forbidden - requires admin role
- 📋 404 - Product not found
- **File:** `tests/api/products.api.spec.ts`

### 4. Shopping Cart Endpoints

#### `/api/cart` (GET) - Get Current User's Cart
**Status:** 📋 **TODO**
- 📋 200 - Successfully retrieved cart
- 📋 401 - Unauthorized
- **File:** `tests/api/cart.api.spec.ts`

#### `/api/cart` (DELETE) - Clear Cart
**Status:** 📋 **TODO**
- 📋 200 - Cart cleared successfully
- 📋 401 - Unauthorized
- **File:** `tests/api/cart.api.spec.ts`

#### `/api/cart/items` (POST) - Add Item to Cart
**Status:** 📋 **TODO**
- 📋 200 - Item added successfully
- 📋 400 - Invalid input
- 📋 401 - Unauthorized
- 📋 404 - Product not found
- **File:** `tests/api/cart.api.spec.ts`

#### `/api/cart/items/{productId}` (PUT) - Update Item Quantity
**Status:** 📋 **TODO**
- 📋 200 - Item quantity updated successfully
- 📋 400 - Invalid input
- 📋 401 - Unauthorized
- 📋 404 - Cart item not found
- **File:** `tests/api/cart.api.spec.ts`

#### `/api/cart/items/{productId}` (DELETE) - Remove Item from Cart
**Status:** 📋 **TODO**
- 📋 200 - Item removed successfully
- 📋 401 - Unauthorized
- 📋 404 - Cart item not found
- **File:** `tests/api/cart.api.spec.ts`

### 5. Order Management Endpoints

#### `/api/orders` (GET) - Get User's Orders
**Status:** 📋 **TODO**
- 📋 200 - Orders retrieved successfully
- 📋 401 - Unauthorized
- **File:** `tests/api/orders.api.spec.ts`

#### `/api/orders` (POST) - Create Order from Cart
**Status:** 📋 **TODO**
- 📋 201 - Order created successfully
- 📋 400 - Invalid input or empty cart
- 📋 401 - Unauthorized
- **File:** `tests/api/orders.api.spec.ts`

#### `/api/orders/{id}` (GET) - Get Order by ID
**Status:** 📋 **TODO**
- 📋 200 - Order retrieved successfully
- 📋 401 - Unauthorized
- 📋 404 - Order not found
- **File:** `tests/api/orders.api.spec.ts`

#### `/api/orders/{id}/cancel` (POST) - Cancel Order
**Status:** 📋 **TODO**
- 📋 200 - Order cancelled successfully
- 📋 400 - Order cannot be cancelled
- 📋 401 - Unauthorized
- 📋 404 - Order not found
- **File:** `tests/api/orders.api.spec.ts`

#### `/api/orders/{id}/status` (PUT) - Update Order Status (Admin)
**Status:** 📋 **TODO**
- 📋 200 - Order status updated successfully
- 📋 400 - Invalid status transition
- 📋 401 - Unauthorized
- 📋 403 - Forbidden
- 📋 404 - Order not found
- **File:** `tests/api/orders.api.spec.ts`

#### `/api/orders/admin` (GET) - Get All Orders (Admin)
**Status:** 📋 **TODO**
- 📋 200 - Orders retrieved successfully
- 📋 401 - Unauthorized
- 📋 403 - Forbidden
- **File:** `tests/api/orders.api.spec.ts`

### 6. Ollama AI Endpoints

#### `/api/ollama/generate` (POST) - Generate Text
**Status:** 📋 **TODO**
- 📋 200 - Successful generation
- 📋 400 - Invalid request
- 📋 401 - Unauthorized
- 📋 404 - Model not found
- 📋 500 - Ollama server error
- **File:** `tests/api/ollama.api.spec.ts`

#### `/api/ollama/chat` (POST) - Chat with Model
**Status:** 📋 **TODO**
- 📋 200 - Successful chat response
- 📋 400 - Invalid request
- 📋 401 - Unauthorized
- 📋 404 - Model not found
- 📋 500 - Ollama server error
- **File:** `tests/api/ollama.api.spec.ts`

### 7. Utility Endpoints

#### `/qr/create` (POST) - Generate QR Code
**Status:** 📋 **TODO**
- 📋 200 - Successfully generated QR code
- 📋 400 - Invalid input
- 📋 401 - Unauthorized
- **File:** `tests/api/qr.api.spec.ts`

#### `/email` (POST) - Send Email
**Status:** 📋 **TODO**
- 📋 200 - Email sent successfully
- 📋 400 - Invalid email data
- 📋 401 - Unauthorized
- **File:** `tests/api/email.api.spec.ts`

#### `/api/traffic/info` (GET) - Get Traffic Monitoring Info
**Status:** 📋 **TODO**
- 📋 200 - Successfully returned info
- 📋 401 - Unauthorized
- **File:** `tests/api/traffic.api.spec.ts`

---

## Implementation Priority

### Phase 1: Core Authentication & User Management (Week 1)
1. ✅ **DONE** - `/users/signup` (Registration)
2. ✅ **DONE** - `/users/refresh` (Token refresh)
3. ✅ **DONE** - `/users/me` (Current user)
4. ✅ **DONE** - `/users` (List users)
5. ✅ **DONE** - `/users/{username}` (Get user by username)
6. 📋 **TODO** - `/users/{username}` (PUT/DELETE operations) - Next Priority

### Phase 2: E-commerce Core (Week 2)
1. 📋 **TODO** - `/api/products` (Product management)
2. 📋 **TODO** - `/api/cart` (Shopping cart)
3. 📋 **TODO** - `/api/orders` (Order management)

### Phase 3: Advanced Features (Week 3)
1. 📋 **TODO** - `/api/ollama` (AI endpoints)
2. 📋 **TODO** - `/qr/create` (QR code generation)
3. 📋 **TODO** - `/email` (Email sending)
4. 📋 **TODO** - `/api/traffic/info` (Traffic monitoring)

---

## Test Infrastructure Setup

### Required Type Definitions
- ✅ `types/auth.ts` - Authentication types (DONE)
- ✅ `types/user.ts` - User management types (DONE)
- 📋 `types/product.ts` - Product types
- 📋 `types/cart.ts` - Cart types
- 📋 `types/order.ts` - Order types
- 📋 `types/ollama.ts` - AI service types
- 📋 `types/common.ts` - Common types (pagination, error responses)

### Dedicated HTTP Clients
Following the pattern established in `http/loginClient.ts`, each API endpoint group should have a dedicated client:
- ✅ `http/loginClient.ts` - Authentication login (DONE)
- ✅ `http/registrationClient.ts` - User registration (DONE)
- ✅ `http/authRefreshClient.ts` - Token refresh (DONE)
- ✅ `http/usersClient.ts` - User management operations (DONE)
- 📋 `http/productsClient.ts` - Product management operations
- 📋 `http/cartClient.ts` - Shopping cart operations
- 📋 `http/ordersClient.ts` - Order management operations
- 📋 `http/ollamaClient.ts` - AI service operations
- 📋 `http/qrClient.ts` - QR code generation
- 📋 `http/emailClient.ts` - Email operations
- 📋 `http/trafficClient.ts` - Traffic monitoring

### Test Utilities
- 📋 `tests/utils/auth-helper.ts` - Authentication utilities
- ✅ `tests/utils/userGenerator.ts` - User data generators using Faker.js (DONE)
- 📋 `tests/utils/test-data.ts` - Other test data generators
- 📋 `tests/utils/api-client.ts` - API client wrapper

### Configuration
- 📋 Update `playwright.config.ts` for API testing setup
- 📋 Environment configuration for different test environments

---

## Coverage Metrics
- **Total Endpoints:** 27
- **Implemented:** 6 (22.2%)
- **In Progress:** 0 (0%)
- **Remaining:** 21 (77.8%)

**Next Action:** Implement user CRUD operations (`/users/{username}` PUT/DELETE endpoints)

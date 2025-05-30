# API Test Coverage Plan

## Overview
Comprehensive plan to test all API endpoints discovered from `/v3/api-docs`. This document tracks progress across all endpoints with different HTTP methods.

## Current Status Summary
- **Total Endpoints**: 22 paths with 35 total method combinations
- **Completed**: 8 endpoints (23%)
- **In Progress**: 0 endpoints
- **Remaining**: 27 method combinations (77%)

---

## 🔐 Authentication Endpoints

### POST /users/signup ✅ COMPLETED
- [x] 201 - User created successfully
- [x] 400 - Validation errors (password too short, existing user)
- **Files**: `tests/api/register.api.spec.ts`, `http/postSignUp.ts`

### POST /users/signin ✅ COMPLETED  
- [x] 200 - Successfully authenticated
- [x] 400 - Validation errors (empty username, short password)
- [x] 422 - Invalid credentials
- **Files**: `tests/api/login.api.spec.ts`, `http/postSignIn.ts`

### GET /users/refresh
- [ ] 200 - New JWT token returned
- [ ] 401 - Invalid/expired token
- **Priority**: High (needed for token management)

---

## 👥 User Management Endpoints

### GET /users ✅ COMPLETED
- [x] 200 - List of users returned
- [x] 401 - Unauthorized (invalid/missing token)
- **Files**: `tests/api/getUsers.api.spec.ts`, `http/getUsers.ts`

### GET /users/me
- [ ] 200 - Current user details
- [ ] 401 - Unauthorized
- **Priority**: High (common endpoint)

### GET /users/{username} ✅ COMPLETED
- [x] 200 - User details returned
- [x] 401 - Unauthorized
- [x] 404 - User not found
- **Files**: `tests/api/getUserByUsername.api.spec.ts`, `http/getUserByUsername.ts`

### PUT /users/{username}
- [ ] 200 - User updated successfully
- [ ] 400 - Invalid input
- [ ] 401 - Unauthorized
- [ ] 403 - Insufficient permissions
- [ ] 404 - User not found
- **Priority**: Medium

### DELETE /users/{username}
- [ ] 204 - User deleted successfully
- [ ] 401 - Unauthorized
- [ ] 403 - Insufficient permissions
- [ ] 404 - User not found
- **Priority**: Medium

### GET /users/{username}/system-prompt
- [ ] 200 - System prompt retrieved
- [ ] 401 - Unauthorized
- [ ] 403 - Insufficient permissions
- [ ] 404 - User not found
- **Priority**: Low

### PUT /users/{username}/system-prompt
- [ ] 200 - System prompt updated
- [ ] 401 - Unauthorized
- [ ] 403 - Insufficient permissions
- [ ] 404 - User not found
- **Priority**: Low

---

## 🛍️ Product Management Endpoints

### GET /api/products ✅ COMPLETED
- [x] 200 - Products list returned
- [x] 401 - Unauthorized
- **Files**: `tests/api/getProducts.api.spec.ts`, `http/getProducts.ts`

### POST /api/products
- [ ] 201 - Product created successfully
- [ ] 400 - Invalid input
- [ ] 401 - Unauthorized
- [ ] 403 - Admin role required
- **Priority**: High

### GET /api/products/{id}
- [ ] 200 - Product details returned
- [ ] 401 - Unauthorized
- [ ] 404 - Product not found
- **Priority**: High

### PUT /api/products/{id}
- [ ] 200 - Product updated successfully
- [ ] 400 - Invalid input
- [ ] 401 - Unauthorized
- [ ] 403 - Admin role required
- [ ] 404 - Product not found
- **Priority**: Medium

### DELETE /api/products/{id}
- [ ] 204 - Product deleted successfully
- [ ] 401 - Unauthorized
- [ ] 403 - Admin role required
- [ ] 404 - Product not found
- **Priority**: Medium

---

## 🛒 Cart Management Endpoints

### GET /api/cart ✅ COMPLETED
- [x] 200 - Cart retrieved successfully
- [x] 401 - Unauthorized
- **Files**: `tests/api/getCart.api.spec.ts`, `http/getCart.ts`

### DELETE /api/cart
- [ ] 200 - Cart cleared successfully
- [ ] 401 - Unauthorized
- **Priority**: High

### POST /api/cart/items
- [ ] 200 - Item added successfully
- [ ] 400 - Invalid input
- [ ] 401 - Unauthorized
- [ ] 404 - Product not found
- **Priority**: High

### PUT /api/cart/items/{productId}
- [ ] 200 - Item quantity updated
- [ ] 400 - Invalid input
- [ ] 401 - Unauthorized
- [ ] 404 - Cart item not found
- **Priority**: High

### DELETE /api/cart/items/{productId}
- [ ] 200 - Item removed successfully
- [ ] 401 - Unauthorized
- [ ] 404 - Cart item not found
- **Priority**: High

---

## 📦 Order Management Endpoints

### GET /api/orders ✅ COMPLETED
- [x] 200 - User orders retrieved
- [x] 401 - Unauthorized
- **Files**: `tests/api/getOrders.api.spec.ts`, `http/getOrders.ts`

### POST /api/orders
- [ ] 201 - Order created successfully
- [ ] 400 - Invalid input or empty cart
- [ ] 401 - Unauthorized
- **Priority**: High

### GET /api/orders/{id}
- [ ] 200 - Order details retrieved
- [ ] 401 - Unauthorized
- [ ] 404 - Order not found
- **Priority**: High

### GET /api/orders/admin
- [ ] 200 - All orders retrieved (Admin only)
- [ ] 401 - Unauthorized
- [ ] 403 - Admin role required
- **Priority**: Medium

### POST /api/orders/{id}/cancel
- [ ] 200 - Order cancelled successfully
- [ ] 400 - Order cannot be cancelled
- [ ] 401 - Unauthorized
- [ ] 404 - Order not found
- **Priority**: Medium

### PUT /api/orders/{id}/status
- [ ] 200 - Order status updated
- [ ] 400 - Invalid status transition
- [ ] 401 - Unauthorized
- [ ] 403 - Admin role required
- [ ] 404 - Order not found
- **Priority**: Medium

---

## 🤖 AI/Ollama Endpoints

### POST /api/ollama/generate
- [ ] 200 - Text generated successfully
- [ ] 400 - Invalid request
- [ ] 401 - Unauthorized
- [ ] 404 - Model not found
- [ ] 500 - Ollama server error
- **Priority**: Low

### POST /api/ollama/chat
- [ ] 200 - Chat response generated
- [ ] 400 - Invalid request
- [ ] 401 - Unauthorized
- [ ] 404 - Model not found
- [ ] 500 - Ollama server error
- **Priority**: Low

---

## 🔧 Utility Endpoints

### POST /email
- [ ] 200 - Email sent successfully
- [ ] 400 - Invalid email data
- [ ] 401 - Unauthorized
- **Priority**: Low

### POST /qr/create ✅ COMPLETED
- [x] 200 - QR code generated successfully (PNG image)
- [x] 400 - Invalid input (empty text, missing text field)
- [x] 401 - Unauthorized (invalid/missing token)
- **Files**: `tests/api/postQrCreate.api.spec.ts`, `http/postQrCreate.ts`

### GET /api/traffic/info
- [ ] 200 - Traffic info returned
- [ ] 401 - Unauthorized
- **Priority**: Low

---

## 📋 Implementation Phases

### Phase 1: Core User Operations (High Priority)
1. `GET /users/me`
2. `GET /users/refresh`
3. `POST /api/products`
4. `GET /api/products/{id}`

### Phase 2: Cart Operations (High Priority)
1. `DELETE /api/cart`
2. `POST /api/cart/items`
3. `PUT /api/cart/items/{productId}`
4. `DELETE /api/cart/items/{productId}`

### Phase 3: Order Operations (High Priority)
1. `POST /api/orders`
2. `GET /api/orders/{id}`

### Phase 4: Admin Operations (Medium Priority)
1. `PUT /api/products/{id}`
2. `DELETE /api/products/{id}`
3. `PUT /users/{username}`
4. `DELETE /users/{username}`
5. `GET /api/orders/admin`
6. `POST /api/orders/{id}/cancel`
7. `PUT /api/orders/{id}/status`

### Phase 5: Advanced Features (Low Priority)
1. System prompt endpoints
2. Ollama AI endpoints
3. Utility endpoints (email, traffic)

---

## 📊 Progress Tracking

### Completed Endpoints (8/22 paths)
- ✅ POST /users/signup
- ✅ POST /users/signin  
- ✅ GET /users
- ✅ GET /users/{username}
- ✅ GET /api/products
- ✅ GET /api/cart
- ✅ GET /api/orders
- ✅ POST /qr/create

### Next Up (Phase 1)
- 🔄 GET /users/me
- 🔄 GET /users/refresh
- 🔄 POST /api/products
- 🔄 GET /api/products/{id}

---

## 📁 File Organization

### Existing Structure
```
fixtures/
  auth.fixtures.ts ✅

types/
  auth.ts ✅
  products.ts ✅
  users.ts ✅
  cart.ts ✅
  orders.ts ✅
  qr.ts ✅

http/
  postSignUp.ts ✅
  postSignIn.ts ✅
  getUsers.ts ✅
  getUserByUsername.ts ✅
  getProducts.ts ✅
  getCart.ts ✅
  getOrders.ts ✅
  postQrCreate.ts ✅

validators/
  productValidator.ts ✅
  userValidator.ts ✅
  cartValidator.ts ✅
  orderValidator.ts ✅

tests/api/
  register.api.spec.ts ✅
  login.api.spec.ts ✅
  getUsers.api.spec.ts ✅
  getUserByUsername.api.spec.ts ✅
  getProducts.api.spec.ts ✅
  getCart.api.spec.ts ✅
  getOrders.api.spec.ts ✅
  postQrCreate.api.spec.ts ✅
```

### Files to Create
- Additional HTTP clients for remaining endpoints
- Additional validators as needed
- Test files for each endpoint
- Additional type definitions for complex responses 
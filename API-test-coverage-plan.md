# API Test Coverage Plan

## Overview
This document tracks the comprehensive test coverage for all API endpoints in the application. The goal is to achieve 100% endpoint coverage with proper error scenario testing.

## Current Coverage Statistics
- **Total Endpoints**: 21 unique paths
- **Total HTTP Methods**: 35 endpoint-method combinations
- **Currently Tested**: 11 endpoint-method combinations
- **Total Test Cases**: 34 tests
- **Coverage Percentage**: 31% (11/35)

## Quick Reference Summary

| Priority | Category | Endpoints | Status | Tests |
|----------|----------|-----------|---------|-------|
| ✅ | **Completed** | 11 endpoints | Done | 34 tests |
| 🔄 | **High Priority** | 8 endpoints | Pending | ~32 tests |
| 🔄 | **Medium Priority** | 8 endpoints | Pending | ~24 tests |
| 🔄 | **Low Priority** | 8 endpoints | Pending | ~16 tests |
| **TOTAL** | | **35 endpoints** | | **~106 tests** |

## Endpoint Coverage Status

### ✅ **COMPLETED** (11/35)

#### Authentication & User Management
- [x] **POST /users/signin** - Login API (4 tests: 200, 400×2, 422)
- [x] **POST /users/signup** - Registration API (2 tests: 201, 400)
- [x] **GET /users** - Get all users (2 tests: 200, 401)
- [x] **GET /users/{username}** - Get user by username (3 tests: 200, 401, 404)

#### Products
- [x] **GET /api/products** - Get all products (2 tests: 200, 401)

#### Cart Management (CRUD operations) - ✅ **COMPLETED**
- [x] **GET /api/cart** - Get user's cart (2 tests: 200, 401)
- [x] **POST /api/cart/items** - Add item to cart (4 tests: 200, 400, 401, 404)
- [x] **PUT /api/cart/items/{productId}** - Update cart item quantity (4 tests: 200, 400, 401, 404)
- [x] **DELETE /api/cart/items/{productId}** - Remove item from cart (3 tests: 200, 401, 404)
- [x] **DELETE /api/cart** - Clear cart (2 tests: 200, 401)

#### Orders
- [x] **GET /api/orders** - Get user's orders (4 tests: 200×3 with different params, 401)

---

### 🔄 **HIGH PRIORITY** - Core Business Logic (8/35)

#### Product Management (Admin operations)
- [ ] **POST /api/products** - Create product (Admin)
  - Tests needed: 201, 400 (validation), 401, 403 (non-admin)
- [ ] **GET /api/products/{id}** - Get product by ID
  - Tests needed: 200, 401, 404 (product not found)
- [ ] **PUT /api/products/{id}** - Update product (Admin)
  - Tests needed: 200, 400 (validation), 401, 403 (non-admin), 404 (product not found)
- [ ] **DELETE /api/products/{id}** - Delete product (Admin)
  - Tests needed: 204, 401, 403 (non-admin), 404 (product not found)

#### Order Management
- [ ] **POST /api/orders** - Create order from cart
  - Tests needed: 201, 400 (empty cart/invalid address), 401
- [ ] **GET /api/orders/{id}** - Get order by ID
  - Tests needed: 200, 401, 404 (order not found)
- [ ] **POST /api/orders/{id}/cancel** - Cancel order
  - Tests needed: 200, 400 (already cancelled/shipped), 401, 404 (order not found)
- [ ] **PUT /api/orders/{id}/status** - Update order status (Admin)
  - Tests needed: 200, 400 (invalid status), 401, 403 (non-admin), 404 (order not found)

---

### 🔄 **MEDIUM PRIORITY** - Admin & Extended Features (8/35)

#### Admin Operations
- [ ] **GET /api/orders/admin** - Get all orders (Admin only)
  - Tests needed: 200, 401, 403 (non-admin)

#### User Management (Extended)
- [ ] **GET /users/me** - Get current user profile
  - Tests needed: 200, 401
- [ ] **PUT /users/{username}** - Update user (Admin or self)
  - Tests needed: 200, 400 (validation), 401, 403 (insufficient permissions), 404 (user not found)
- [ ] **DELETE /users/{username}** - Delete user (Admin)
  - Tests needed: 204, 401, 403 (non-admin), 404 (user not found)
- [ ] **GET /users/refresh** - Refresh token
  - Tests needed: 200, 401
- [ ] **GET /users/{username}/system-prompt** - Get user's system prompt
  - Tests needed: 200, 401, 404 (user not found)
- [ ] **PUT /users/{username}/system-prompt** - Update user's system prompt
  - Tests needed: 200, 400 (validation), 401, 403 (insufficient permissions), 404 (user not found)

#### Utility Services
- [ ] **GET /api/traffic/info** - Get traffic WebSocket info
  - Tests needed: 200

---

### 🔄 **LOW PRIORITY** - External Integrations (8/35)

#### AI/ML Services (Ollama Integration)
- [ ] **POST /api/ollama/generate** - Generate text with Ollama
  - Tests needed: 200, 400 (invalid model/prompt), 401, 404 (model not found)
- [ ] **POST /api/ollama/chat** - Chat with Ollama
  - Tests needed: 200, 400 (invalid messages), 401, 404 (model not found)

#### Communication Services
- [ ] **POST /email** - Send email
  - Tests needed: 200, 400 (invalid email data), 401

#### Utility Services
- [ ] **POST /qr/create** - Generate QR code
  - Tests needed: 200, 400 (invalid text), 401

---

## Implementation Priority Order

### Phase 1: Core Business Logic (Weeks 1-2)
1. ✅ **Cart Management** - Complete CRUD operations for cart items (**COMPLETED**)
2. **Product Management** - Admin product operations
3. **Order Management** - Order lifecycle operations

### Phase 2: Admin & Extended Features (Week 3)
1. **Admin Operations** - Admin-specific endpoints
2. **User Management Extended** - Profile management and system prompts
3. **Utility Services** - Traffic info and other utilities

### Phase 3: External Integrations (Week 4)
1. **AI/ML Services** - Ollama integration testing
2. **Communication Services** - Email functionality
3. **Utility Services** - QR code generation

## Test Implementation Guidelines

### Test Structure Requirements
- Follow given/when/then pattern
- Order tests by response code (200 → 400 → 401 → 403 → 404 → 422)
- Use TypeScript with proper typing
- Implement comprehensive DTO validation

### Authentication Strategy
- Use existing auth fixture for authenticated endpoints
- Create admin user fixture for admin-only endpoints
- Test both authenticated and unauthenticated scenarios

### Error Scenario Coverage
- **401 Unauthorized**: Missing/invalid token
- **403 Forbidden**: Insufficient permissions (admin vs regular user)
- **404 Not Found**: Resource doesn't exist
- **400 Bad Request**: Validation errors, invalid input
- **422 Unprocessable Entity**: Business logic errors

### Required Artifacts per Endpoint
1. **Types**: TypeScript interfaces for request/response DTOs
2. **HTTP Client**: Function in `/http` directory
3. **Validator**: Response validation function in `/validators`
4. **Tests**: Comprehensive test suite in `/tests/api`

## Progress Tracking

### Completed This Sprint
- ✅ GET /api/cart (2 tests)
- ✅ POST /api/cart/items (4 tests)
- ✅ PUT /api/cart/items/{productId} (4 tests)
- ✅ DELETE /api/cart/items/{productId} (3 tests)
- ✅ DELETE /api/cart (2 tests)
- ✅ GET /api/orders (4 tests)
- ✅ GET /users (2 tests)
- ✅ GET /users/{username} (3 tests)

### Next Sprint Goals
- [ ] Implement Product Management (4 endpoints)
- [ ] Add Order Management (4 endpoints)
- [ ] Start Admin Operations (1 endpoint)

### Success Metrics
- **Current Coverage**: 31% (11/35 endpoints)
- **Target Coverage**: 80% by end of Phase 2
- **Quality Gate**: All tests must pass with proper validation
- **Performance**: Test suite execution under 30 seconds

---

## Notes
- ✅ **Cart Management Complete**: All CRUD operations for cart items are now fully tested with comprehensive error scenarios
- Admin endpoints require special fixture with admin role
- Some endpoints may require specific test data setup (products, orders)
- External service endpoints (Ollama, Email) may need mocking or test environment setup
- WebSocket endpoints (traffic info) may require special testing approach 
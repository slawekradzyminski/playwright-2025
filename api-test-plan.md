# API Test Plan

This document tracks the testing progress for all endpoints defined in the API documentation. Each endpoint has one dedicated test file and one dedicated client file following a simple 1:1 mapping pattern.

## File Mapping Structure

**Pattern**: One endpoint → One client file → One test file

```
Endpoint                           Client File                          Test File
────────────────────────────────── ──────────────────────────────────── ────────────────────────────────────
POST   /users/signup               http/signupClient.ts                 tests/api/signup.api.spec.ts
POST   /users/signin               http/signinClient.ts                 tests/api/signin.api.spec.ts
GET    /users                      http/usersClient.ts                  tests/api/users.api.spec.ts
GET    /users/refresh              http/refreshClient.ts                tests/api/refresh.api.spec.ts
GET    /users/me                   http/meClient.ts                     tests/api/me.api.spec.ts
GET    /users/{username}           http/userByUsernameClient.ts         tests/api/user-by-username.api.spec.ts
PUT    /users/{username}           http/updateUserClient.ts             tests/api/update-user.api.spec.ts
DELETE /users/{username}           http/deleteUserClient.ts             tests/api/delete-user.api.spec.ts
GET    /users/{username}/system-prompt    http/getSystemPromptClient.ts    tests/api/get-system-prompt.api.spec.ts
PUT    /users/{username}/system-prompt    http/updateSystemPromptClient.ts tests/api/update-system-prompt.api.spec.ts
GET    /api/products               http/getAllProductsClient.ts         tests/api/get-all-products.api.spec.ts
POST   /api/products               http/createProductClient.ts          tests/api/create-product.api.spec.ts
GET    /api/products/{id}          http/getProductByIdClient.ts         tests/api/get-product-by-id.api.spec.ts
PUT    /api/products/{id}          http/updateProductClient.ts          tests/api/update-product.api.spec.ts
DELETE /api/products/{id}          http/deleteProductClient.ts          tests/api/delete-product.api.spec.ts
GET    /api/orders                 http/getUserOrdersClient.ts          tests/api/get-user-orders.api.spec.ts
POST   /api/orders                 http/createOrderClient.ts            tests/api/create-order.api.spec.ts
GET    /api/orders/{id}            http/getOrderByIdClient.ts           tests/api/get-order-by-id.api.spec.ts
POST   /api/orders/{id}/cancel     http/cancelOrderClient.ts            tests/api/cancel-order.api.spec.ts
PUT    /api/orders/{id}/status     http/updateOrderStatusClient.ts      tests/api/update-order-status.api.spec.ts
GET    /api/orders/admin           http/getAllOrdersAdminClient.ts      tests/api/get-all-orders-admin.api.spec.ts
GET    /api/cart                   http/getCartClient.ts                tests/api/get-cart.api.spec.ts
DELETE /api/cart                   http/clearCartClient.ts              tests/api/clear-cart.api.spec.ts
POST   /api/cart/items             http/addToCartClient.ts              tests/api/add-to-cart.api.spec.ts
PUT    /api/cart/items/{productId} http/updateCartItemClient.ts         tests/api/update-cart-item.api.spec.ts
DELETE /api/cart/items/{productId} http/removeFromCartClient.ts         tests/api/remove-from-cart.api.spec.ts
POST   /qr/create                  http/createQrCodeClient.ts           tests/api/create-qr-code.api.spec.ts
POST   /email                      http/sendEmailClient.ts              tests/api/send-email.api.spec.ts
POST   /api/ollama/generate        http/ollamaGenerateClient.ts         tests/api/ollama-generate.api.spec.ts
POST   /api/ollama/chat            http/ollamaChatClient.ts             tests/api/ollama-chat.api.spec.ts
GET    /api/traffic/info           http/getTrafficInfoClient.ts         tests/api/get-traffic-info.api.spec.ts
```

## Test Coverage Status

### ✅ **COMPLETED** - Fully Tested Endpoints

#### 1. POST /users/signup (register.api.spec.ts)
- ✅ Valid user creation (201)
- ✅ Username validation (400) - too short, minimum length
- ✅ Password validation (400) - too short, minimum length
- ✅ Email validation (400) - invalid format
- ✅ Roles validation (400) - missing roles
- 📁 Client: `http/registerClient.ts`
- 📄 Tests: `tests/api/register.api.spec.ts`

#### 2. POST /users/signin (login.api.spec.ts)
- ✅ Valid credentials authentication (200)
- ✅ Username validation (400) - empty, too short
- ✅ Password validation (400) - too short
- ✅ Invalid credentials handling (422)
- 📁 Client: `http/loginClient.ts`
- 📄 Tests: `tests/api/login.api.spec.ts`

#### 3. GET /users (users.api.spec.ts)
- ✅ Successful retrieval with valid token (200)
- ✅ Unauthorized access without token (401)
- ✅ Invalid token handling (401)
- 📁 Client: `http/usersClient.ts`
- 📄 Tests: `tests/api/users.api.spec.ts`

#### 4. POST /api/products (products.api.spec.ts)
- ✅ Valid product creation for admin (201)
- ✅ Product validation (400) - invalid name, negative price
- ✅ Authorization checks (401, 403)
- ✅ Role-based access control (admin vs client)
- 📁 Client: `http/productsClient.ts`
- 📄 Tests: `tests/api/products.api.spec.ts`

### 📝 **TODO** - Need Implementation (27 endpoints remaining)

#### User Management Endpoints (7 endpoints)

##### 5. GET /users/refresh
- [ ] Valid token refresh (200)
- [ ] Invalid/expired token handling (401)
- 📁 Client: `http/refreshClient.ts` (needs creation)
- 📄 Tests: `tests/api/refresh.api.spec.ts` (needs creation)

##### 6. GET /users/me
- [ ] Current user retrieval (200)
- [ ] Authorization checks (401)
- 📁 Client: `http/meClient.ts` (needs creation)
- 📄 Tests: `tests/api/me.api.spec.ts` (needs creation)

##### 7. GET /users/{username}
- [ ] Existing user retrieval (200)
- [ ] Non-existent user (404)
- [ ] Authorization checks (401)
- 📁 Client: `http/userByUsernameClient.ts` (needs creation)
- 📄 Tests: `tests/api/user-by-username.api.spec.ts` (needs creation)

##### 8. PUT /users/{username}
- [ ] Successful update (200)
- [ ] Non-existent user (404)
- [ ] Authorization checks (401, 403)
- 📁 Client: `http/updateUserClient.ts` (needs creation)
- 📄 Tests: `tests/api/update-user.api.spec.ts` (needs creation)

##### 9. DELETE /users/{username}
- [ ] Successful deletion (204)
- [ ] Non-existent user (404)
- [ ] Authorization checks (401, 403)
- 📁 Client: `http/deleteUserClient.ts` (needs creation)
- 📄 Tests: `tests/api/delete-user.api.spec.ts` (needs creation)

##### 10. GET /users/{username}/system-prompt
- [ ] Retrieve system prompt (200)
- [ ] Non-existent user (404)
- [ ] Authorization checks (401, 403)
- 📁 Client: `http/getSystemPromptClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-system-prompt.api.spec.ts` (needs creation)

##### 11. PUT /users/{username}/system-prompt
- [ ] Update system prompt (200)
- [ ] Non-existent user (404)
- [ ] Authorization checks (401, 403)
- 📁 Client: `http/updateSystemPromptClient.ts` (needs creation)
- 📄 Tests: `tests/api/update-system-prompt.api.spec.ts` (needs creation)

#### Product Endpoints (4 endpoints)

##### 12. GET /api/products
- [ ] Retrieve all products (200)
- [ ] Authorization checks (401)
- 📁 Client: `http/getAllProductsClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-all-products.api.spec.ts` (needs creation)

##### 13. GET /api/products/{id}
- [ ] Existing product retrieval (200)
- [ ] Non-existent product (404)
- [ ] Authorization checks (401)
- 📁 Client: `http/getProductByIdClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-product-by-id.api.spec.ts` (needs creation)

##### 14. PUT /api/products/{id}
- [ ] Successful update (200)
- [ ] Non-existent product (404)
- [ ] Authorization checks (401, 403)
- [ ] Validation errors (400)
- 📁 Client: `http/updateProductClient.ts` (needs creation)
- 📄 Tests: `tests/api/update-product.api.spec.ts` (needs creation)

##### 15. DELETE /api/products/{id}
- [ ] Successful deletion (204)
- [ ] Non-existent product (404)
- [ ] Authorization checks (401, 403)
- 📁 Client: `http/deleteProductClient.ts` (needs creation)
- 📄 Tests: `tests/api/delete-product.api.spec.ts` (needs creation)

#### Order Endpoints (6 endpoints)

##### 16. GET /api/orders
- [ ] Retrieve user orders (200)
- [ ] Authorization checks (401)
- [ ] Pagination parameters
- [ ] Status filtering
- 📁 Client: `http/getUserOrdersClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-user-orders.api.spec.ts` (needs creation)

##### 17. POST /api/orders
- [ ] Order creation from cart (201)
- [ ] Empty cart handling (400)
- [ ] Authorization checks (401)
- [ ] Address validation
- 📁 Client: `http/createOrderClient.ts` (needs creation)
- 📄 Tests: `tests/api/create-order.api.spec.ts` (needs creation)

##### 18. GET /api/orders/{id}
- [ ] Existing order retrieval (200)
- [ ] Non-existent order (404)
- [ ] Authorization checks (401)
- 📁 Client: `http/getOrderByIdClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-order-by-id.api.spec.ts` (needs creation)

##### 19. POST /api/orders/{id}/cancel
- [ ] Order cancellation (200)
- [ ] Non-cancellable order (400)
- [ ] Non-existent order (404)
- [ ] Authorization checks (401)
- 📁 Client: `http/cancelOrderClient.ts` (needs creation)
- 📄 Tests: `tests/api/cancel-order.api.spec.ts` (needs creation)

##### 20. PUT /api/orders/{id}/status
- [ ] Status update (200)
- [ ] Invalid status transition (400)
- [ ] Non-existent order (404)
- [ ] Authorization checks (401, 403)
- 📁 Client: `http/updateOrderStatusClient.ts` (needs creation)
- 📄 Tests: `tests/api/update-order-status.api.spec.ts` (needs creation)

##### 21. GET /api/orders/admin
- [ ] Retrieve all orders (200)
- [ ] Status filtering
- [ ] Pagination parameters
- [ ] Authorization checks (401, 403)
- 📁 Client: `http/getAllOrdersAdminClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-all-orders-admin.api.spec.ts` (needs creation)

#### Cart Endpoints (5 endpoints)

##### 22. GET /api/cart
- [ ] Retrieve cart (200)
- [ ] Authorization checks (401)
- 📁 Client: `http/getCartClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-cart.api.spec.ts` (needs creation)

##### 23. DELETE /api/cart
- [ ] Cart clearing (200)
- [ ] Authorization checks (401)
- 📁 Client: `http/clearCartClient.ts` (needs creation)
- 📄 Tests: `tests/api/clear-cart.api.spec.ts` (needs creation)

##### 24. POST /api/cart/items
- [ ] Add item (200)
- [ ] Product not found (404)
- [ ] Authorization checks (401)
- [ ] Validation errors (400)
- 📁 Client: `http/addToCartClient.ts` (needs creation)
- 📄 Tests: `tests/api/add-to-cart.api.spec.ts` (needs creation)

##### 25. PUT /api/cart/items/{productId}
- [ ] Update quantity (200)
- [ ] Cart item not found (404)
- [ ] Authorization checks (401)
- [ ] Validation errors (400)
- 📁 Client: `http/updateCartItemClient.ts` (needs creation)
- 📄 Tests: `tests/api/update-cart-item.api.spec.ts` (needs creation)

##### 26. DELETE /api/cart/items/{productId}
- [ ] Remove item (200)
- [ ] Cart item not found (404)
- [ ] Authorization checks (401)
- 📁 Client: `http/removeFromCartClient.ts` (needs creation)
- 📄 Tests: `tests/api/remove-from-cart.api.spec.ts` (needs creation)

#### Other Endpoints (5 endpoints)

##### 27. POST /qr/create
- [ ] QR code generation (200)
- [ ] Invalid input (400)
- [ ] Authorization checks (401)
- 📁 Client: `http/createQrCodeClient.ts` (needs creation)
- 📄 Tests: `tests/api/create-qr-code.api.spec.ts` (needs creation)

##### 28. POST /email
- [ ] Email sending (200)
- [ ] Invalid email data (400)
- [ ] Authorization checks (401)
- 📁 Client: `http/sendEmailClient.ts` (needs creation)
- 📄 Tests: `tests/api/send-email.api.spec.ts` (needs creation)

##### 29. POST /api/ollama/generate
- [ ] Text generation (200)
- [ ] Model not found (404)
- [ ] Invalid request (400)
- [ ] Authorization checks (401)
- [ ] Server error handling (500)
- 📁 Client: `http/ollamaGenerateClient.ts` (needs creation)
- 📄 Tests: `tests/api/ollama-generate.api.spec.ts` (needs creation)

##### 30. POST /api/ollama/chat
- [ ] Chat response (200)
- [ ] Model not found (404)
- [ ] Invalid request (400)
- [ ] Authorization checks (401)
- [ ] Server error handling (500)
- 📁 Client: `http/ollamaChatClient.ts` (needs creation)
- 📄 Tests: `tests/api/ollama-chat.api.spec.ts` (needs creation)

##### 31. GET /api/traffic/info
- [ ] Traffic info retrieval (200)
- [ ] Authorization checks (401)
- 📁 Client: `http/getTrafficInfoClient.ts` (needs creation)
- 📄 Tests: `tests/api/get-traffic-info.api.spec.ts` (needs creation)

## Implementation Guidelines

### Naming Conventions

#### Client Files
- Pattern: `{action}{Resource}Client.ts`
- Examples:
  - `signupClient.ts` (for POST /users/signup)
  - `getUserOrdersClient.ts` (for GET /api/orders)
  - `updateCartItemClient.ts` (for PUT /api/cart/items/{productId})

#### Test Files
- Pattern: `{endpoint-description}.api.spec.ts`
- Use kebab-case for multi-word endpoints
- Examples:
  - `signup.api.spec.ts`
  - `get-user-orders.api.spec.ts`
  - `update-cart-item.api.spec.ts`

### Client File Template

```typescript
import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

export const functionName = async (request: APIRequestContext, params..., token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return await request.method(`${API_BASE_URL}/endpoint`, {
    headers,
    data: payload
  });
};
```

### Test File Template

```typescript
import { test, expect } from '../../fixtures/apiAuthFixture';
import { functionName } from '../../http/clientFile';

test.describe('ENDPOINT API tests', () => {
  test('should successfully perform action - STATUS_CODE', async ({ request, authenticatedClient }) => {
    // given
    
    // when
    const response = await functionName(request, params, authenticatedClient.token);
    
    // then
    expect(response.status()).toBe(STATUS_CODE);
  });
  
  // Additional tests ordered by status code (200 → 400 → 401 → 403 → 404 → etc.)
});
```

### Test Patterns

1. **Given/When/Then** structure in comments
2. **Authentication fixtures** for role-based testing (`authenticatedClient`, `authenticatedAdmin`)
3. **Order tests by response code** ascending (200 → 400 → 401 → 403 → 404 → etc.)
4. **Focus on key error cases** - not exhaustive validation testing
5. **One endpoint = One responsibility** - keep tests focused

## Progress Summary

- **Total Endpoints**: 31
- **Completed**: 4 (12.9%)
- **Remaining**: 27 (87.1%)

### By Category
- **User Management**: 3/10 completed (30%)
- **Products**: 1/5 completed (20%)
- **Orders**: 0/6 completed (0%)
- **Cart**: 0/5 completed (0%)
- **Other**: 0/5 completed (0%)

## Next Steps

1. Implement remaining User Management endpoints (7 endpoints)
2. Complete Product endpoints (4 endpoints)
3. Implement Order management (6 endpoints)
4. Implement Cart functionality (5 endpoints)
5. Implement additional features (5 endpoints)

---

*Last updated: October 28, 2025*
*Following 1:1 mapping: One endpoint → One client → One test file*

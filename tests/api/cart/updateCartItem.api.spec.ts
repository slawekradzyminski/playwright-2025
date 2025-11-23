import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import type { CartDto, CartItemDto, UpdateCartItemDto } from '../../../types/cart';
import { createProduct } from '../../../http/products/createProductRequest';
import { addCartItem } from '../../../http/cart/addCartItemRequest';
import { updateCartItem, updateCartItemWithoutAuth } from '../../../http/cart/updateCartItemRequest';
import { generateRandomProduct } from '../../../generators/productGenerator';

test.describe('PUT /api/cart/items/{productId} API tests', () => {
  test('should update cart item quantity with valid token - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const cartItem: CartItemDto = {
      productId: createdProduct.id,
      quantity: 1
    };
    await addCartItem(request, clientToken, cartItem);
    const updateData: UpdateCartItemDto = { quantity: 5 };

    // when
    const response = await updateCartItem(request, clientToken, createdProduct.id, updateData);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    const updatedItem = responseBody.items.find(item => item.productId === createdProduct.id);
    expect(updatedItem).toBeTruthy();
    expect(updatedItem?.quantity).toBe(updateData.quantity);
  });

  test('should return validation error for invalid quantity - 400', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const cartItem: CartItemDto = {
      productId: createdProduct.id,
      quantity: 1
    };
    await addCartItem(request, clientToken, cartItem);
    const invalidUpdateData: UpdateCartItemDto = { quantity: 0 };

    // when
    const response = await updateCartItem(request, clientToken, createdProduct.id, invalidUpdateData);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const cartItem: CartItemDto = {
      productId: createdProduct.id,
      quantity: 1
    };
    await addCartItem(request, clientToken, cartItem);
    const updateData: UpdateCartItemDto = { quantity: 3 };

    // when
    const response = await updateCartItemWithoutAuth(request, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent cart item - 404', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const updateData: UpdateCartItemDto = { quantity: 2 };
    const nonExistentProductId = 123456789;

    // when
    const response = await updateCartItem(request, token, nonExistentProductId, updateData);

    // then
    expect(response.status()).toBe(404);
  });
});

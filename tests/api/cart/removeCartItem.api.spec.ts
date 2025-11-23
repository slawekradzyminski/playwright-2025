import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import type { CartDto, CartItemDto } from '../../../types/cart';
import { createProduct } from '../../../http/products/createProductRequest';
import { addCartItem } from '../../../http/cart/addCartItemRequest';
import { removeCartItem, removeCartItemWithoutAuth } from '../../../http/cart/removeCartItemRequest';
import { generateRandomProduct } from '../../../generators/productGenerator';

test.describe('DELETE /api/cart/items/{productId} API tests', () => {
  test('should remove item from cart with valid token - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const cartItem: CartItemDto = {
      productId: createdProduct.id,
      quantity: 2
    };
    await addCartItem(request, clientToken, cartItem);

    // when
    const response = await removeCartItem(request, clientToken, createdProduct.id);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    const removedItem = responseBody.items.find(item => item.productId === createdProduct.id);
    expect(removedItem).toBeUndefined();
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

    // when
    const response = await removeCartItemWithoutAuth(request, createdProduct.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent cart item - 404', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const nonExistentProductId = 111111111;

    // when
    const response = await removeCartItem(request, token, nonExistentProductId);

    // then
    expect(response.status()).toBe(404);
  });
});

import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../types/product';
import type { CartDto, CartItemDto } from '../../types/cart';
import { createProduct } from '../../http/createProductRequest';
import { addCartItem, addCartItemWithoutAuth } from '../../http/addCartItemRequest';
import { generateRandomProduct } from '../../generators/productGenerator';

test.describe('POST /api/cart/items API tests', () => {
  test('should add item to cart with valid token - 200', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
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

    // when
    const response = await addCartItem(request, clientToken, cartItem);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    const addedItem = responseBody.items.find(item => item.productId === createdProduct.id);
    expect(addedItem).toBeTruthy();
    expect(addedItem?.quantity).toBe(cartItem.quantity);
  });

  test('should return validation error for invalid quantity - 400', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const invalidCartItem: CartItemDto = {
      productId: createdProduct.id,
      quantity: 0
    };

    // when
    const response = await addCartItem(request, clientToken, invalidCartItem);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const cartItem: CartItemDto = {
      productId: createdProduct.id,
      quantity: 1
    };

    // when
    const response = await addCartItemWithoutAuth(request, cartItem);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent product id - 404', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const nonExistentCartItem: CartItemDto = {
      productId: 987654321,
      quantity: 1
    };

    // when
    const response = await addCartItem(request, token, nonExistentCartItem);

    // then
    expect(response.status()).toBe(404);
  });
});

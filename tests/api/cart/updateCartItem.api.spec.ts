import { test, expect } from '../../../fixtures/apiAuthFixture';
import { createProduct } from '../../../http/products/createProductRequest';
import { addCartItem } from '../../../http/cart/addCartItemRequest';
import { updateCartItem } from '../../../http/cart/updateCartItemRequest';
import { generateProduct } from '../../../generators/productGenerator';
import type { ProductCreateDto, ProductDto } from '../../../types/products';
import type { CartDto } from '../../../types/cart';
import { INVALID_TOKEN } from '../../../config/constants';

test.describe('PUT /api/cart/items/{productId} API tests', () => {
  test('client should update cart item quantity - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();
    const addResponse = await addCartItem(request, { productId: createdProduct.id, quantity: 1 }, clientAuth.token);
    expect(addResponse.status()).toBe(200);

    // when
    const response = await updateCartItem(request, createdProduct.id, { quantity: 5 }, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    const cartItem = responseBody.items.find((item) => item.productId === createdProduct.id);
    expect(cartItem).toBeTruthy();
    expect(cartItem?.quantity).toBe(5);
  });

  test('should return validation error for invalid quantity - 400', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();
    const addResponse = await addCartItem(request, { productId: createdProduct.id, quantity: 1 }, clientAuth.token);
    expect(addResponse.status()).toBe(200);

    // when
    const response = await updateCartItem(request, createdProduct.id, { quantity: 0 }, clientAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await updateCartItem(request, 1, { quantity: 1 });

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await updateCartItem(request, 1, { quantity: 1 }, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found for item not in cart - 404', async ({ request, clientAuth }) => {
    // when
    const response = await updateCartItem(request, 999999, { quantity: 2 }, clientAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

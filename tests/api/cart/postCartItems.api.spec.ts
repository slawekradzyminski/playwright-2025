import { test, expect } from '../../../fixtures/apiAuthFixture';
import { addCartItem } from '../../../http/cart/addCartItemRequest';
import { createProduct } from '../../../http/products/createProductRequest';
import { generateProduct } from '../../../generators/productGenerator';
import type { CartDto, CartItemDto } from '../../../types/cart';
import type { ProductCreateDto, ProductDto } from '../../../types/products';
import { INVALID_TOKEN } from '../../../config/constants';

const buildCartItem = (productId: number, quantity = 1): CartItemDto => ({
  productId,
  quantity
});

test.describe('POST /api/cart/items API tests', () => {
  test('client should add product to cart - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await addCartItem(request, buildCartItem(createdProduct.id), clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.items.length).toBe(1);
    expect(responseBody.items[0].productId).toBe(createdProduct.id);
    expect(responseBody.items[0].quantity).toBe(1);
  });

  test('adding the same product should increase quantity - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const firstResponse = await addCartItem(request, buildCartItem(createdProduct.id, 1), clientAuth.token);
    expect(firstResponse.status()).toBe(200);
    const response = await addCartItem(request, buildCartItem(createdProduct.id, 2), clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    const cartItem = responseBody.items.find((item) => item.productId === createdProduct.id);
    expect(cartItem).toBeTruthy();
    expect(cartItem?.quantity).toBe(3);
  });

  test('should return validation error for invalid quantity - 400', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await addCartItem(request, buildCartItem(createdProduct.id, 0), clientAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await addCartItem(request, buildCartItem(1, 1));

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await addCartItem(request, buildCartItem(1, 1), INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found for non-existent product - 404', async ({ request, clientAuth }) => {
    // when
    const response = await addCartItem(request, buildCartItem(999999, 1), clientAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

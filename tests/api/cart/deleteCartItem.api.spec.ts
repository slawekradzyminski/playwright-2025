import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { APIRequestContext } from '@playwright/test';
import { createProduct } from '../../../http/products/createProductRequest';
import { addCartItem } from '../../../http/cart/addCartItemRequest';
import { deleteCartItem } from '../../../http/cart/deleteCartItemRequest';
import { generateProduct } from '../../../generators/productGenerator';
import type { ProductCreateDto, ProductDto } from '../../../types/products';
import type { CartDto } from '../../../types/cart';
import { INVALID_TOKEN } from '../../../config/constants';

test.describe('DELETE /api/cart/items/{productId} API tests', () => {
  test('client should remove specific product from cart - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const firstProduct = await createCatalogProduct(request, adminAuth.token);
    const secondProduct = await createCatalogProduct(request, adminAuth.token);
    await addCartItem(request, { productId: firstProduct.id, quantity: 1 }, clientAuth.token);
    await addCartItem(request, { productId: secondProduct.id, quantity: 1 }, clientAuth.token);

    // when
    const response = await deleteCartItem(request, firstProduct.id, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.items.some((item) => item.productId === firstProduct.id)).toBe(false);
    expect(responseBody.items.some((item) => item.productId === secondProduct.id)).toBe(true);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await deleteCartItem(request, 1);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await deleteCartItem(request, 1, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found for item not in cart - 404', async ({ request, clientAuth }) => {
    // when
    const response = await deleteCartItem(request, 999999, clientAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

const createCatalogProduct = async (request: APIRequestContext, adminToken: string): Promise<ProductDto> => {
  const productData: ProductCreateDto = generateProduct();
  const createResponse = await createProduct(request, productData, adminToken);
  expect(createResponse.status()).toBe(201);
  return await createResponse.json();
};

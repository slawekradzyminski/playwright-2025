import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getProductById, getProducts } from '../../../http/productsClient';
import type { ProductDto } from '../../../types/product';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/products/{id} GET API tests', () => {
  test('should return product by id for authenticated request - 200', async ({ request, adminAuth }) => {
    // given
    const productsResponse = await getProducts(request, adminAuth.jwtToken);
    const products: ProductDto[] = await productsResponse.json();
    const existingProductId = products[0].id;

    // when
    const response = await getProductById(request, adminAuth.jwtToken, existingProductId);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.id).toBe(existingProductId);
  });

  test('should return unauthorized for product by id without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/products/1`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return not found for product that does not exist - 404', async ({
    request,
    adminAuth
  }) => {
    // given
    // when
    const response = await getProductById(request, adminAuth.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Product not found' });
  });
});

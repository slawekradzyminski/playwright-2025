import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getProducts } from '../../../http/productsClient';
import type { ProductDto } from '../../../types/product';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/products API tests', () => {
  test('should return products for authenticated request - 200', async ({ request, adminAuth }) => {
    // given
    // when
    const response = await getProducts(request, adminAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
  });

  test('should return unauthorized for products request without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/products`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});

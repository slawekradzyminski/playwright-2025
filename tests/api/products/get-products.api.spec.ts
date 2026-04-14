import { test, expect } from '@playwright/test';
import { ProductClient } from '../../../httpclients/productClient';
import { registerAndLogin } from '../../../helpers/authHelper';
import { assertProductListResponse } from '../helpers/productAssertions';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('GET /api/v1/products', () => {
  let client: ProductClient;

  test.beforeEach(async ({ request }) => {
    client = new ProductClient(request, APP_BASE_URL);
  });

  test('should return product list for authenticated user - 200', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);

    // when
    const response = await client.getProducts(token);

    // then
    expect(response.status()).toBe(200);
    const products = await assertProductListResponse(response);
    expect(products.length).toBeGreaterThan(0);
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.getProducts();

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });
});

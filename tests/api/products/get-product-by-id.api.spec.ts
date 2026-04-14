import { test, expect } from '@playwright/test';
import { ProductClient } from '../../../httpclients/productClient';
import type { ProductDto } from '../../../types/product';
import { registerAndLogin } from '../../../helpers/authHelper';
import { assertProductResponse } from '../helpers/productAssertions';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_PRODUCT_ID = 999999999;

test.describe('GET /api/v1/products/{id}', () => {
  let client: ProductClient;

  test.beforeEach(async ({ request }) => {
    client = new ProductClient(request, APP_BASE_URL);
  });

  test('should return product by id for authenticated user - 200', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);
    const productsResponse = await client.getProducts(token);
    expect(productsResponse.status()).toBe(200);
    const products: ProductDto[] = await productsResponse.json();
    expect(products.length).toBeGreaterThan(0);
    const product = products[0];

    // when
    const response = await client.getProductById(product.id, token);

    // then
    expect(response.status()).toBe(200);
    await assertProductResponse(response, product.id);
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.getProductById(1);

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('should return not found for missing product - 404', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);

    // when
    const response = await client.getProductById(MISSING_PRODUCT_ID, token);

    // then
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toBe('Product not found');
  });
});

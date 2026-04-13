import { test, expect } from '../fixtures/adminAuthFixture';
import { ProductClient } from '../../../httpclients/productClient';
import type { ProductDto } from '../../../types/product';
import { registerAndLogin } from '../helpers/authHelper';
import { generateProduct } from '../../../generators/productGenerator';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_PRODUCT_ID = 999999999;

test.describe('DELETE /api/v1/products/{id}', () => {
  let client: ProductClient;

  test.beforeEach(async ({ request }) => {
    client = new ProductClient(request, APP_BASE_URL);
  });

  test('should delete owned product as admin - 204', async ({ adminTokens }) => {
    // given
    const createResponse = await client.createProduct(generateProduct(), adminTokens.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await client.deleteProduct(createdProduct.id, adminTokens.token);

    // then
    expect(response.status()).toBe(204);
    const getDeletedProductResponse = await client.getProductById(createdProduct.id, adminTokens.token);
    expect(getDeletedProductResponse.status()).toBe(404);
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.deleteProduct(1);

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('should return forbidden for regular client - 403', async ({ request, adminTokens }) => {
    // given
    const { token } = await registerAndLogin(request);
    const createResponse = await client.createProduct(generateProduct(), adminTokens.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    try {
      // when
      const response = await client.deleteProduct(createdProduct.id, token);

      // then
      expect(response.status()).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Access denied');
    } finally {
      await client.deleteProduct(createdProduct.id, adminTokens.token);
    }
  });

  test('should return not found for missing product - 404', async ({ adminTokens }) => {
    // when
    const response = await client.deleteProduct(MISSING_PRODUCT_ID, adminTokens.token);

    // then
    expect(response.status()).toBe(404);
    expect(await response.text()).toBe('');
  });
});

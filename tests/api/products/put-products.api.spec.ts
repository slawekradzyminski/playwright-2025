import { test, expect } from '../fixtures/adminAuthFixture';
import { ProductClient } from '../../../httpclients/productClient';
import type { ProductDto } from '../../../types/product';
import { registerAndLogin } from '../helpers/authHelper';
import { generateProduct } from '../../../generators/productGenerator';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_PRODUCT_ID = 999999999;

test.describe('PUT /api/v1/products/{id}', () => {
  let client: ProductClient;

  test.beforeEach(async ({ request }) => {
    client = new ProductClient(request, APP_BASE_URL);
  });

  test('should update owned product as admin - 200', async ({ adminTokens }) => {
    // given
    const createResponse = await client.createProduct(generateProduct(), adminTokens.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    try {
      // when
      const response = await client.updateProduct(createdProduct.id, {
        name: `${createdProduct.name}-updated`,
        price: 29.99,
        stockQuantity: 9
      }, adminTokens.token);

      // then
      expect(response.status()).toBe(200);
      const body: ProductDto = await response.json();
      expect(body.id).toBe(createdProduct.id);
      expect(body.name).toBe(`${createdProduct.name}-updated`);
      expect(body.price).toBe(29.99);
      expect(body.stockQuantity).toBe(9);
    } finally {
      await client.deleteProduct(createdProduct.id, adminTokens.token);
    }
  });

  test('should return bad request for invalid product data - 400', async ({ adminTokens }) => {
    // given
    const createResponse = await client.createProduct(generateProduct(), adminTokens.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    try {
      // when
      const response = await client.updateProduct(createdProduct.id, { price: 0 }, adminTokens.token);

      // then
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.price).toBe('Price must be greater than 0');
    } finally {
      await client.deleteProduct(createdProduct.id, adminTokens.token);
    }
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.updateProduct(1, { name: 'Updated Product Name' });

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
      const response = await client.updateProduct(createdProduct.id, { name: 'Forbidden Update' }, token);

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
    const response = await client.updateProduct(MISSING_PRODUCT_ID, { name: 'Missing Product' }, adminTokens.token);

    // then
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toBe('Product not found');
  });
});

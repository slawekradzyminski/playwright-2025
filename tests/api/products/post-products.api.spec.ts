import { test, expect } from '../fixtures/adminAuthFixture';
import { ProductClient } from '../../../httpclients/productClient';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import { registerAndLogin } from '../helpers/authHelper';
import { generateProduct } from '../../../generators/productGenerator';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('POST /api/v1/products', () => {
  let client: ProductClient;

  test.beforeEach(async ({ request }) => {
    client = new ProductClient(request, APP_BASE_URL);
  });

  test('should create product as admin - 201', async ({ adminRequest }) => {
    // given
    const product = generateProduct();
    let createdProductId: number | undefined;

    try {
      // when
      const response = await adminRequest.post('/api/v1/products', { data: product });

      // then
      expect(response.status()).toBe(201);
      const body: ProductDto = await response.json();
      createdProductId = body.id;
      expect(body.name).toBe(product.name);
      expect(body.description).toBe(product.description);
      expect(body.price).toBe(product.price);
      expect(body.stockQuantity).toBe(product.stockQuantity);
      expect(body.category).toBe(product.category);
    } finally {
      if (createdProductId) {
        await adminRequest.delete(`/api/v1/products/${createdProductId}`);
      }
    }
  });

  test('should return bad request for missing required fields - 400', async ({ adminTokens }) => {
    // when
    const response = await client.createProduct({} as ProductCreateDto, adminTokens.token);

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.name).toBe('Product name is required');
    expect(body.description).toBe('Product description is required');
    expect(body.price).toBe('Price is required');
    expect(body.stockQuantity).toBe('Stock quantity is required');
    expect(body.category).toBe('Category is required');
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // given
    const product = generateProduct();

    // when
    const response = await client.createProduct(product);

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('should return forbidden for regular client - 403', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);
    const product = generateProduct();

    // when
    const response = await client.createProduct(product, token);

    // then
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.message).toBe('Access denied');
  });
});

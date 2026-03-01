import { test, expect } from '../../fixtures/auth.fixture';
import type { ErrorResponse } from '../../../types/common';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import { generateProduct } from '../../../generators/productGenerator';
import { createProductRequest } from '../../../http/products/createProductRequest';

test.describe('/api/products POST API tests', () => {
  test('should create product with admin token - 201', async ({ request, adminAuth }) => {
    // given
    const payload: ProductCreateDto = generateProduct();

    // when
    const response = await createProductRequest(request, adminAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ProductDto;
    expect(responseBody.name).toBe(payload.name);
    expect(responseBody.price).toBe(payload.price);
    expect(responseBody.category).toBe(payload.category);
  });

  test('should return validation error for invalid payload - 400', async ({ request, adminAuth }) => {
    // when
    const response = await createProductRequest(request, adminAuth.jwtToken, {
      name: 'ab',
      description: '',
      price: 0,
      stockQuantity: -1,
      category: '',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.post('/api/products', {
      data: generateProduct(),
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });

  test('should return forbidden for non-admin user - 403', async ({ request, clientAuth }) => {
    // when
    const response = await createProductRequest(request, clientAuth.jwtToken, generateProduct());

    // then
    expect(response.status()).toBe(403);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});

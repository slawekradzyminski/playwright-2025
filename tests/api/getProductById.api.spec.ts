import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { ProductCreateDto, ProductDto } from '../../types/product';
import { generateProduct } from '../../generators/productGenerator';
import { createProductRequest } from './http/createProductRequest';
import { getProductByIdRequest } from './http/getProductByIdRequest';

test.describe('/api/products/{id} GET API tests', () => {
  test('should return product by id for authenticated user - 200', async ({ request, adminAuth }) => {
    // given
    const createPayload: ProductCreateDto = generateProduct();
    const createResponse = await createProductRequest(request, adminAuth.jwtToken, createPayload);
    expect(createResponse.status()).toBe(201);
    const createdProduct = (await createResponse.json()) as ProductDto;

    // when
    const response = await getProductByIdRequest(request, adminAuth.jwtToken, createdProduct.id);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ProductDto;
    expect(responseBody.id).toBe(createdProduct.id);
    expect(responseBody.name).toBe(createPayload.name);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/api/products/1');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });

  test('should return not found for missing product - 404', async ({ request, adminAuth }) => {
    // when
    const response = await getProductByIdRequest(request, adminAuth.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
  });
});

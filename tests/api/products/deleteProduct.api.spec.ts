import { test, expect } from '../../fixtures/auth.fixture';
import type { ErrorResponse } from '../../../types/common';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import { generateProduct } from '../../../generators/productGenerator';
import { createProductRequest } from '../../../http/products/createProductRequest';
import { deleteProductRequest } from '../../../http/products/deleteProductRequest';

test.describe('/api/products/{id} DELETE API tests', () => {
  test('should delete product with admin token - 204', async ({ request, adminAuth }) => {
    // given
    const createPayload: ProductCreateDto = generateProduct();
    const createResponse = await createProductRequest(request, adminAuth.jwtToken, createPayload);
    expect(createResponse.status()).toBe(201);
    const createdProduct = (await createResponse.json()) as ProductDto;

    // when
    const response = await deleteProductRequest(request, adminAuth.jwtToken, createdProduct.id);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.delete('/api/products/1');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });

  test('should return forbidden for non-admin user - 403', async ({ request, clientAuth, adminAuth }) => {
    // given
    const createPayload: ProductCreateDto = generateProduct();
    const createResponse = await createProductRequest(request, adminAuth.jwtToken, createPayload);
    expect(createResponse.status()).toBe(201);
    const createdProduct = (await createResponse.json()) as ProductDto;

    // when
    const response = await deleteProductRequest(request, clientAuth.jwtToken, createdProduct.id);

    // then
    expect(response.status()).toBe(403);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return not found for missing product - 404', async ({ request, adminAuth }) => {
    // when
    const response = await deleteProductRequest(request, adminAuth.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
  });
});

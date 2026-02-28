import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { ProductCreateDto, ProductDto, ProductUpdateDto } from '../../types/product';
import { generateProduct, generateProductUpdate } from '../../generators/productGenerator';
import { createProductRequest } from './http/createProductRequest';
import { updateProductRequest } from './http/updateProductRequest';

test.describe('/api/products/{id} PUT API tests', () => {
  test('should update product with admin token - 200', async ({ request, adminAuth }) => {
    // given
    const createPayload: ProductCreateDto = generateProduct();
    const createResponse = await createProductRequest(request, adminAuth.jwtToken, createPayload);
    expect(createResponse.status()).toBe(201);
    const createdProduct = (await createResponse.json()) as ProductDto;

    const updatePayload: ProductUpdateDto = generateProductUpdate();

    // when
    const response = await updateProductRequest(
      request,
      adminAuth.jwtToken,
      createdProduct.id,
      updatePayload,
    );

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ProductDto;
    expect(responseBody.id).toBe(createdProduct.id);
    expect(responseBody.name).toBe(updatePayload.name);
    expect(responseBody.price).toBe(updatePayload.price);
  });

  test('should return validation error for invalid payload - 400', async ({ request, adminAuth }) => {
    const createPayload: ProductCreateDto = generateProduct();
    const createResponse = await createProductRequest(request, adminAuth.jwtToken, createPayload);
    expect(createResponse.status()).toBe(201);
    const createdProduct = (await createResponse.json()) as ProductDto;

    // when
    const response = await updateProductRequest(request, adminAuth.jwtToken, createdProduct.id, {
      name: 'ab',
      description: '',
      price: 0,
      stockQuantity: -1,
      category: '',
      imageUrl: 'invalid-url',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.put('/api/products/1', {
      data: generateProductUpdate(),
    });

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
    const response = await updateProductRequest(
      request,
      clientAuth.jwtToken,
      createdProduct.id,
      generateProductUpdate(),
    );

    // then
    expect(response.status()).toBe(403);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return not found for missing product - 404', async ({ request, adminAuth }) => {
    // when
    const response = await updateProductRequest(
      request,
      adminAuth.jwtToken,
      999999999,
      generateProductUpdate(),
    );

    // then
    expect(response.status()).toBe(404);
  });
});

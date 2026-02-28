import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { ProductDto } from '../../types/product';
import { getAllProductsRequest } from './http/getAllProductsRequest';

test.describe('/api/products GET API tests', () => {
  test('should return all products for authenticated user - 200', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await getAllProductsRequest(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ProductDto[];
    expect(Array.isArray(responseBody)).toBe(true);
    expect(
      responseBody.every(
        (product) =>
          typeof product.id === 'number' &&
          typeof product.name === 'string' &&
          typeof product.price === 'number',
      ),
    ).toBe(true);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/api/products');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

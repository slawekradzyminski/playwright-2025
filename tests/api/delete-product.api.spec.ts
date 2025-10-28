import { test, expect } from '../../fixtures/apiAuthFixture';
import { generateProduct } from '../../generators/productGenerator';
import { createProduct } from '../../http/productsClient';
import { deleteProduct } from '../../http/deleteProductClient';

test.describe('/api/products/{id} DELETE API tests', () => {
  test('should delete product successfully - 204', async ({ request, authenticatedAdmin }) => {
    // given
    const productData = generateProduct();
    const createResponse = await createProduct(request, productData, authenticatedAdmin.token);
    expect(createResponse.status()).toBe(201);
    const { id } = await createResponse.json();

    // when
    const response = await deleteProduct(request, id, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(204);
    const responseBody = await response.text();
    expect(responseBody).toBe('');
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await deleteProduct(request, 1);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return forbidden error when user lacks permissions - 403', async ({ request, authenticatedAdmin, authenticatedClient }) => {
    // given
    const productData = generateProduct();
    const createResponse = await createProduct(request, productData, authenticatedAdmin.token);
    expect(createResponse.status()).toBe(201);
    const { id } = await createResponse.json();

    // when
    const response = await deleteProduct(request, id, authenticatedClient.token);

    // then
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Access denied');
  });

  test('should return not found when product does not exist - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const nonExistingProductId = Number.MAX_SAFE_INTEGER;

    // when
    const response = await deleteProduct(request, nonExistingProductId, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.text();
    expect(responseBody).toBe('');
  });
});

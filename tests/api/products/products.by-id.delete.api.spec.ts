import { test, expect } from '../../../fixtures/apiAuthFixtures';
import {
  deleteProductById,
  deleteProductByIdWithoutAuth,
} from '../../../http/products/productsByIdDeleteClient';
import { generateProductCreateData } from '../../../generators/productGenerator';
import { createProductViaApi, deleteProductViaApi } from './productTestUtils';
import { getProductById } from '../../../http/products/productsByIdGetClient';

test.describe('/api/products/{id} DELETE', () => {
  test('should delete product with admin token - 204', async ({ request, authenticatedAdmin }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await deleteProductById(request, authenticatedAdmin.token, product.id);

    expect(response.status()).toBe(204);

    const verifyResponse = await getProductById(request, authenticatedAdmin.token, product.id);
    expect(verifyResponse.status()).toBe(404);
  });

  test('should return unauthorized without token - 401', async ({ request, authenticatedAdmin }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await deleteProductByIdWithoutAuth(request, product.id);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');

    const cleanupResponse = await deleteProductById(request, authenticatedAdmin.token, product.id);
    expect(cleanupResponse.status()).toBe(204);
  });

  test('should return forbidden for client token - 403', async ({
    request,
    authenticatedAdmin,
    authenticatedClient,
  }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await deleteProductById(request, authenticatedClient.token, product.id);

    expect(response.status()).toBe(403);

    const cleanupResponse = await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
    expect(cleanupResponse.status()).toBe(204);
  });

  test('should return not found for missing product - 404', async ({ request, authenticatedAdmin }) => {
    const response = await deleteProductById(request, authenticatedAdmin.token, 999999);

    expect(response.status()).toBe(404);
  });
});

import { test, expect } from '../../../fixtures/authFixtures';
import { getProductById, getProductByIdWithoutAuth } from '../../../http/products/productsByIdGetClient';
import type { ProductDto } from '../../../types/product';
import { generateProductCreateData } from '../../../generators/productGenerator';
import { createProductViaApi, deleteProductViaApi } from './productTestUtils';

test.describe('/api/products/{id} GET', () => {
  test('should retrieve product by id with admin token - 200', async ({ request, authenticatedAdmin }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await getProductById(request, authenticatedAdmin.token, product.id);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as ProductDto;
    expect(responseBody.id).toBe(product.id);
    expect(responseBody.name).toBe(product.name);
    expect(responseBody.category).toBe(product.category);

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should retrieve product by id with client token - 200', async ({
    request,
    authenticatedAdmin,
    authenticatedClient,
  }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await getProductById(request, authenticatedClient.token, product.id);

    expect(response.status()).toBe(200);

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return unauthorized without token - 401', async ({ request, authenticatedAdmin }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await getProductByIdWithoutAuth(request, product.id);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return not found for missing product - 404', async ({ request, authenticatedAdmin }) => {
    const response = await getProductById(request, authenticatedAdmin.token, 999999);

    expect(response.status()).toBe(404);
  });
});

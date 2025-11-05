import { test, expect } from '../../fixtures/authFixtures';
import {
  updateProductById,
  updateProductByIdWithoutAuth,
} from '../../../http/products/productsByIdPutClient';
import type { ProductDto } from '../../../types/product';
import { generateProductCreateData, generateProductUpdateData } from '../../../generators/productGenerator';
import { createProductViaApi, deleteProductViaApi } from './productTestUtils';

test.describe('/api/products/{id} PUT', () => {
  test('should update product with admin token - 200', async ({ request, authenticatedAdmin }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());
    const updatePayload = generateProductUpdateData();

    const response = await updateProductById(request, authenticatedAdmin.token, product.id, updatePayload);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as ProductDto;
    expect(responseBody.id).toBe(product.id);
    expect(responseBody.name).toBe(updatePayload.name);
    expect(responseBody.price).toBe(updatePayload.price);
    expect(responseBody.stockQuantity).toBe(updatePayload.stockQuantity);
    expect(responseBody.category).toBe(updatePayload.category);

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return forbidden for client token - 403', async ({
    request,
    authenticatedAdmin,
    authenticatedClient,
  }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await updateProductById(
      request,
      authenticatedClient.token,
      product.id,
      generateProductUpdateData(),
    );

    expect(response.status()).toBe(403);

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return unauthorized without token - 401', async ({ request, authenticatedAdmin }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await updateProductByIdWithoutAuth(request, product.id, generateProductUpdateData());

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });

  test('should return not found for missing product - 404', async ({ request, authenticatedAdmin }) => {
    const response = await updateProductById(
      request,
      authenticatedAdmin.token,
      999999,
      generateProductUpdateData(),
    );

    expect(response.status()).toBe(404);
  });

  test('should return bad request for invalid data - 400', async ({ request, authenticatedAdmin }) => {
    const product = await createProductViaApi(request, authenticatedAdmin.token, generateProductCreateData());

    const response = await updateProductById(request, authenticatedAdmin.token, product.id, { price: -100 });

    expect(response.status()).toBe(400);

    await deleteProductViaApi(request, authenticatedAdmin.token, product.id);
  });
});

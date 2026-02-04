import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { createProductData } from '../../../generators/productGenerator';
import { createProduct, deleteProduct } from '../../../http/productsClient';
import type { ProductDto } from '../../../types/product';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/products/{id} DELETE API tests', () => {
  test('should delete product for admin user - 204', async ({ request, adminAuth }) => {
    // given
    const createdResponse = await createProduct(request, adminAuth.jwtToken, createProductData());
    expect(createdResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createdResponse.json();

    // when
    const response = await deleteProduct(request, adminAuth.jwtToken, createdProduct.id);

    // then
    expect(response.status()).toBe(204);
    expect(await response.text()).toBe('');
  });

  test('should return unauthorized for delete product without token - 401', async ({
    request,
    adminAuth
  }) => {
    // given
    const createdResponse = await createProduct(request, adminAuth.jwtToken, createProductData());
    expect(createdResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createdResponse.json();

    // when
    const response = await request.delete(`${API_BASE_URL}/api/products/${createdProduct.id}`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
    await deleteProduct(request, adminAuth.jwtToken, createdProduct.id);
  });

  test('should return forbidden for non-admin delete product - 403', async ({
    request,
    adminAuth,
    authenticatedUser
  }) => {
    // given
    const createdResponse = await createProduct(request, adminAuth.jwtToken, createProductData());
    expect(createdResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createdResponse.json();

    // when
    const response = await deleteProduct(request, authenticatedUser.jwtToken, createdProduct.id);

    // then
    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Access denied' });
    await deleteProduct(request, adminAuth.jwtToken, createdProduct.id);
  });

  test('should return not found for delete product that does not exist - 404', async ({
    request,
    adminAuth
  }) => {
    // given
    // when
    const response = await deleteProduct(request, adminAuth.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
    expect(await response.text()).toBe('');
  });
});

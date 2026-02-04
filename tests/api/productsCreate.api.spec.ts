import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import { createProductData } from '../../generators/productGenerator';
import { createProduct, deleteProduct } from '../../http/productsClient';
import type { ProductDto } from '../../types/product';
import { test } from '../fixtures/auth.fixture';

test.describe('/api/products POST API tests', () => {
  test('should create product for admin user - 201', async ({ request, adminAuth }) => {
    // given
    const productData = createProductData();

    // when
    const response = await createProduct(request, adminAuth.jwtToken, productData);

    // then
    expect(response.status()).toBe(201);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.name).toBe(productData.name);
    await deleteProduct(request, adminAuth.jwtToken, responseBody.id);
  });

  test('should return validation error for invalid product payload - 400', async ({
    request,
    adminAuth
  }) => {
    // given
    const productData = createProductData({ name: 'ab' });

    // when
    const response = await createProduct(request, adminAuth.jwtToken, productData);

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      name: 'Product name must be between 3 and 100 characters'
    });
  });

  test('should return unauthorized for create product without token - 401', async ({ request }) => {
    // given
    const productData = createProductData();

    // when
    const response = await request.post(`${API_BASE_URL}/api/products`, {
      data: productData
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return forbidden for non-admin create product - 403', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const productData = createProductData();

    // when
    const response = await createProduct(request, authenticatedUser.jwtToken, productData);

    // then
    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Access denied' });
  });
});

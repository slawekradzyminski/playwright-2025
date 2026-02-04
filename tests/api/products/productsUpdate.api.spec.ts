import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { createProductData, createProductUpdateData } from '../../../generators/productGenerator';
import { createProduct, deleteProduct, updateProduct } from '../../../http/productsClient';
import type { ProductDto } from '../../../types/product';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/products/{id} PUT API tests', () => {
  test('should update product for admin user - 200', async ({ request, adminAuth }) => {
    // given
    const createdResponse = await createProduct(request, adminAuth.jwtToken, createProductData());
    expect(createdResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createdResponse.json();
    const updateData = createProductUpdateData();

    // when
    const response = await updateProduct(request, adminAuth.jwtToken, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.name).toBe(updateData.name);
    await deleteProduct(request, adminAuth.jwtToken, createdProduct.id);
  });

  test('should return validation error for invalid update payload - 400', async ({
    request,
    adminAuth
  }) => {
    // given
    const createdResponse = await createProduct(request, adminAuth.jwtToken, createProductData());
    expect(createdResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createdResponse.json();

    // when
    const response = await updateProduct(request, adminAuth.jwtToken, createdProduct.id, { name: 'a' });

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      name: 'Product name must be between 3 and 100 characters'
    });
    await deleteProduct(request, adminAuth.jwtToken, createdProduct.id);
  });

  test('should return unauthorized for update product without token - 401', async ({
    request,
    adminAuth
  }) => {
    // given
    const createdResponse = await createProduct(request, adminAuth.jwtToken, createProductData());
    expect(createdResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createdResponse.json();

    // when
    const response = await request.put(`${API_BASE_URL}/api/products/${createdProduct.id}`, {
      data: createProductUpdateData()
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
    await deleteProduct(request, adminAuth.jwtToken, createdProduct.id);
  });

  test('should return forbidden for non-admin update product - 403', async ({
    request,
    adminAuth,
    authenticatedUser
  }) => {
    // given
    const createdResponse = await createProduct(request, adminAuth.jwtToken, createProductData());
    expect(createdResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createdResponse.json();

    // when
    const response = await updateProduct(
      request,
      authenticatedUser.jwtToken,
      createdProduct.id,
      createProductUpdateData()
    );

    // then
    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Access denied' });
    await deleteProduct(request, adminAuth.jwtToken, createdProduct.id);
  });

  test('should return not found for update product that does not exist - 404', async ({
    request,
    adminAuth
  }) => {
    // given
    // when
    const response = await updateProduct(
      request,
      adminAuth.jwtToken,
      999999999,
      createProductUpdateData()
    );

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Product not found' });
  });
});

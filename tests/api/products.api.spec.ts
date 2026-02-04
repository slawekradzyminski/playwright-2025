import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import { createProductData, createProductUpdateData } from '../../generators/productGenerator';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../../http/productsClient';
import type { ProductDto } from '../../types/product';
import { test } from '../fixtures/auth.fixture';

test.describe('/api/products API tests', () => {
  test('should return products for authenticated request - 200', async ({ request, adminAuth }) => {
    // given
    // when
    const response = await getProducts(request, adminAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
  });

  test('should return unauthorized for products request without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/products`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return product by id for authenticated request - 200', async ({ request, adminAuth }) => {
    // given
    const productsResponse = await getProducts(request, adminAuth.jwtToken);
    const products: ProductDto[] = await productsResponse.json();
    const existingProductId = products[0].id;

    // when
    const response = await getProductById(request, adminAuth.jwtToken, existingProductId);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.id).toBe(existingProductId);
  });

  test('should return unauthorized for product by id without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/products/1`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return not found for product that does not exist - 404', async ({
    request,
    adminAuth
  }) => {
    // given
    // when
    const response = await getProductById(request, adminAuth.jwtToken, 999999999);

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: 'Product not found' });
  });

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

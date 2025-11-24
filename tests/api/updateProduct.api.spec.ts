import { test, expect } from '../../fixtures/apiAuthFixture';
import { createProduct } from '../../http/createProductRequest';
import { updateProduct } from '../../http/updateProductRequest';
import { generateProduct } from '../../generators/productGenerator';
import type { ProductCreateDto, ProductDto, ProductUpdateDto } from '../../types/products';
import { INVALID_TOKEN } from '../../config/constants';

test.describe('PUT /api/products/{id} API tests', () => {
  test('admin should update product fields - 200', async ({ request, adminAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();
    const updateData: ProductUpdateDto = {
      name: `${productData.name} Updated`,
      price: productData.price + 10,
      stockQuantity: productData.stockQuantity + 5
    };

    // when
    const response = await updateProduct(request, createdProduct.id, updateData, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.name).toBe(updateData.name);
    expect(responseBody.price).toBe(updateData.price);
    expect(responseBody.stockQuantity).toBe(updateData.stockQuantity);
  });

  test('should return validation error for negative price - 400', async ({ request, adminAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await updateProduct(request, createdProduct.id, { price: -5 }, adminAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await updateProduct(request, 1, { name: 'Updated' });

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await updateProduct(request, 1, { name: 'Updated' }, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden when client updates product - 403', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await updateProduct(request, createdProduct.id, { name: 'Client update' }, clientAuth.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for missing product - 404', async ({ request, adminAuth }) => {
    // when
    const response = await updateProduct(request, 999999, { name: 'Missing' }, adminAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

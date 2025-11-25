import { test, expect } from '../../../fixtures/apiAuthFixture';
import { createProduct } from '../../../http/products/createProductRequest';
import { deleteProduct } from '../../../http/products/deleteProductRequest';
import { generateProduct } from '../../../generators/productGenerator';
import type { ProductCreateDto, ProductDto } from '../../../types/products';
import { INVALID_TOKEN } from '../../../config/constants';

test.describe('DELETE /api/products/{id} API tests', () => {
  test('admin should delete product - 204', async ({ request, adminAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProduct(request, createdProduct.id, adminAuth.token);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await deleteProduct(request, 1);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await deleteProduct(request, 1, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden when client deletes product - 403', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProduct(request, createdProduct.id, clientAuth.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for missing product - 404', async ({ request, adminAuth }) => {
    // when
    const response = await deleteProduct(request, 999999, adminAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

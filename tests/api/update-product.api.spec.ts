import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductDto, ProductUpdateDto } from '../../types/product';
import {
  generateProduct,
  generateProductUpdate,
  generateProductUpdateWithInvalidPrice
} from '../../generators/productGenerator';
import { createProduct } from '../../http/productsClient';
import { updateProduct } from '../../http/updateProductClient';

test.describe('/api/products/{id} PUT API tests', () => {
  test('should update product with valid data - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const initialProduct = generateProduct();
    const createResponse = await createProduct(request, initialProduct, authenticatedAdmin.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    const updatePayload: ProductUpdateDto = generateProductUpdate();

    // when
    const response = await updateProduct(request, createdProduct.id, updatePayload, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(200);
    const updatedProduct: ProductDto = await response.json();
    expect(updatedProduct.id).toBe(createdProduct.id);
    expect(updatedProduct.name).toBe(updatePayload.name);
    expect(updatedProduct.description).toBe(updatePayload.description);
    expect(updatedProduct.price).toBe(updatePayload.price);
    expect(updatedProduct.stockQuantity).toBe(updatePayload.stockQuantity);
    expect(updatedProduct.category).toBe(updatePayload.category);
    expect(updatedProduct.imageUrl).toBe(updatePayload.imageUrl);
    expect(new Date(updatedProduct.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(createdProduct.updatedAt).getTime()
    );
  });

  test('should return bad request for invalid data - 400', async ({ request, authenticatedAdmin }) => {
    // given
    const productData = generateProduct();
    const createResponse = await createProduct(request, productData, authenticatedAdmin.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();
    const invalidUpdatePayload = generateProductUpdateWithInvalidPrice();

    // when
    const response = await updateProduct(
      request,
      createdProduct.id,
      invalidUpdatePayload,
      authenticatedAdmin.token
    );

    // then
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.price).toBe('Price must be greater than 0');
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const updatePayload: ProductUpdateDto = {
      name: 'Unauthorized update'
    };

    // when
    const response = await updateProduct(request, 1, updatePayload);

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
    const createdProduct: ProductDto = await createResponse.json();
    const updatePayload: ProductUpdateDto = {
      name: 'Forbidden update'
    };

    // when
    const response = await updateProduct(request, createdProduct.id, updatePayload, authenticatedClient.token);

    // then
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Access denied');
  });

  test('should return not found when product does not exist - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const updatePayload: ProductUpdateDto = {
      name: 'Missing product'
    };
    const nonExistingProductId = Number.MAX_SAFE_INTEGER;

    // when
    const response = await updateProduct(request, nonExistingProductId, updatePayload, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.text();
    expect(responseBody).toBe('');
  });
});

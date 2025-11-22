import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto, ProductUpdateDto } from '../../types/product';
import { createProduct } from '../../http/createProductRequest';
import { getProductById } from '../../http/getProductByIdRequest';
import { updateProduct, updateProductWithoutAuth } from '../../http/updateProductRequest';
import { generateRandomProduct, generateRandomProductUpdate } from '../../generators/productGenerator';

test.describe('PUT /api/products/{id} API tests', () => {
  test('should update product with valid admin token - 200', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, token, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const updateData: ProductUpdateDto = generateRandomProductUpdate();

    // when
    const response = await updateProduct(request, token, createdProduct.id, updateData);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.name).toBe(updateData.name);
    expect(responseBody.description).toBe(updateData.description);
    expect(responseBody.price).toBe(updateData.price);
    expect(responseBody.stockQuantity).toBe(updateData.stockQuantity);
    expect(responseBody.category).toBe(updateData.category);
    expect(responseBody.imageUrl).toBe(updateData.imageUrl);
    expect(responseBody.id).toBe(createdProduct.id);

    const getResponse = await getProductById(request, token, createdProduct.id);
    const getResponseBody: ProductDto = await getResponse.json();
    expect(getResponseBody.name).toBe(updateData.name);
    expect(getResponseBody.description).toBe(updateData.description);
    expect(getResponseBody.price).toBe(updateData.price);
    expect(getResponseBody.stockQuantity).toBe(updateData.stockQuantity);
    expect(getResponseBody.category).toBe(updateData.category);
    expect(getResponseBody.imageUrl).toBe(updateData.imageUrl);
  });

  test('should return validation error for invalid name - 400', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, token, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const invalidUpdateData: ProductUpdateDto = { name: 'ab' };

    // when
    const response = await updateProduct(request, token, createdProduct.id, invalidUpdateData);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, token, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const updateData: ProductUpdateDto = generateRandomProductUpdate();

    // when
    const response = await updateProductWithoutAuth(request, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, token, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const invalidToken = 'invalid.token.here';
    const updateData: ProductUpdateDto = generateRandomProductUpdate();

    // when
    const response = await updateProduct(request, invalidToken, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error when client user tries to update product - 403', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();
    const updateData: ProductUpdateDto = generateRandomProductUpdate();

    // when
    const response = await updateProduct(request, clientToken, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found error for non-existent product id - 404', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const updateData: ProductUpdateDto = generateRandomProductUpdate();
    const nonExistentId = 99999999;

    // when
    const response = await updateProduct(request, token, nonExistentId, updateData);

    // then
    expect(response.status()).toBe(404);
  });
});

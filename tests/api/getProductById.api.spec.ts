import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../types/product';
import { getProductById, getProductByIdWithoutAuth } from '../../http/getProductByIdRequest';
import { createProduct } from '../../http/createProductRequest';
import { generateRandomProduct } from '../../generators/productGenerator';

test.describe('GET /api/products/{id} API tests', () => {
  test('should successfully get product by id with valid token - 200', async ({ request, authenticatedClientUser, authenticatedAdminUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getProductById(request, clientToken, createdProduct.id);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.id).toBe(createdProduct.id);
    expect(responseBody.name).toBe(productData.name);
    expect(responseBody.description).toBe(productData.description);
    expect(responseBody.price).toBe(productData.price);
    expect(responseBody.stockQuantity).toBe(productData.stockQuantity);
    expect(responseBody.category).toBe(productData.category);
    expect(responseBody.imageUrl).toBe(productData.imageUrl);
    expect(responseBody.createdAt).toBeDefined();
    expect(responseBody.updatedAt).toBeDefined();
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getProductByIdWithoutAuth(request, createdProduct.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const invalidToken = 'invalid.token.here';
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getProductById(request, invalidToken, createdProduct.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent product id - 404', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const nonExistentId = 999999999;

    // when
    const response = await getProductById(request, token, nonExistentId);

    // then
    expect(response.status()).toBe(404);
  });
});


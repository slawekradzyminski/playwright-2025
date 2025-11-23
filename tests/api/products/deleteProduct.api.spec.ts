import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import { createProduct } from '../../../http/products/createProductRequest';
import { getProductById } from '../../../http/products/getProductByIdRequest';
import { deleteProduct, deleteProductWithoutAuth } from '../../../http/products/deleteProductRequest';
import { generateRandomProduct } from '../../../generators/productGenerator';

test.describe('DELETE /api/products/{id} API tests', () => {
  test('should delete product with valid admin token - 204', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, token, productData);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProduct(request, token, createdProduct.id);
    
    // then
    expect(response.status()).toBe(204);
    const getResponse = await getProductById(request, token, createdProduct.id);
    expect(getResponse.status()).toBe(404);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, token, productData);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProductWithoutAuth(request, createdProduct.id);

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

    // when
    const response = await deleteProduct(request, invalidToken, createdProduct.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error when client user tries to delete product - 403', async ({ request, authenticatedAdminUser, authenticatedClientUser }) => {
    // given
    const { token: adminToken } = authenticatedAdminUser;
    const { token: clientToken } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, adminToken, productData);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProduct(request, clientToken, createdProduct.id);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found error for non-existent product id - 404', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const nonExistentId = 987654321;

    // when
    const response = await deleteProduct(request, token, nonExistentId);

    // then
    expect(response.status()).toBe(404);
  });
});

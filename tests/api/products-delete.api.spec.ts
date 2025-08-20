import { deleteProduct, deleteProductWithoutToken, createProduct, getProductById } from '../../http/productsClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { ProductDto } from '../../types/product';
import { generateValidProduct } from '../../generators/productGenerator';

test.describe('/api/products/{id} (DELETE) API tests', () => {
  test('should successfully delete product as ADMIN - 204', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const productData = generateValidProduct();
    
    // Create a product first
    const createResponse = await createProduct(request, token, productData);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProduct(request, token, createdProduct.id);

    // then
    expect(response.status()).toBe(204);
    
    // Verify that the product is actually deleted by trying to fetch it
    const getResponse = await getProductById(request, token, createdProduct.id);
    expect(getResponse.status()).toBe(404);
  });

  test('should return unauthorized error for missing token - 401', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const productData = generateValidProduct();
    
    // Create a product first
    const createResponse = await createProduct(request, token, productData);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProductWithoutToken(request, createdProduct.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error for CLIENT user - 403', async ({ request, authenticatedAdmin, authenticatedClient }) => {
    // given
    const adminToken = authenticatedAdmin.token;
    const clientToken = authenticatedClient.token;
    const productData = generateValidProduct();
    
    // Create a product as admin first
    const createResponse = await createProduct(request, adminToken, productData);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await deleteProduct(request, clientToken, createdProduct.id);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found error for non-existent product - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const nonExistentId = 999999;

    // when
    const response = await deleteProduct(request, token, nonExistentId);

    // then
    expect(response.status()).toBe(404);
  });
});

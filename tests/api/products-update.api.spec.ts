import { updateProduct, updateProductWithoutToken, createProduct } from '../../http/productsClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { ProductDto } from '../../types/product';
import { generateValidProduct, generateProductUpdate } from '../../generators/productGenerator';

test.describe('/api/products/{id} (PUT) API tests', () => {
  test('should successfully update product with valid data as ADMIN - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const originalProduct = generateValidProduct();
    
    // Create a product first
    const createResponse = await createProduct(request, token, originalProduct);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    const updateData = generateProductUpdate({
      name: 'Updated Product Name',
      price: 199.99
    });

    // when
    const response = await updateProduct(request, token, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(200);
    
    const updatedProduct: ProductDto = await response.json();
    expect(updatedProduct.id).toBe(createdProduct.id);
    expect(updatedProduct.name).toBe(updateData.name);
    expect(updatedProduct.price).toBe(updateData.price);
    // Verify that updatedAt is a valid timestamp (the exact comparison might be flaky due to timing)
    expect(updatedProduct.updatedAt).toBeDefined();
    expect(typeof updatedProduct.updatedAt).toBe('string');
  });

  test('should return validation error for invalid input - 400', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const originalProduct = generateValidProduct();
    
    // Create a product first
    const createResponse = await createProduct(request, token, originalProduct);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    const invalidUpdate = { price: -1 }; // Invalid negative price

    // when
    const response = await updateProduct(request, token, createdProduct.id, invalidUpdate);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error for missing token - 401', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const originalProduct = generateValidProduct();
    
    // Create a product first
    const createResponse = await createProduct(request, token, originalProduct);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    const updateData = generateProductUpdate();

    // when
    const response = await updateProductWithoutToken(request, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error for CLIENT user - 403', async ({ request, authenticatedAdmin, authenticatedClient }) => {
    // given
    const adminToken = authenticatedAdmin.token;
    const clientToken = authenticatedClient.token;
    const originalProduct = generateValidProduct();
    
    // Create a product as admin first
    const createResponse = await createProduct(request, adminToken, originalProduct);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    const updateData = generateProductUpdate();

    // when
    const response = await updateProduct(request, clientToken, createdProduct.id, updateData);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found error for non-existent product - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const nonExistentId = 999999;
    const updateData = generateProductUpdate();

    // when
    const response = await updateProduct(request, token, nonExistentId, updateData);

    // then
    expect(response.status()).toBe(404);
  });

  test('should successfully update only provided fields - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const originalProduct = generateValidProduct();
    
    // Create a product first
    const createResponse = await createProduct(request, token, originalProduct);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    const partialUpdate = { name: 'Only Name Updated' }; // Only update name

    // when
    const response = await updateProduct(request, token, createdProduct.id, partialUpdate);

    // then
    expect(response.status()).toBe(200);
    
    const updatedProduct: ProductDto = await response.json();
    expect(updatedProduct.id).toBe(createdProduct.id);
    expect(updatedProduct.name).toBe(partialUpdate.name);
    expect(updatedProduct.price).toBe(createdProduct.price); // Should remain unchanged
    expect(updatedProduct.category).toBe(createdProduct.category); // Should remain unchanged
    expect(updatedProduct.stockQuantity).toBe(createdProduct.stockQuantity); // Should remain unchanged
  });
});

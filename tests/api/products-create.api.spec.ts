import { createProduct, createProductWithoutToken } from '../../http/productsClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { ProductDto } from '../../types/product';
import { generateValidProduct, generateInvalidProduct } from '../../generators/productGenerator';

test.describe('/api/products (POST) API tests', () => {
  test('should successfully create product with valid data as ADMIN - 201', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const productData = generateValidProduct();

    // when
    const response = await createProduct(request, token, productData);

    // then
    expect(response.status()).toBe(201);
    
    const createdProduct: ProductDto = await response.json();
    expect(createdProduct).toHaveProperty('id');
    expect(createdProduct).toHaveProperty('createdAt');
    expect(createdProduct).toHaveProperty('updatedAt');
    expect(createdProduct.name).toBe(productData.name);
    expect(createdProduct.price).toBe(productData.price);
    expect(createdProduct.stockQuantity).toBe(productData.stockQuantity);
    expect(createdProduct.category).toBe(productData.category);
    expect(typeof createdProduct.id).toBe('number');
  });

  test('should return validation error for invalid input - 400', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const invalidProduct = generateInvalidProduct('price', -1);

    // when
    const response = await createProduct(request, token, invalidProduct);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error for missing token - 401', async ({ request }) => {
    // given
    const productData = generateValidProduct();

    // when
    const response = await createProductWithoutToken(request, productData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error for CLIENT user - 403', async ({ request, authenticatedClient }) => {
    // given
    const token = authenticatedClient.token;
    const productData = generateValidProduct();

    // when
    const response = await createProduct(request, token, productData);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return validation error for missing required fields - 400', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const incompleteProduct = { name: 'Test Product' }; // Missing required fields

    // when
    const response = await createProduct(request, token, incompleteProduct as any);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return validation error for name too short - 400', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const invalidProduct = generateInvalidProduct('name', 'ab'); // Less than 3 chars

    // when
    const response = await createProduct(request, token, invalidProduct);

    // then
    expect(response.status()).toBe(400);
  });
});

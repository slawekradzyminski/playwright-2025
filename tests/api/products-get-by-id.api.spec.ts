import { getProductById, getProductByIdWithoutToken, createProduct } from '../../http/productsClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { ProductDto } from '../../types/product';
import { generateValidProduct } from '../../generators/productGenerator';

test.describe('/api/products/{id} (GET) API tests', () => {
  test('should successfully get product by ID with valid token - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const productData = generateValidProduct();
    
    // Create a product first
    const createResponse = await createProduct(request, token, productData);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getProductById(request, token, createdProduct.id);

    // then
    expect(response.status()).toBe(200);
    
    const product: ProductDto = await response.json();
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('stockQuantity');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('imageUrl');
    expect(product).toHaveProperty('createdAt');
    expect(product).toHaveProperty('updatedAt');
    expect(product.id).toBe(createdProduct.id);
    expect(product.name).toBe(productData.name);
    expect(product.price).toBe(productData.price);
    expect(product.stockQuantity).toBe(productData.stockQuantity);
    expect(product.category).toBe(productData.category);
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
    const response = await getProductByIdWithoutToken(request, createdProduct.id);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent product - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const nonExistentId = 999999;

    // when
    const response = await getProductById(request, token, nonExistentId);

    // then
    expect(response.status()).toBe(404);
  });
});

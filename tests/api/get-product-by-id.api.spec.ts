import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductDto } from '../../types/product';
import { generateProduct } from '../../generators/productGenerator';
import { createProduct } from '../../http/productsClient';
import { getProductById } from '../../http/getProductByIdClient';

test.describe('/api/products/{id} GET API tests', () => {
  test('should retrieve product by id with valid token - 200', async ({ request, authenticatedAdmin, authenticatedClient }) => {
    // given
    const productData = generateProduct();
    const createResponse = await createProduct(request, productData, authenticatedAdmin.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getProductById(request, createdProduct.id, authenticatedClient.token);

    // then
    expect(response.status()).toBe(200);
    const product: ProductDto = await response.json();
    expect(product.id).toBe(createdProduct.id);
    expect(product.name).toBe(createdProduct.name);
    expect(product.description).toBe(createdProduct.description);
    expect(product.price).toBe(createdProduct.price);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await getProductById(request, 1);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return not found when product does not exist - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const nonExistingProductId = Number.MAX_SAFE_INTEGER;

    // when
    const response = await getProductById(request, nonExistingProductId, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.text();
    expect(responseBody).toBe('');
  });
});

import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductDto } from '../../types/product';
import { generateProduct } from '../../generators/productGenerator';
import { createProduct } from '../../http/productsClient';
import { getAllProducts } from '../../http/getAllProductsClient';

test.describe('/api/products GET API tests', () => {
  test('should retrieve all products with valid token - 200', async ({ request, authenticatedAdmin, authenticatedClient }) => {
    // given
    const productData = generateProduct();
    const createResponse = await createProduct(request, productData, authenticatedAdmin.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getAllProducts(request, authenticatedClient.token);

    // then
    expect(response.status()).toBe(200);
    const products: ProductDto[] = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    const foundProduct = products.find((product) => product.id === createdProduct.id);
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe(productData.name);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await getAllProducts(request);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

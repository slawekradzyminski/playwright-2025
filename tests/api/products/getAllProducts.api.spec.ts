import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import { getAllProducts, getAllProductsWithoutAuth } from '../../../http/products/getAllProductsRequest';
import { createProduct } from '../../../http/products/createProductRequest';
import { generateRandomProduct } from '../../../generators/productGenerator';

test.describe('GET /api/products API tests', () => {
  test('should successfully get all products with valid token - 200', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;

    // when
    const response = await getAllProducts(request, token);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
  });

  test('should return products after creating new product - 200', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();
    const createResponse = await createProduct(request, token, productData);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getAllProducts(request, token);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    const foundProduct = responseBody.find(p => p.id === createdProduct.id);
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe(productData.name);
    expect(foundProduct?.price).toBe(productData.price);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given

    // when
    const response = await getAllProductsWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.here';

    // when
    const response = await getAllProducts(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });
});


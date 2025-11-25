import { test, expect } from '../../../fixtures/apiAuthFixture';
import { createProduct } from '../../../http/products/createProductRequest';
import { getProducts } from '../../../http/products/getProductsRequest';
import type { ProductDto } from '../../../types/products';
import { generateProduct } from '../../../generators/productGenerator';
import { INVALID_TOKEN } from '../../../config/constants';

test.describe('GET /api/products API tests', () => {
  test('client should retrieve product catalog - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getProducts(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto[] = await response.json();
    const targetProduct = responseBody.find((product) => product.id === createdProduct.id);
    expect(targetProduct).toBeTruthy();
    expect(targetProduct?.name).toBe(productData.name);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await getProducts(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await getProducts(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});

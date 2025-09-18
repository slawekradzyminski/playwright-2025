import { test, expect } from '../../fixtures/apiAuth';
import { getAllProducts, getAllProductsNoAuth } from '../../http/getAllProductsClient';
import { ProductDto } from '../../types/product';

test.describe('/api/products GET API tests', () => {
  test('should successfully retrieve products list with auth token - 200', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;

    // when
    const response = await getAllProducts(request, token);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    
    // If products exist, validate structure
    if (responseBody.length > 0) {
      const product = responseBody[0] as ProductDto;
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stockQuantity');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('imageUrl');
      expect(product).toHaveProperty('createdAt');
      expect(product).toHaveProperty('updatedAt');
    }
  });

  test('should return unauthorized error without token - 401', async ({ request }) => {
    // given
    // no authentication token

    // when
    const response = await getAllProductsNoAuth(request);

    // then
    expect(response.status()).toBe(401);
  });
});

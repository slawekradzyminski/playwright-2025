import { test, expect } from '../../fixtures/auth.fixture';
import type { ProductDto } from '../../types/product';
import { validateProductDto } from '../../validators/productsValidator';
import { getProducts } from '../../http/getProducts';

test.describe('/api/products API tests', () => {
  test('should successfully retrieve all products with valid authentication - 200', async ({ request, authToken }) => {
    // when
    const response = await getProducts(request, authToken);
 
    // then
    expect(response.status()).toBe(200);
    
    const responseBody: ProductDto[] = await response.json();
    expect(responseBody.length).toBeGreaterThan(0);
    responseBody.forEach(product => {
      validateProductDto(product);
    });
  });

  test('should return 401 Unauthorized for unauthenticated requests - 401', async ({ request }) => {
    // when
    const response = await getProducts(request, 'invalid-token');

    // then
    expect(response.status()).toBe(401);
  });
}); 
import { getAllProducts, getAllProductsWithoutToken } from '../../http/productsClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { ProductDto } from '../../types/product';

test.describe('/api/products (GET) API tests', () => {
  test('should successfully get all products with valid token - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;

    // when
    const response = await getAllProducts(request, token);

    // then
    expect(response.status()).toBe(200);
    
    const products: ProductDto[] = await response.json();
    expect(Array.isArray(products)).toBe(true);
    
    if (products.length > 0) {
      const firstProduct = products[0];
      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('description');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('stockQuantity');
      expect(firstProduct).toHaveProperty('category');
      expect(firstProduct).toHaveProperty('imageUrl');
      expect(firstProduct).toHaveProperty('createdAt');
      expect(firstProduct).toHaveProperty('updatedAt');
      expect(typeof firstProduct.id).toBe('number');
      expect(typeof firstProduct.name).toBe('string');
      expect(typeof firstProduct.price).toBe('number');
      expect(typeof firstProduct.stockQuantity).toBe('number');
    }
  });

  test('should return unauthorized error for missing token - 401', async ({ request }) => {
    // given - no token provided

    // when
    const response = await getAllProductsWithoutToken(request);

    // then
    expect(response.status()).toBe(401);
  });
});

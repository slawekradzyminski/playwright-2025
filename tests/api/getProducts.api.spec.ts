import { test, expect } from '../../fixtures/auth.fixtures';
import type { ProductDto } from '../../types/products';
import { getProducts } from '../../http/getProducts';

test.describe('/api/products API tests', () => {
  test('should successfully get all products - 200', async ({ request, authToken }) => {
    // when
    const response = await getProducts(request, authToken);

    // then
    expect(response.status()).toBe(200);
    const products: ProductDto[] = await response.json();
    // We assume that at least one product is available
    // TODO: Improve with smarter schema checking
    const product = products[0];
    expect(product.id).toBeDefined();
    expect(product.name).toBeDefined();
    expect(product.description).toBeDefined();
    expect(product.price).toBeDefined();
    expect(product.stockQuantity).toBeDefined();
    expect(product.category).toBeDefined();
    expect(product.imageUrl).toBeDefined();
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
  });
});

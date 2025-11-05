import { test, expect } from '../../fixtures/authFixtures';
import {
  getAllProducts,
  getAllProductsWithoutAuth,
} from '../../../http/products/productsCollectionGetClient';
import type { ProductDto } from '../../../types/product';

const assertProductsArray = async (response: Awaited<ReturnType<typeof getAllProducts>>) => {
  const responseBody = (await response.json()) as ProductDto[];
  expect(Array.isArray(responseBody)).toBe(true);
  if (responseBody.length > 0) {
    responseBody.forEach(product => {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeGreaterThanOrEqual(0);
      expect(product.stockQuantity).toBeGreaterThanOrEqual(0);
      expect(product.category).toBeDefined();
    });
  }
};

test.describe('/api/products GET', () => {
  test('should retrieve all products with admin token - 200', async ({ request, authenticatedAdmin }) => {
    const response = await getAllProducts(request, authenticatedAdmin.token);

    expect(response.status()).toBe(200);
    await assertProductsArray(response);
  });

  test('should retrieve all products with client token - 200', async ({ request, authenticatedClient }) => {
    const response = await getAllProducts(request, authenticatedClient.token);

    expect(response.status()).toBe(200);
    await assertProductsArray(response);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    const response = await getAllProductsWithoutAuth(request);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

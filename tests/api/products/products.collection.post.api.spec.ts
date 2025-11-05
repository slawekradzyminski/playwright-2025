import { test, expect } from '../../../fixtures/authFixtures';
import {
  createProduct,
  createProductWithoutAuth,
} from '../../../http/products/productsCollectionPostClient';
import { generateProductCreateData, generateInvalidProductData } from '../../../generators/productGenerator';
import type { ProductDto } from '../../../types/product';
import { API_BASE_URL } from '../../../config/constants';

const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products`;

const deleteProductById = async (request: Parameters<typeof test.use>[0]['request'], token: string, id: number) => {
  await request.delete(`${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

test.describe('/api/products POST', () => {
  test('should create product with admin token - 201', async ({ request, authenticatedAdmin }) => {
    const payload = generateProductCreateData();

    const response = await createProduct(request, authenticatedAdmin.token, payload);

    expect(response.status()).toBe(201);
    const responseBody = (await response.json()) as ProductDto;
    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe(payload.name);
    expect(responseBody.description).toBe(payload.description);
    expect(responseBody.price).toBe(payload.price);
    expect(responseBody.stockQuantity).toBe(payload.stockQuantity);
    expect(responseBody.category).toBe(payload.category);
    expect(responseBody.imageUrl).toBe(payload.imageUrl);

    await deleteProductById(request, authenticatedAdmin.token, responseBody.id);
  });

  test('should return forbidden for client token - 403', async ({ request, authenticatedClient }) => {
    const payload = generateProductCreateData();

    const response = await createProduct(request, authenticatedClient.token, payload);

    expect(response.status()).toBe(403);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    const payload = generateProductCreateData();

    const response = await createProductWithoutAuth(request, payload);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return bad request for invalid data - 400', async ({ request, authenticatedAdmin }) => {
    const payload = generateInvalidProductData.withNegativePrice();

    const response = await createProduct(request, authenticatedAdmin.token, payload);

    expect(response.status()).toBe(400);
  });
});

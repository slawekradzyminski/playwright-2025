import { test, expect, APIResponse } from '@playwright/test';
import { ProductClient } from '../../httpclients/productClient';
import type { ProductDto } from '../../types/product';
import { registerAndLogin } from './helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_PRODUCT_ID = 999999999;

test.describe('/api/v1/products API tests', () => {
  let client: ProductClient;

  test.beforeEach(async ({ request }) => {
    client = new ProductClient(request, APP_BASE_URL);
  });

  test('should return product list for authenticated user - 200', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);

    // when
    const response = await client.getProducts(token);

    // then
    expect(response.status()).toBe(200);
    const products = await assertProductListResponse(response);
    expect(products.length).toBeGreaterThan(0);
  });

  test('should return product by id for authenticated user - 200', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);
    const productsResponse = await client.getProducts(token);
    expect(productsResponse.status()).toBe(200);
    const products: ProductDto[] = await productsResponse.json();
    expect(products.length).toBeGreaterThan(0);
    const product = products[0];

    // when
    const response = await client.getProductById(product.id, token);

    // then
    expect(response.status()).toBe(200);
    await assertProductResponse(response, product.id);
  });

  test('should return unauthorized for product list without JWT token - 401', async () => {
    // when
    const response = await client.getProducts();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized for product by id without JWT token - 401', async () => {
    // when
    const response = await client.getProductById(1);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return not found for missing product - 404', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);

    // when
    const response = await client.getProductById(MISSING_PRODUCT_ID, token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Product not found');
  });
});

const assertProductListResponse = async (response: APIResponse): Promise<ProductDto[]> => {
  const responseBody: ProductDto[] = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  responseBody.forEach(assertProduct);

  return responseBody;
};

const assertProductResponse = async (response: APIResponse, expectedId: number) => {
  const responseBody: ProductDto = await response.json();
  expect(responseBody.id).toBe(expectedId);
  assertProduct(responseBody);
};

const assertProduct = (product: ProductDto) => {
  expect(product.id).toEqual(expect.any(Number));
  expect(product.name).toEqual(expect.any(String));
  expect(product.description).toEqual(expect.any(String));
  expect(product.price).toEqual(expect.any(Number));
  expect(product.stockQuantity).toEqual(expect.any(Number));
  expect(product.category).toEqual(expect.any(String));
  expect(product.imageUrl).toEqual(expect.any(String));
  expect(product.createdAt).toEqual(expect.any(String));
  expect(product.updatedAt).toEqual(expect.any(String));
};

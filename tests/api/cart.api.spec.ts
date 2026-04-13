import { test, expect } from '@playwright/test';
import { CartClient } from '../../httpclients/cartClient';
import { ProductClient } from '../../httpclients/productClient';
import type { CartDto } from '../../types/cart';
import type { ProductDto } from '../../types/product';
import { registerAndLogin } from './helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_PRODUCT_ID = 999999999;

test.describe('/api/v1/cart API tests', () => {
  let cartClient: CartClient;
  let productClient: ProductClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request, APP_BASE_URL);
    productClient = new ProductClient(request, APP_BASE_URL);
  });

  test.describe('GET /api/v1/cart', () => {
    test('should return empty cart for fresh user - 200', async ({ request }) => {
      // given
      const { token } = await registerAndLogin(request);

      // when
      const response = await cartClient.getCart(token);

      // then
      expect(response.status()).toBe(200);
      const body: CartDto = await response.json();
      expect(body.items).toEqual([]);
      expect(body.totalPrice).toBe(0);
      expect(body.totalItems).toBe(0);
      expect(body.username).toEqual(expect.any(String));
    });

    test('should return unauthorized without JWT token - 401', async () => {
      // when
      const response = await cartClient.getCart();

      // then
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });

  test.describe('DELETE /api/v1/cart', () => {
    test('should clear cart - 204', async ({ request }) => {
      // given
      const { token } = await registerAndLogin(request);
      const productsResponse = await productClient.getProducts(token);
      expect(productsResponse.status()).toBe(200);
      const products: ProductDto[] = await productsResponse.json();
      const productId = products[0].id;
      await cartClient.addItem({ productId, quantity: 1 }, token);

      // when
      const response = await cartClient.clearCart(token);

      // then
      expect(response.status()).toBe(204);
      const cartResponse = await cartClient.getCart(token);
      const body: CartDto = await cartResponse.json();
      expect(body.items).toEqual([]);
      expect(body.totalItems).toBe(0);
    });

    test('should return unauthorized without JWT token - 401', async () => {
      // when
      const response = await cartClient.clearCart();

      // then
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });

  test.describe('POST /api/v1/cart/items', () => {
    test('should add product to cart - 200', async ({ request }) => {
      // given
      const { token } = await registerAndLogin(request);
      const productsResponse = await productClient.getProducts(token);
      expect(productsResponse.status()).toBe(200);
      const products: ProductDto[] = await productsResponse.json();
      const productId = products[0].id;

      // when
      const response = await cartClient.addItem({ productId, quantity: 2 }, token);

      // then
      expect(response.status()).toBe(200);
      const body: CartDto = await response.json();
      expect(body.username).toEqual(expect.any(String));
      expect(body.totalItems).toBe(2);
      expect(body.totalPrice).toBeGreaterThan(0);
      expect(body.items).toHaveLength(1);
      expect(body.items[0].productId).toBe(productId);
      expect(body.items[0].quantity).toBe(2);
    });

    test('should return bad request for invalid quantity - 400', async ({ request }) => {
      // given
      const { token } = await registerAndLogin(request);

      // when
      const response = await cartClient.addItem({ productId: 1, quantity: 0 }, token);

      // then
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.quantity).toBe('must be greater than or equal to 1');
    });

    test('should return unauthorized without JWT token - 401', async () => {
      // when
      const response = await cartClient.addItem({ productId: 1, quantity: 1 });

      // then
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });

    test('should return not found for missing product - 404', async ({ request }) => {
      // given
      const { token } = await registerAndLogin(request);

      // when
      const response = await cartClient.addItem({ productId: MISSING_PRODUCT_ID, quantity: 1 }, token);

      // then
      expect(response.status()).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Product not found');
    });
  });
});

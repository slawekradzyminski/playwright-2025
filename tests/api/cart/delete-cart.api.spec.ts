import { test, expect } from '@playwright/test';
import { CartClient } from '../../../httpclients/cartClient';
import { ProductClient } from '../../../httpclients/productClient';
import type { CartDto } from '../../../types/cart';
import type { ProductDto } from '../../../types/product';
import { registerAndLogin } from '../helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('DELETE /api/v1/cart', () => {
  let cartClient: CartClient;
  let productClient: ProductClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request, APP_BASE_URL);
    productClient = new ProductClient(request, APP_BASE_URL);
  });

  test('should clear cart - 204', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);
    const productsResponse = await productClient.getProducts(token);
    expect(productsResponse.status()).toBe(200);
    const products: ProductDto[] = await productsResponse.json();
    await cartClient.addItem({ productId: products[0].id, quantity: 1 }, token);

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

import { test, expect } from '@playwright/test';
import { CartClient } from '../../../httpclients/cartClient';
import type { CartDto } from '../../../types/cart';
import { registerAndLogin } from '../helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('GET /api/v1/cart', () => {
  let client: CartClient;

  test.beforeEach(async ({ request }) => {
    client = new CartClient(request, APP_BASE_URL);
  });

  test('should return empty cart for fresh user - 200', async ({ request }) => {
    // given
    const { token } = await registerAndLogin(request);

    // when
    const response = await client.getCart(token);

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
    const response = await client.getCart();

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });
});

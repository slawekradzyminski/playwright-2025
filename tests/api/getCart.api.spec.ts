import { test, expect } from '../../fixtures/apiAuthFixture';
import { getCart } from '../../http/getCartRequest';
import type { CartDto } from '../../types/cart';
import { INVALID_TOKEN } from '../../config/constants';

test.describe('GET /api/cart API tests', () => {
  test('client should retrieve empty cart - 200', async ({ request, clientAuth }) => {
    // given
    const expectedUsername = clientAuth.userData.username;

    // when
    const response = await getCart(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: CartDto = await response.json();
    expect(responseBody.username).toBe(expectedUsername);
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.items.length).toBe(0);
    expect(responseBody.totalItems).toBe(0);
    expect(responseBody.totalPrice).toBe(0);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await getCart(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await getCart(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});

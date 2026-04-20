import { CartClient } from '../../httpclients/cartClient';
import type { CartDto } from '../../types/cart';
import { expect, test } from '../../fixtures/authenticatedUserFixture';

test.describe('GET /api/v1/cart API tests', () => {
  test('should return current user cart - 200', async ({ request, authenticatedUser }) => {
    // given
    const cartClient = new CartClient(request);

    // when
    const response = await cartClient.getCart(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: CartDto = await response.json();
    expect(responseBody.username).toBe(authenticatedUser.userData.username);
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.totalPrice).toEqual(expect.any(Number));
    expect(responseBody.totalItems).toEqual(expect.any(Number));
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const cartClient = new CartClient(request);

    // when
    const response = await cartClient.getCart();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const cartClient = new CartClient(request);

    // when
    const response = await cartClient.getCart('invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

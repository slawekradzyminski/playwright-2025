import { CartClient } from '../../httpclients/cartClient';
import { expect, test } from '../../fixtures/authenticatedUserFixture';

test.describe('DELETE /api/v1/cart API tests', () => {
  test('should clear current user cart - 204', async ({ request, authenticatedUser }) => {
    // given
    const cartClient = new CartClient(request);

    // when
    const response = await cartClient.clearCart(authenticatedUser.token);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const cartClient = new CartClient(request);

    // when
    const response = await cartClient.clearCart();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const cartClient = new CartClient(request);

    // when
    const response = await cartClient.clearCart('invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

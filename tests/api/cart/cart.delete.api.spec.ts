import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { CartClient } from '../../../httpclients/cartClient';

test.describe('DELETE /api/v1/cart API tests', () => {
  let cartClient: CartClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
  });

  test('should clear current user cart - 204', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await cartClient.clearCart(authenticatedUser.token);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await cartClient.clearCart();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await cartClient.clearCart(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

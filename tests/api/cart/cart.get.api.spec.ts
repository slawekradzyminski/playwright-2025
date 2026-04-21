import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { CartClient } from '../../../httpclients/cartClient';
import type { CartDto } from '../../../types/cart';

test.describe('GET /api/v1/cart API tests', () => {
  let cartClient: CartClient;

  test.beforeEach(async ({ request }) => {
    cartClient = new CartClient(request);
  });

  test('should return current user cart - 200', async ({ authenticatedApiUser }) => {
    // given

    // when
    const response = await cartClient.getCart(authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<CartDto>(response, 200);
    expect(responseBody.username).toBe(authenticatedApiUser.userData.username);
    expect(Array.isArray(responseBody.items)).toBe(true);
    expect(responseBody.totalPrice).toEqual(expect.any(Number));
    expect(responseBody.totalItems).toEqual(expect.any(Number));
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await cartClient.getCart();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await cartClient.getCart(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectErrorMessage, expectInvalidToken, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';

test.describe('POST /api/v1/users/logout API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should logout user and invalidate existing refresh tokens - 200', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await usersClient.logout(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const refreshResponse = await usersClient.refresh({
      refreshToken: authenticatedUser.refreshToken
    });
    await expectErrorMessage(refreshResponse, 401, 'Invalid refresh token');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.logout();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.logout(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

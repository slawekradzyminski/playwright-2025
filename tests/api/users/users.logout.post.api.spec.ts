import { UsersClient } from '../../../httpclients/usersClient';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';

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
    expect(refreshResponse.status()).toBe(401);

    const refreshResponseBody = await refreshResponse.json();
    expect(refreshResponseBody.message).toBe('Invalid refresh token');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.logout();

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.logout('invalid-token');

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

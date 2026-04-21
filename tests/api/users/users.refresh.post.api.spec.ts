import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectErrorMessage, expectJsonResponse } from '../../../helpers/apiAssertions';
import { UsersClient } from '../../../httpclients/usersClient';
import type { TokenRefreshResponseDto } from '../../../types/auth';

const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test.describe('POST /api/v1/users/refresh API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should refresh access and refresh tokens - 200', async ({ authenticatedApiUser }) => {
    // given

    // when
    const response = await usersClient.refresh({
      refreshToken: authenticatedApiUser.refreshToken
    });

    // then
    const responseBody = await expectJsonResponse<TokenRefreshResponseDto>(response, 200);
    expect(responseBody.token).toMatch(JWT_REGEX);
    expect(responseBody.refreshToken).toEqual(expect.any(String));
    expect(responseBody.refreshToken).not.toBe(authenticatedApiUser.refreshToken);
  });

  test('should return validation error when refresh token is missing - 400', async () => {
    // given

    // when
    const response = await usersClient.refresh({});

    // then
    const responseBody = await expectJsonResponse<{ refreshToken: string }>(response, 400);
    expect(responseBody.refreshToken).toBe('must not be blank');
  });

  test('should return unauthorized when refresh token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.refresh({
      refreshToken: 'invalid-refresh-token'
    });

    // then
    await expectErrorMessage(response, 401, 'Invalid refresh token');
  });

  test('should return unauthorized when refresh token was already rotated - 401', async ({ authenticatedApiUser }) => {
    // given
    const firstResponse = await usersClient.refresh({
      refreshToken: authenticatedApiUser.refreshToken
    });
    expect(firstResponse.status()).toBe(200);

    // when
    const response = await usersClient.refresh({
      refreshToken: authenticatedApiUser.refreshToken
    });

    // then
    await expectErrorMessage(response, 401, 'Invalid refresh token');
  });
});

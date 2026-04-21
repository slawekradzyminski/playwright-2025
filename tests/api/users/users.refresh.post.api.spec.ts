import { UsersClient } from '../../../httpclients/usersClient';
import type { TokenRefreshResponseDto } from '../../../types/auth';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';

const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test.describe('POST /api/v1/users/refresh API tests', () => {
  test('should refresh access and refresh tokens - 200', async ({ request, authenticatedUser }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.refresh({
      refreshToken: authenticatedUser.refreshToken
    });

    // then
    expect(response.status()).toBe(200);

    const responseBody: TokenRefreshResponseDto = await response.json();
    expect(responseBody.token).toMatch(JWT_REGEX);
    expect(responseBody.refreshToken).toEqual(expect.any(String));
    expect(responseBody.refreshToken).not.toBe(authenticatedUser.refreshToken);
  });

  test('should return validation error when refresh token is missing - 400', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.refresh({});

    // then
    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.refreshToken).toBe('must not be blank');
  });

  test('should return unauthorized when refresh token is invalid - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.refresh({
      refreshToken: 'invalid-refresh-token'
    });

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid refresh token');
  });

  test('should return unauthorized when refresh token was already rotated - 401', async ({ request, authenticatedUser }) => {
    // given
    const usersClient = new UsersClient(request);
    const firstResponse = await usersClient.refresh({
      refreshToken: authenticatedUser.refreshToken
    });
    expect(firstResponse.status()).toBe(200);

    // when
    const response = await usersClient.refresh({
      refreshToken: authenticatedUser.refreshToken
    });

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid refresh token');
  });
});

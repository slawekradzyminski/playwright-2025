import { test, expect } from '../../fixtures/apiAuth';
import { attemptGetUserByUsername } from '../../http/getUserByUsernameClient';
import type { UserResponseDto } from '../../types/user';

test.describe('/users/{username} GET', () => {
  test('should return user details for owner token - 200', async ({ apiAuth }) => {
    // given
    const { request, user, token } = apiAuth;

    // when
    const response = await attemptGetUserByUsername(request, user.username, token);

    // then
    expect(response.status()).toBe(200);
    const body: UserResponseDto = await response.json();
    expect(body.username).toBe(user.username);
    expect(body.email).toBe(user.email);
  });

  test('should return 401 when no token provided - 401', async ({ apiAuth }) => {
    // given
    const { request, user } = apiAuth;

    // when
    const response = await attemptGetUserByUsername(request, user.username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 404 for unknown username - 404', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;

    // when
    const response = await attemptGetUserByUsername(request, 'user__does_not_exist__404', token);

    // then
    expect(response.status()).toBe(404);
  });
});

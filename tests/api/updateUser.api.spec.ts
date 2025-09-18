import { test, expect } from '../../fixtures/apiAuth';
import { attemptUpdateUser } from '../../http/updateUserClient';
import { attemptGetUserByUsername } from '../../http/getUserByUsernameClient';
import type { UserEditDto, UserResponseDto } from '../../types/user';

test.describe('/users/{username} PUT', () => {
  test('should update own profile when payload is valid - 200', async ({ apiAuth }) => {
    // given
    const { request, user, token } = apiAuth;
    const payload: UserEditDto = { email: `updated+${user.email}`, firstName: user.firstName, lastName: user.lastName };

    // when
    const response = await attemptUpdateUser(request, user.username, payload, token);

    // then
    expect(response.status()).toBe(200);
    const body: UserResponseDto = await response.json();
    expect(body.email).toBe(payload.email);

    // and verify via GET
    const getRes = await attemptGetUserByUsername(request, user.username, token);
    expect(getRes.status()).toBe(200);
    const fetched: UserResponseDto = await getRes.json();
    expect(fetched.email).toBe(payload.email);
  });

  test('should return 400 for invalid email - 400', async ({ apiAuth }) => {
    // given
    const { request, user, token } = apiAuth;
    const payload: UserEditDto = { email: 'not-an-email' };

    // when
    const response = await attemptUpdateUser(request, user.username, payload, token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return 401 when no token provided - 401', async ({ apiAuth }) => {
    // given
    const { request, user } = apiAuth;
    const payload: UserEditDto = { email: `noauth+${user.email}` };

    // when
    const response = await attemptUpdateUser(request, user.username, payload);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 403 when non-admin edits another user - 403', async ({ apiAuth, apiAuthAdmin }) => {
    // given
    const { request, token } = apiAuth;        // non-admin
    const otherUser = apiAuthAdmin.user;       // someone else
    const payload: UserEditDto = { email: `hijack+${otherUser.email}` };

    // when
    const response = await attemptUpdateUser(request, otherUser.username, payload, token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return 404 for unknown username - 404', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;
    const payload: UserEditDto = { email: 'ghost@example.com' };

    // when
    const response = await attemptUpdateUser(request, 'user__does_not_exist__404', payload, token);

    // then
    expect(response.status()).toBe(404);
  });
});

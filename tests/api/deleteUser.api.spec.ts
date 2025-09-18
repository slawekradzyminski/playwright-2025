import { test, expect } from '../../fixtures/apiAuth';
import { attemptDeleteUser } from '../../http/deleteUserClient';
import { attemptGetUserByUsername } from '../../http/getUserByUsernameClient';
import { randomClient } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/signupClient';

test.describe('/users/{username} DELETE', () => {
  test('should allow admin to delete a user - 204', async ({ apiAuthAdmin }) => {
    // given: create a disposable user to delete
    const { request, token } = apiAuthAdmin; // admin token
    const newUser = randomClient();
    const signupRes = await attemptSignup(request, newUser);
    expect(signupRes.status()).toBe(201);

    // when
    const response = await attemptDeleteUser(request, newUser.username, token);

    // then
    expect(response.status()).toBe(204);

    // and the user should be gone
    const getAfter = await attemptGetUserByUsername(request, newUser.username, token);
    expect(getAfter.status()).toBe(404);
  });

  test('should return 401 when no token provided - 401', async ({ apiAuth }) => {
    // given
    const { request, user } = apiAuth;
    
    // when
    const response = await attemptDeleteUser(request, user.username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 403 when non-admin deletes another user - 403', async ({ apiAuth, apiAuthAdmin }) => {
    // given
    const { request, token } = apiAuth;       // non-admin token
    const otherUser = apiAuthAdmin.user;      // someone else

    // when 
    const response = await attemptDeleteUser(request, otherUser.username, token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return 404 for unknown username - 404', async ({ apiAuthAdmin }) => {
    // given
    const { request, token } = apiAuthAdmin;
    
    // when
    const response = await attemptDeleteUser(request, 'user__does_not_exist__404', token);

    // then
    expect(response.status()).toBe(404);
  });
});

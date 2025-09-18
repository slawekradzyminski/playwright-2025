import { test, expect } from '../../fixtures/apiAuth';
import { deleteUser } from '../../http/deleteUserClient';
import { attemptSignup } from '../../http/signupClient';
import { attemptLogin } from '../../http/loginClient';
import { randomClient } from '../../generators/userGenerator';

test.describe('/users/{username} DELETE API tests', () => {
  test('should delete user when admin deletes any user - 204', async ({ apiAuthAdmin, request }) => {
    // given - create a temporary user to delete
    const tempUser = randomClient();
    await attemptSignup(request, tempUser);
    const loginResponse = await attemptLogin(request, tempUser);
    const tempUserToken = (await loginResponse.json()).token;

    // when
    const response = await deleteUser(apiAuthAdmin.request, tempUser.username, apiAuthAdmin.token);

    // then
    expect(response.status()).toBe(204);
    
    // verify user is actually deleted by trying to login
    const loginAttempt = await attemptLogin(request, tempUser);
    expect(loginAttempt.status()).toBe(422); // Should fail as user no longer exists
  });

  test('should return forbidden when user tries to delete own account - 403', async ({ request }) => {
    // given - create a temporary user
    const tempUser = randomClient();
    await attemptSignup(request, tempUser);
    const loginResponse = await attemptLogin(request, tempUser);
    const tempUserToken = (await loginResponse.json()).token;

    // when
    const response = await deleteUser(request, tempUser.username, tempUserToken);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return unauthorized for missing token - 401', async ({ request, apiAuth }) => {
    // given
    const username = apiAuth.user.username;

    // when
    const response = await request.delete(`http://localhost:4001/users/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden when non-admin user tries to delete another user - 403', async ({ apiAuth, apiAuthAdmin }) => {
    // given
    const targetUsername = apiAuthAdmin.user.username;

    // when
    const response = await deleteUser(apiAuth.request, targetUsername, apiAuth.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for non-existent username - 404', async ({ apiAuthAdmin }) => {
    // given
    const nonExistentUsername = 'nonexistentuser99999';

    // when
    const response = await deleteUser(apiAuthAdmin.request, nonExistentUsername, apiAuthAdmin.token);

    // then
    expect(response.status()).toBe(404);
  });
});

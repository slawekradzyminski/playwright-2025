import { test, expect } from '../../fixtures/auth.fixtures';
import { deleteUserByUsername } from '../../http/usersClient';
import { generateClientUser } from '../../generators/userGenerator';
import { signup } from '../../http/registrationClient';
import { login } from '../../http/loginClient';

test.describe('/users/{username} DELETE API tests', () => {
  test('should delete user as ADMIN - 204', async ({ request, authenticatedUser }) => {
    // given
    const adminToken = authenticatedUser.token;
    const adminUsername = authenticatedUser.user.username;

    // when
    const response = await deleteUserByUsername(request, adminToken, adminUsername);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.value';

    // when
    const response = await deleteUserByUsername(request, invalidToken, 'client');

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden for CLIENT user - 403', async ({ request, authenticatedUser }) => {
    // given
    const client = generateClientUser();
    await signup(request, client);
    const loginResponse = await login(request, { username: client.username, password: client.password });
    const { token: clientToken } = await loginResponse.json();
    const clientUsername = client.username;

    // when
    const response = await deleteUserByUsername(request, clientToken, clientUsername);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found when ADMIN deletes non-existent user - 404', async ({ request, authenticatedUser }) => {
    // given
    const adminToken = authenticatedUser.token;
    const adminUsername = authenticatedUser.user.username;

    // when
    const response = await deleteUserByUsername(request, adminToken, 'not-existing-user');

    // then
    expect(response.status()).toBe(404);
  });
});



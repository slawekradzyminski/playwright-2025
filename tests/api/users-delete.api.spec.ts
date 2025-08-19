import { test, expect } from '../../fixtures/auth.fixtures';
import { deleteUserByUsername } from '../../http/usersClient';

test.describe('/users/{username} DELETE API tests', () => {
  test('should delete user as ADMIN - 204', async ({ request, authenticatedAdmin }) => {
    // given
    const adminToken = authenticatedAdmin.token;
    const adminUsername = authenticatedAdmin.user.username;

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

  test('should return forbidden for CLIENT user - 403', async ({ request, authenticatedClient }) => {
    // given
    const clientToken = authenticatedClient.token;
    const clientUsername = authenticatedClient.user.username;

    // when
    const response = await deleteUserByUsername(request, clientToken, clientUsername);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found when ADMIN deletes non-existent user - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const adminToken = authenticatedAdmin.token;

    // when
    const response = await deleteUserByUsername(request, adminToken, 'not-existing-user');

    // then
    expect(response.status()).toBe(404);
  });
});



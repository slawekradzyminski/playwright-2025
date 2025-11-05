import { test, expect } from '../../../fixtures/authFixtures';
import {
  deleteUserByUsername,
  deleteUserByUsernameWithoutAuth,
} from '../../../http/users/usersByUsernameDeleteClient';
import { getUserByUsername } from '../../../http/users/usersByUsernameGetClient';

test.describe('/users/{username} DELETE', () => {
  test('should delete user by username with admin token - 204', async ({
    request,
    authenticatedAdmin,
    authenticatedClient,
  }) => {
    const response = await deleteUserByUsername(
      request,
      authenticatedAdmin.token,
      authenticatedClient.user.username,
    );

    expect(response.status()).toBe(204);

    const verifyResponse = await getUserByUsername(
      request,
      authenticatedAdmin.token,
      authenticatedClient.user.username,
    );
    expect(verifyResponse.status()).toBe(404);
  });

  test('should return unauthorized without token - 401', async ({
    request,
    authenticatedClient,
    authenticatedAdmin,
  }) => {
    const response = await deleteUserByUsernameWithoutAuth(
      request,
      authenticatedClient.user.username,
    );

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');

    const cleanupResponse = await deleteUserByUsername(
      request,
      authenticatedAdmin.token,
      authenticatedClient.user.username,
    );
    expect(cleanupResponse.status()).toBe(204);
  });

  test('should return forbidden for client role - 403', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    const response = await deleteUserByUsername(
      request,
      authenticatedClient.token,
      authenticatedAdmin.user.username,
    );

    expect(response.status()).toBe(403);
  });

  test('should return not found for missing user - 404', async ({ request, authenticatedAdmin }) => {
    const response = await deleteUserByUsername(
      request,
      authenticatedAdmin.token,
      `missing-${Date.now()}`,
    );

    expect(response.status()).toBe(404);
  });
});

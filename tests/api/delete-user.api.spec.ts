import { test, expect } from '../../fixtures/apiAuthFixture';
import { deleteUser } from '../../http/deleteUserClient';
import { generateRandomUserWithRole } from '../../generators/userGenerator';
import { attemptRegistration } from '../../http/registerClient';

test.describe('/users/{username} DELETE API tests', () => {
  test('should delete existing user - 204', async ({ request, authenticatedAdmin }) => {
    // given
    const userToDelete = generateRandomUserWithRole('ROLE_CLIENT');
    const registrationResponse = await attemptRegistration(request, userToDelete);
    expect(registrationResponse.status()).toBe(201);

    // when
    const response = await deleteUser(request, userToDelete.username, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const username = 'anyuser';

    // when
    const response = await deleteUser(request, username);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return forbidden error when user lacks permissions - 403', async ({ request, authenticatedClient }) => {
    // given
    const username = 'admin';

    // when
    const response = await deleteUser(request, username, authenticatedClient.token);

    // then
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Access denied');
  });

  test('should return not found when user does not exist - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const username = `non-existing-user-${Date.now()}`;

    // when
    const response = await deleteUser(request, username, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("The user doesn't exist");
  });
});

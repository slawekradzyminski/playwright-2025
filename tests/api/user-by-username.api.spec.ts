import { test, expect } from '../../fixtures/apiAuthFixture';
import type { UserResponseDto } from '../../types/user';
import { getUserByUsername } from '../../http/userByUsernameClient';

test.describe('/users/{username} API tests', () => {
  test('should return user details when username exists - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const targetUsername = authenticatedAdmin.userData.username;

    // when
    const response = await getUserByUsername(request, targetUsername, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(targetUsername);
    expect(responseBody.email).toBe(authenticatedAdmin.userData.email);
    expect(responseBody.firstName).toBe(authenticatedAdmin.userData.firstName);
    expect(responseBody.lastName).toBe(authenticatedAdmin.userData.lastName);
    expect(responseBody.roles).toEqual([authenticatedAdmin.userData.roles[0]]);
  });

  test('should return not found when username does not exist - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const nonExistingUsername = `non-existing-user-${Date.now()}`;

    // when
    const response = await getUserByUsername(request, nonExistingUsername, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("The user doesn't exist");
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const username = 'admin';

    // when
    const response = await getUserByUsername(request, username);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized error when token is invalid - 401', async ({ request }) => {
    // given
    const username = 'admin';
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await getUserByUsername(request, username, invalidToken);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

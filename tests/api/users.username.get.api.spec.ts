import { UsersClient } from '../../httpclients/usersClient';
import type { UserResponseDto } from '../../types/auth';
import { expect, test } from '../../fixtures/authenticatedUserFixture';
import { expectValidUserResponse } from '../../helpers/userHelpers';

test.describe('GET /api/v1/users/{username} API tests', () => {
  test('should return user by username - 200', async ({ request, authenticatedUser }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getUserByUsername(
      authenticatedUser.userData.username,
      authenticatedUser.token
    );

    // then
    expect(response.status()).toBe(200);

    const responseBody: UserResponseDto = await response.json();
    expectValidUserResponse(responseBody, authenticatedUser.userData);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getUserByUsername('admin');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getUserByUsername('admin', 'invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });

  test('should return not found when user does not exist - 404', async ({ request, authenticatedUser }) => {
    // given
    const usersClient = new UsersClient(request);
    const missingUsername = `missing-user-${Date.now()}`;

    // when
    const response = await usersClient.getUserByUsername(missingUsername, authenticatedUser.token);

    // then
    expect(response.status()).toBe(404);
  });
});

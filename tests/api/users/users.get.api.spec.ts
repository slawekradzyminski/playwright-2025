import { UsersClient } from '../../../httpclients/usersClient';
import type { UserResponseDto } from '../../../types/auth';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectValidUserResponse } from '../../../helpers/userHelpers';

test.describe('GET /api/v1/users API tests', () => {
  test('should return all users for authenticated user - 200', async ({ request, authenticatedUser }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getUsers(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: UserResponseDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);

    const currentUser = responseBody.find(user => user.username === authenticatedUser.userData.username);
    expect(currentUser).toBeDefined();
    expectValidUserResponse(currentUser!, authenticatedUser.userData);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getUsers();

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getUsers('invalid-token');

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

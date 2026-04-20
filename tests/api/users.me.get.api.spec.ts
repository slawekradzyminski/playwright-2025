import { UsersClient } from '../../httpclients/usersClient';
import type { UserResponseDto } from '../../types/auth';
import { expect, test } from '../../fixtures/authenticatedUserFixture';

test.describe('GET /api/v1/users/me API tests', () => {
  test('should return current user information - 200', async ({ request, authenticatedUser }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getMe(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.id).toEqual(expect.any(Number));
    expect(responseBody.username).toBe(authenticatedUser.userData.username);
    expect(responseBody.email).toBe(authenticatedUser.userData.email);
    expect(responseBody.firstName).toBe(authenticatedUser.userData.firstName);
    expect(responseBody.lastName).toBe(authenticatedUser.userData.lastName);
    expect(responseBody.roles).toEqual(['ROLE_CLIENT']);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getMe();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getMe('invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

import { UsersClient } from '../../../httpclients/usersClient';
import type { UserResponseDto } from '../../../types/auth';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectValidUserResponse } from '../../../helpers/userHelpers';

test.describe('GET /api/v1/users/me API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return current user information - 200', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await usersClient.getMe(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: UserResponseDto = await response.json();
    expectValidUserResponse(responseBody, authenticatedUser.userData);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getMe();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getMe('invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

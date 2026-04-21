import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { expectValidUserResponse } from '../../../helpers/userHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';
import type { UserResponseDto } from '../../../types/auth';

test.describe('GET /api/v1/users/{username} API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return user by username - 200', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await usersClient.getUserByUsername(authenticatedUser.userData.username, authenticatedUser.token);

    // then
    const responseBody = await expectJsonResponse<UserResponseDto>(response, 200);
    expectValidUserResponse(responseBody, authenticatedUser.userData);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getUserByUsername('admin');

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getUserByUsername('admin', INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });

  test('should return not found when user does not exist - 404', async ({ authenticatedUser }) => {
    // given
    const missingUsername = `missing-user-${Date.now()}`;

    // when
    const response = await usersClient.getUserByUsername(missingUsername, authenticatedUser.token);

    // then
    expect(response.status()).toBe(404);
  });
});

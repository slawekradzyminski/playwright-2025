import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { expectValidUserResponse } from '../../../helpers/userHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';
import type { UserResponseDto } from '../../../types/auth';

test.describe('GET /api/v1/users API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return all users for authenticated user - 200', async ({ authenticatedApiUser }) => {
    // given

    // when
    const response = await usersClient.getUsers(authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<UserResponseDto[]>(response, 200);
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);

    const currentUser = responseBody.find((user) => user.username === authenticatedApiUser.userData.username);
    if (currentUser === undefined) {
      throw new Error(`Current user ${authenticatedApiUser.userData.username} was not found in users response`);
    }

    expectValidUserResponse(currentUser, authenticatedApiUser.userData);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getUsers();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getUsers(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

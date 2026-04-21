import { test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { expectValidUserResponse } from '../../../helpers/userHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';
import type { UserResponseDto } from '../../../types/auth';

test.describe('GET /api/v1/users/me API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return current user information - 200', async ({ authenticatedApiUser }) => {
    // given

    // when
    const response = await usersClient.getMe(authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<UserResponseDto>(response, 200);
    expectValidUserResponse(responseBody, authenticatedApiUser.userData);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getMe();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getMe(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

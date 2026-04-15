import { test, expect } from '../../fixtures/apiAuthFixture';
import { APIResponse } from '@playwright/test';
import { usersMeClient } from '../../httpclients/usersMeClient';
import { RegisterDto } from '../../types/auth';
import { API_TEST_DETAILS } from '../../config/testDetails';

test.describe('/api/v1/users/me API tests', API_TEST_DETAILS, () => {
  test('should successfully get current user info - 200', async ({ request, auth }) => {
    // given
    const { user, token } = auth;

    // when
    const response = await usersMeClient.getUserMe(request, token);

    // then
    expect(response.status()).toBe(200);
    assertUserMeResponse(response, user);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await usersMeClient.getUserMe(request);

    // then
    expect(response.status()).toBe(401);
  });

    test('should return unauthorized error if fake token provided - 401', async ({ request }) => {
    // when
    const response = await usersMeClient.getUserMe(request, 'fakeToken');

    // then
    expect(response.status()).toBe(401);
  });

}); 

const assertUserMeResponse = async (response: APIResponse, user: RegisterDto) => {
    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: ['ROLE_CLIENT'],
      id: expect.any(Number)
    });
}

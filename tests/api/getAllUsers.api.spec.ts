import { test, expect } from '../../fixtures/apiAuth';
import { attemptGetAllUsers } from '../../http/getAllUsersClient';

test.describe('/users API tests', () => {
  test('should return list of users for admin - 200', async ({ apiAuthAdmin }) => {
    // given
    const { request, token } = apiAuthAdmin;

    // when
    const response = await attemptGetAllUsers(request, token);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    expect(Array.isArray(responseBody)).toBe(true);
  });

  test('should return 401 for missing token - 401', async ({ request }) => {
    // given
    // no token provided

    // when
    const response = await attemptGetAllUsers(request);

    // then
    expect(response.status()).toBe(401);
  });

});

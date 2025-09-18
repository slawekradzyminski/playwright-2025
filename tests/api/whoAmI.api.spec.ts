import { test, expect } from '../../fixtures/apiAuth';
import { attemptWhoAmI } from '../../http/whoAmIClient';

test.describe('/users/me API tests', () => {
  test('should return current user details - 200', async ({ apiAuth }) => {
    // given
    const { request, user, token } = apiAuth;

    // when
    const response = await attemptWhoAmI(request, token);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    expect(responseBody.username).toBe(user.username);
    expect(responseBody.email).toBe(user.email);
    expect(responseBody.firstName).toBe(user.firstName);
    expect(responseBody.lastName).toBe(user.lastName);
  });

  test('should return 401 for missing token - 401', async ({ request }) => {
    // given
    // no token provided

    // when
    const response = await attemptWhoAmI(request);

    // then
    expect(response.status()).toBe(401);
  });
});


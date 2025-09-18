import { test, expect } from '../../fixtures/apiAuth';
import { attemptTokenRefresh } from '../../http/tokenRefreshClient';

test.describe('/users/refresh API tests', () => {
  test('should successfully refresh token - 200', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;

    // when
    const response = await attemptTokenRefresh(request, token);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    expect(responseBody).toBeDefined();
    expect(responseBody).toMatch(/^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
  });

  test('should return 401 for invalid token - 401', async ({ request }) => {
    // given
    const token = 'invalid_token';

    // when
    const response = await attemptTokenRefresh(request, token);

    // then
    expect(response.status()).toBe(401);
  });
});
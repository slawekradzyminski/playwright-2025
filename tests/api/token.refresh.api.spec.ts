import { test, expect } from '@playwright/test';
import { attemptTokenRefresh } from '../../http/tokenRefreshClient';
import { randomClient } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/signupClient';
import { attemptLogin } from '../../http/loginClient';

test.describe('/users/refresh API tests', () => {
  test('should successfully refresh token - 200', async ({ request }) => {
    // given
    const user = randomClient();
    await attemptSignup(request, user);
    const loginResponse = await attemptLogin(request, user);
    const token = (await loginResponse.json()).token;

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
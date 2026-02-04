import { expect, test } from '@playwright/test';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../config/constants';
import { attemptLogin } from '../../../http/loginClient';
import { attemptRefreshToken } from '../../../http/refreshClient';

test.describe('/users/refresh API tests', () => {
  test('should refresh access token with valid refresh token - 200', async ({ request }) => {
    // given
    const loginResponse = await attemptLogin(request, {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD
    });
    expect(loginResponse.status()).toBe(200);
    const loginResponseBody = await loginResponse.json();

    // when
    const response = await attemptRefreshToken(request, {
      refreshToken: loginResponseBody.refreshToken
    });

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(responseBody.refreshToken).toBeDefined();
    expect(typeof responseBody.refreshToken).toBe('string');
  });

  test('should return error for invalid refresh token - 401', async ({ request }) => {
    // given
    const refreshPayload = {
      refreshToken: 'invalid-token'
    };

    // when
    const response = await attemptRefreshToken(request, refreshPayload);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      message: 'Invalid refresh token'
    });
  });
});

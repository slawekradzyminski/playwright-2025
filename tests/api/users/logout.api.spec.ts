import { test, expect } from '@playwright/test';
import { LogoutClient } from '../../../httpclients/logoutClient';
import { RefreshClient } from '../../../httpclients/refreshClient';
import { registerAndLogin } from '../helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('/api/v1/users/logout API tests', () => {
  let logoutClient: LogoutClient;
  let refreshClient: RefreshClient;

  test.beforeEach(async ({ request }) => {
    logoutClient = new LogoutClient(request, APP_BASE_URL);
    refreshClient = new RefreshClient(request, APP_BASE_URL);
  });

  test('should logout authenticated user and revoke refresh token - 200', async ({ request }) => {
    // given
    const { token, refreshToken } = await registerAndLogin(request);

    // when
    const logoutResponse = await logoutClient.logout(token);
    const refreshResponse = await refreshClient.refresh({ refreshToken });

    // then
    expect(logoutResponse.status()).toBe(200);
    expect(await logoutResponse.text()).toBe('');
    expect(refreshResponse.status()).toBe(401);
    const responseBody = await refreshResponse.json();
    expect(responseBody.message).toBe('Invalid refresh token');
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await logoutClient.logout();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

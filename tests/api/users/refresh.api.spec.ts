import { test, expect, APIResponse } from '@playwright/test';
import { RefreshClient } from '../../../httpclients/refreshClient';
import type { TokenRefreshResponseDto } from '../../../types/auth';
import { registerAndLogin } from '../helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('/api/v1/users/refresh API tests', () => {
  let client: RefreshClient;

  test.beforeEach(async ({ request }) => {
    client = new RefreshClient(request, APP_BASE_URL);
  });

  test('should rotate tokens for valid refresh token - 200', async ({ request }) => {
    // given
    const { refreshToken } = await registerAndLogin(request);

    // when
    const response = await client.refresh({ refreshToken });

    // then
    expect(response.status()).toBe(200);
    await assertRefreshResponseBody(response, refreshToken);
  });

  test('should return unauthorized for invalid refresh token - 401', async () => {
    // when
    const response = await client.refresh({ refreshToken: 'not-a-real-refresh-token' });

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid refresh token');
  });

  test('should return unauthorized for already rotated refresh token - 401', async ({ request }) => {
    // given
    const { refreshToken } = await registerAndLogin(request);
    const rotateResponse = await client.refresh({ refreshToken });
    expect(rotateResponse.status()).toBe(200);

    // when
    const response = await client.refresh({ refreshToken });

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid refresh token');
  });
});

const assertRefreshResponseBody = async (response: APIResponse, previousRefreshToken: string) => {
  const responseBody: TokenRefreshResponseDto = await response.json();
  expect(responseBody.token).toBeDefined();
  expect(responseBody.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
  expect(responseBody.refreshToken).toBeDefined();
  expect(responseBody.refreshToken).toMatch(/^[0-9a-f-]{36}$/);
  expect(responseBody.refreshToken).not.toBe(previousRefreshToken);
};

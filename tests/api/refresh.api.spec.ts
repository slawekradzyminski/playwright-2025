import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { TokenRefreshResponseDto } from '../../types/auth';
import { refreshRequest } from './http/refreshRequest';

test.describe('/users/refresh API tests', () => {
  test('should refresh JWT token using valid refresh token - 200', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await refreshRequest(request, {
      refreshToken: clientAuth.refreshToken,
    });

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as TokenRefreshResponseDto;
    expect(responseBody.token).toBeTruthy();
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody.refreshToken).toBeTruthy();
    expect(typeof responseBody.refreshToken).toBe('string');
  });

  test('should return unauthorized for invalid refresh token - 401', async ({ request }) => {
    // when
    const response = await refreshRequest(request, {
      refreshToken: 'invalid-refresh-token',
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

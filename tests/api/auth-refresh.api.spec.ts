import { refreshToken, refreshTokenWithoutToken } from '../../http/authRefreshClient';
import { test, expect } from '../../fixtures/auth.fixtures';

test.describe('/users/refresh API tests', () => {
  test('should successfully refresh JWT token with valid token - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const originalToken = authenticatedAdmin.token;

    // when
    const response = await refreshToken(request, originalToken);

    // then
    expect(response.status()).toBe(200);
    
    const newToken = await response.text();
    expect(newToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(newToken).toBe(originalToken);
  });

  test('should return unauthorized error for missing token - 401', async ({ request }) => {
    // given - no token provided

    // when
    const response = await refreshTokenWithoutToken(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error for invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await refreshToken(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error for expired token - 401', async ({ request }) => {
    // given
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjF9.invalid';

    // when
    const response = await refreshToken(request, expiredToken);

    // then
    expect(response.status()).toBe(401);
  });
});

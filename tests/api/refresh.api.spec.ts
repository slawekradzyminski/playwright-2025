import { test, expect } from '../../fixtures/apiAuthFixture';
import { refreshToken } from '../../http/refreshClient';

const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test.describe('/users/refresh API tests', () => {
  test('should return new token when provided valid JWT - 200', async ({ request, authenticatedClient }) => {
    // when
    const response = await refreshToken(request, authenticatedClient.token);

    // then
    expect(response.status()).toBe(200);
    const refreshedToken = await response.text();
    expect(refreshedToken).toMatch(jwtPattern);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await refreshToken(request);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized error when token is invalid - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await refreshToken(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

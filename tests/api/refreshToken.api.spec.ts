import { test, expect } from '../../fixtures/apiAuthFixture';
import { refreshToken, refreshTokenWithoutAuth } from '../../http/userEndpointsRequest';

test.describe('GET /users/refresh API tests', () => {
  test('should successfully refresh JWT token with valid token - 200', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;

    // when
    const response = await refreshToken(request, token);
    
    // then
    expect(response.status()).toBe(200);
    const refreshedToken = await response.text();
    expect(refreshedToken).toBeDefined();
    expect(refreshedToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given / when
    const response = await refreshTokenWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.here';

    // when
    const response = await refreshToken(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });
});


import { test, expect } from '../../fixtures/apiAuthFixture';
import { refreshAuthToken } from '../../http/getUsersRefreshRequest';
import { INVALID_TOKEN } from '../../config/constants';

const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

test.describe('GET /users/refresh API tests', () => {
  test('client should receive refreshed token - 200', async ({ request, clientAuth }) => {
    // given
    const currentToken = clientAuth.token;

    // when
    const response = await refreshAuthToken(request, currentToken);

    // then
    expect(response.status()).toBe(200);
    const newToken = (await response.text()).trim();
    expect(newToken).toMatch(JWT_REGEX);
  });

  test('admin should receive refreshed token - 200', async ({ request, adminAuth }) => {
    // when
    const response = await refreshAuthToken(request, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    const newToken = (await response.text()).trim();
    expect(newToken).toMatch(JWT_REGEX);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await refreshAuthToken(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await refreshAuthToken(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});

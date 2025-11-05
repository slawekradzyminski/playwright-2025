import { test, expect } from '../../fixtures/authFixtures';
import { refreshToken, refreshTokenWithoutAuth } from '../../../http/users/usersRefreshClient';
import { getCurrentUserProfile } from '../../../http/users/usersMeClient';

test.describe('/users/refresh GET', () => {
  test('should refresh token for admin user - 200', async ({ request, authenticatedAdmin }) => {
    const response = await refreshToken(request, authenticatedAdmin.token);

    expect(response.status()).toBe(200);
    const newToken = (await response.text()).trim();
    expect(newToken.length).toBeGreaterThan(0);
    expect(newToken.split('.').length).toBeGreaterThanOrEqual(3);

    const verifyResponse = await getCurrentUserProfile(request, newToken);
    expect(verifyResponse.status()).toBe(200);
  });

  test('should refresh token for client user - 200', async ({ request, authenticatedClient }) => {
    const response = await refreshToken(request, authenticatedClient.token);

    expect(response.status()).toBe(200);
    const newToken = (await response.text()).trim();
    expect(newToken.length).toBeGreaterThan(0);
    expect(newToken.split('.').length).toBeGreaterThanOrEqual(3);

    const verifyResponse = await getCurrentUserProfile(request, newToken);
    expect(verifyResponse.status()).toBe(200);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    const response = await refreshTokenWithoutAuth(request);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

import { test, expect } from '../../fixtures/apiAuthFixture';
import type { UserResponseDto } from '../../types/user';
import { getCurrentUser } from '../../http/meClient';

test.describe('/users/me API tests', () => {
  test('should return current user details when provided valid JWT - 200', async ({ request, authenticatedClient }) => {
    // when
    const response = await getCurrentUser(request, authenticatedClient.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(authenticatedClient.userData.username);
    expect(responseBody.email).toBe(authenticatedClient.userData.email);
    expect(responseBody.firstName).toBe(authenticatedClient.userData.firstName);
    expect(responseBody.lastName).toBe(authenticatedClient.userData.lastName);
    expect(responseBody.roles).toEqual([authenticatedClient.userData.roles[0]]);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await getCurrentUser(request);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized error when token is invalid - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await getCurrentUser(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

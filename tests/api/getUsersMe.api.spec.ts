import { test, expect } from '../../fixtures/apiAuthFixture';
import { getCurrentUser } from '../../http/getUsersMeRequest';
import type { UserResponseDto } from '../../types/auth';
import { INVALID_TOKEN } from '../../config/constants';

test.describe('GET /users/me API tests', () => {
  test('client should retrieve own profile - 200', async ({ request, clientAuth }) => {
    // given
    const expectedUser = clientAuth.userData;

    // when
    const response = await getCurrentUser(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(expectedUser.username);
    expect(responseBody.email).toBe(expectedUser.email);
    expect(responseBody.firstName).toBe(expectedUser.firstName);
    expect(responseBody.lastName).toBe(expectedUser.lastName);
    expect(responseBody.roles).toHaveLength(1);
    expect(responseBody.roles).toContain('ROLE_CLIENT');
  });

  test('admin should retrieve own profile - 200', async ({ request, adminAuth }) => {
    // given
    const expectedUser = adminAuth.userData;

    // when
    const response = await getCurrentUser(request, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(expectedUser.username);
    expect(responseBody.roles).toContain('ROLE_ADMIN');
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await getCurrentUser(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await getCurrentUser(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});

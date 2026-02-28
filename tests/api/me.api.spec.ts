import { test, expect } from '../fixtures/auth.fixture';
import type { UserResponseDto } from '../../types/auth';
import { meRequest } from './http/meRequest';

test.describe('/users/me API tests', () => {
  test('should return current user details for authenticated user - 200', async ({
    request,
    authenticatedUser,
  }) => {
    // when
    const { userDetails, jwtToken } = authenticatedUser
    const response = await meRequest(request, jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody: UserResponseDto = await response.json();
    expect(typeof responseBody.id).toBe('number');
    expect(responseBody.id).toBeGreaterThan(0);
    expect(responseBody.username).toBe(userDetails.username);
    expect(responseBody.email).toBe(userDetails.email);
    expect(responseBody.firstName).toBe(userDetails.firstName);
    expect(responseBody.lastName).toBe(userDetails.lastName);
    expect(responseBody.roles).toEqual(userDetails.roles);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/users/me');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // when
    const response = await meRequest(request, 'invalid.token.value');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

import { test, expect } from '../../fixtures/apiAuthFixture';
import type { UserResponseDto } from '../../types/user';
import { getUsers } from '../../http/usersClient';

test.describe('/users API tests', () => {
  test('should successfully get users with valid JWT token - 200', async ({ request, authenticatedUser }) => {
    // when
    const response = await getUsers(request, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given

    // when
    const response = await getUsers(request);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await getUsers(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});


import { test, expect } from '../../fixtures/auth.fixtures';
import type { UserResponseDto } from '../../types/users';
import { getUserByUsername } from '../../http/getUserByUsername';
import { API_BASE_URL } from '../../constants/config';
import { validateSingleUser } from '../../validators/userValidator';

test.describe('/users/{username} API tests', () => {
  test('should successfully get user by username - 200', async ({ request, authToken, user }) => {
    // given
    const username = user.username;

    // when
    const response = await getUserByUsername(request, authToken, username);

    // then
    expect(response.status()).toBe(200);
    const userData: UserResponseDto = await response.json();
    validateSingleUser(userData);
    expect(userData.username).toBe(username);
  });

  test('should return 401 for invalid token - 401', async ({ request, user }) => {
    // given
    const invalidToken = 'invalid.jwt.token';
    const username = user.username;

    // when
    const response = await getUserByUsername(request, invalidToken, username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 401 for missing token - 401', async ({ request, user }) => {
    // given
    const username = user.username;

    // when
    const response = await request.get(`${API_BASE_URL}/users/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 404 for non-existent user - 404', async ({ request, authToken }) => {
    // given
    const nonExistentUsername = 'nonexistentuser12345';

    // when
    const response = await getUserByUsername(request, authToken, nonExistentUsername);

    // then
    expect(response.status()).toBe(404);
  });
}); 
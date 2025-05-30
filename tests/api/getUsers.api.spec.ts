import { test, expect } from '../../fixtures/auth.fixtures';
import type { UserResponseDto } from '../../types/users';
import { getUsers } from '../../http/getUsers';
import { API_BASE_URL } from '../../constants/config';
import { validateUsersArray } from '../../validators/userValidator';

test.describe('/users API tests', () => {
  test('should successfully get all users - 200', async ({ request, authToken }) => {
    // when
    const response = await getUsers(request, authToken);

    // then
    expect(response.status()).toBe(200);
    const users: UserResponseDto[] = await response.json();
    validateUsersArray(users);
  });

  test('should return 401 for invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.jwt.token';

    // when
    const response = await getUsers(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return 401 for missing token - 401', async ({ request }) => {
    // when
    const response = await request.get(`${API_BASE_URL}/users`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });
}); 
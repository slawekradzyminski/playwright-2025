import { getUsers } from '../../http/usersClient';
import { API_BASE_URL } from '../../config/constants';
import type { UserResponseDto } from '../../types/auth';
import { test, expect } from '../fixtures/auth.fixture';

test.describe('/users API tests', () => {
  test('should return all users for authenticated request - 200', async ({ request, authenticatedUser }) => {
    // given
    const { jwtToken, user } = authenticatedUser;

    // when
    const response = await getUsers(request, jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    const createdUser = responseBody.find((entry) => entry.username === user.username);
    expect(createdUser).toBeDefined();
    expect(createdUser).toEqual(
      expect.objectContaining({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: expect.arrayContaining(user.roles)
      })
    );
  });

  test('should return unauthorized for request without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users`);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      message: 'Unauthorized'
    });
  });
});

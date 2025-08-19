import { getUsers, getUsersWithoutToken } from '../../http/usersClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { UserResponseDto } from '../../types/user';

test.describe('/users API tests', () => {
  test('should successfully get all users with valid token - 200', async ({ request, authenticatedUser }) => {
    // given
    const token = authenticatedUser.token;

    // when
    const response = await getUsers(request, token);

    // then
    expect(response.status()).toBe(200);
    
    const users: UserResponseDto[] = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // Verify structure of first user
    const firstUser = users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('username');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('roles');
    expect(Array.isArray(firstUser.roles)).toBe(true);
  });

  test('should return unauthorized error for missing token - 401', async ({ request }) => {
    // given - no token provided

    // when
    const response = await getUsersWithoutToken(request);

    // then
    expect(response.status()).toBe(401);
  });
});

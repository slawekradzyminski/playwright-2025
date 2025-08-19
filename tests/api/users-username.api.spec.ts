import { getUserByUsername, getUserByUsernameWithoutToken } from '../../http/usersClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { UserResponseDto } from '../../types/user';

test.describe('/users/{username} API tests', () => {
  test('should successfully get user by username with valid token - 200', async ({ request, authenticatedUser }) => {
    // given
    const token = authenticatedUser.token;
    const username = authenticatedUser.user.username;

    // when
    const response = await getUserByUsername(request, token, username);

    // then
    expect(response.status()).toBe(200);
    
    const user: UserResponseDto = await response.json();
    expect(user.username).toBe(username);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('roles');
    expect(Array.isArray(user.roles)).toBe(true);
  });

  test('should return unauthorized error for missing token - 401', async ({ request, authenticatedUser }) => {
    // given
    const username = authenticatedUser.user.username;

    // when
    const response = await getUserByUsernameWithoutToken(request, username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found error for non-existent user - 404', async ({ request, authenticatedUser }) => {
    // given
    const token = authenticatedUser.token;
    const nonExistentUsername = 'nonexistentuser123456';

    // when
    const response = await getUserByUsername(request, token, nonExistentUsername);

    // then
    expect(response.status()).toBe(404);
  });
});

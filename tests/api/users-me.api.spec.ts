import { getCurrentUser, getCurrentUserWithoutToken } from '../../http/usersClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { UserResponseDto } from '../../types/user';

test.describe('/users/me API tests', () => {
  test('should successfully get current user details with valid token - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const token = authenticatedAdmin.token;
    const expectedUsername = authenticatedAdmin.user.username;

    // when
    const response = await getCurrentUser(request, token);

    // then
    expect(response.status()).toBe(200);
    
    const user: UserResponseDto = await response.json();
    expect(user.username).toBe(expectedUsername);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('roles');
    expect(Array.isArray(user.roles)).toBe(true);
  });

  test('should return unauthorized error for missing token - 401', async ({ request }) => {
    // given - no token provided

    // when
    const response = await getCurrentUserWithoutToken(request);

    // then
    expect(response.status()).toBe(401);
  });
});

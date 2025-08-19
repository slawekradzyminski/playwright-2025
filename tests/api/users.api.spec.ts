import { getUsers, getUsersWithoutToken, getCurrentUser, getCurrentUserWithoutToken, getUserByUsername, getUserByUsernameWithoutToken } from '../../http/usersClient';
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

test.describe('/users/me API tests', () => {
  test('should successfully get current user details with valid token - 200', async ({ request, authenticatedUser }) => {
    // given
    const token = authenticatedUser.token;
    const expectedUsername = authenticatedUser.user.username;

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

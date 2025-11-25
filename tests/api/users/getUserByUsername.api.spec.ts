import { test, expect } from '../../../fixtures/apiAuthFixture';
import { getUserByUsername } from '../../../http/users/getUserByUsernameRequest';
import { attemptSignup } from '../../../http/users/signupRequest';
import { generateClientUser } from '../../../generators/userGenerator';
import type { UserRegisterDto, UserResponseDto } from '../../../types/auth';

test.describe('GET /users/{username} API tests', () => {
  test('client should retrieve own profile by username - 200', async ({ request, clientAuth }) => {
    // given
    const username = clientAuth.userData.username;

    // when
    const response = await getUserByUsername(request, username, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(username);
  });

  test('admin should retrieve any user by username - 200', async ({ request, adminAuth }) => {
    // given
    const targetUser: UserRegisterDto = generateClientUser();
    const signupResponse = await attemptSignup(request, targetUser);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await getUserByUsername(request, targetUser.username, adminAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(targetUser.username);
    expect(responseBody.email).toBe(targetUser.email);
  });

  test('should return unauthorized for missing token - 401', async ({ request, clientAuth }) => {
    // when
    const response = await getUserByUsername(request, clientAuth.userData.username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request, clientAuth }) => {
    // when
    const response = await getUserByUsername(request, clientAuth.userData.username, 'invalid.token.value');

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found for missing user - 404', async ({ request, adminAuth }) => {
    // when
    const response = await getUserByUsername(request, 'unknown-user-123', adminAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

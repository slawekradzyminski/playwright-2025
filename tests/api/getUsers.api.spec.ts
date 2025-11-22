import { test, expect } from '@playwright/test';
import type { LoginDto, UserRegisterDto, UserResponseDto } from '../../types/auth';
import { attemptLogin } from '../../http/loginRequest';
import { getUsers, getUsersWithoutAuth } from '../../http/getUsersRequest';
import { attemptSignup } from '../../http/signupRequest';
import { generateRandomClientUser } from '../../generators/userGenerator';

test.describe('GET /users API tests', () => {
  test('should successfully retrieve users with valid token - 200', async ({ request }) => {
    // given
    const userData = generateRandomClientUser();
    await attemptSignup(request, userData);
    const loginData: LoginDto = {
      username: userData.username,
      password: userData.password
    };
    const loginResponse = await attemptLogin(request, loginData);
    const { token } = await loginResponse.json();

    // when
    const response = await getUsers(request, token);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
    responseBody.forEach(validateUserResponse);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given / when
    const response = await getUsersWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.here';

    // when
    const response = await getUsers(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });
});

const validateUserResponse = (user: UserResponseDto) => {
  expect(user.id).toBeDefined();
  expect(user.username).toBeDefined();
  expect(user.email).toBeDefined();
  expect(user.roles).toBeDefined();
  expect(Array.isArray(user.roles)).toBe(true);
  expect(user.firstName).toBeDefined();
  expect(user.lastName).toBeDefined();
};  
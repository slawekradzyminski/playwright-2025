import { test, expect } from '../../fixtures/apiAuthFixture';
import type { UserRegisterDto, UserResponseDto } from '../../types/auth';
import { getMe, getMeWithoutAuth } from '../../http/getMeRequest';
import { APIResponse } from '@playwright/test';

test.describe('GET /users/me API tests', () => {
  test('should successfully get current user information with valid token - 200', async ({ request, authenticatedClientUser }) => {
    // given
    const { token, userData } = authenticatedClientUser;

    // when
    const response = await getMe(request, token);
    
    // then
    expect(response.status()).toBe(200);
    await validateResponse(response, userData);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given / when
    const response = await getMeWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.here';

    // when
    const response = await getMe(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });
});

const validateResponse = async (response: APIResponse, userData: UserRegisterDto) => {
  const responseBody: UserResponseDto = await response.json();
  expect(responseBody.id).toBeDefined();
  expect(responseBody.username).toBe(userData.username);
  expect(responseBody.email).toBe(userData.email);
  expect(responseBody.firstName).toBe(userData.firstName);
  expect(responseBody.lastName).toBe(userData.lastName);
  expect(responseBody.roles).toBeDefined();
  expect(Array.isArray(responseBody.roles)).toBe(true);
  expect(responseBody.roles).toContain('ROLE_CLIENT');
};
import type { APIResponse } from '@playwright/test';
import { test, expect } from './fixtures/authFixture';
import { UserClient } from '../../httpclients/userClient';
import type { SignupDto, UserResponseDto } from '../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('/api/v1/users/me API tests', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should return current user for valid JWT token - 200', async ({ authenticatedUser }) => {
    // given
    const { token, user } = authenticatedUser;

    // when
    const response = await client.getMe(token);

    // then
    expect(response.status()).toBe(200);
    await assertCurrentUserResponse(response, user);
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.getMe();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

const assertCurrentUserResponse = async (response: APIResponse, user: CurrentUserInput) => {
  const responseBody: UserResponseDto = await response.json();
  expect(responseBody.id).toBeDefined();
  expect(responseBody.username).toBe(user.username);
  expect(responseBody.email).toBe(user.email);
  expect(responseBody.firstName).toBe(user.firstName);
  expect(responseBody.lastName).toBe(user.lastName);
  expect(responseBody.roles).toBeDefined();
  expect(Array.isArray(responseBody.roles)).toBe(true);
  expect(responseBody.roles).toContain('ROLE_CLIENT');
};

type CurrentUserInput = Pick<SignupDto, 'username' | 'email' | 'firstName' | 'lastName'>;

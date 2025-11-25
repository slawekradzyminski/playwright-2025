import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { UserResponseDto } from '../../../types/auth';
import { APIResponse } from '@playwright/test';
import { getUsers } from '../../../http/users/usersRequest';
import { INVALID_TOKEN } from '../../../config/constants';

test.describe('/users GET API tests', () => {
  test('should successfully get users with valid token - 200', async ({ request, clientAuth }) => {
    // when
    const response = await getUsers(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    await validateUsersResponse(response);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await getUsers(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await getUsers(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});

const validateUsersResponse = async (response: APIResponse) => {
  const responseBody: UserResponseDto[] = await response.json();
  
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
  
  const user = responseBody[0];
  expect(typeof user.id).toBe('number');
  expect(typeof user.username).toBe('string');
  expect(typeof user.email).toBe('string');
  expect(typeof user.firstName).toBe('string');
  expect(typeof user.lastName).toBe('string');
  expect(Array.isArray(user.roles)).toBe(true);
  expect(user.roles.length).toBeGreaterThan(0);
};


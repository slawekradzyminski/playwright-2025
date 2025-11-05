import { test, expect } from '../../fixtures/apiAuthFixtures';
import { APIResponse } from '@playwright/test';
import { getUsers, getUsersWithoutAuth } from '../../http/usersClient';
import type { UserResponseDto } from '../../types/auth';

test.describe('/users API tests', () => {
  test('should successfully retrieve all users with valid token - 200', async ({ request, authenticatedAdmin }) => {
    // when
    const response = await getUsers(request, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(200);
    await assertUsersResponseBody(response);
  });

  test('should return unauthorized error without token - 401', async ({ request }) => {
    // when
    const response = await getUsersWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

const assertUsersResponseBody = async (response: APIResponse) => {
  const responseBody: UserResponseDto[] = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
  responseBody.forEach(user => {
    expect(user.id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.roles).toBeDefined();
    expect(Array.isArray(user.roles)).toBe(true);
    expect(user.firstName).toBeDefined();
    expect(user.lastName).toBeDefined();
  });
};
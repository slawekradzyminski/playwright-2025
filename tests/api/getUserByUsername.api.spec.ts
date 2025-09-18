import { test, expect } from '../../fixtures/apiAuth';
import { getUserByUsername } from '../../http/getUserByUsernameClient';
import type { UserResponseDto } from '../../types/auth';
import { APIResponse } from '@playwright/test';

test.describe('/users/{username} GET API tests', () => {
  test('should return user details for existing username - 200', async ({ apiAuth, apiAuthAdmin }) => {
    // given
    const existingUsername = apiAuth.user.username;

    // when
    const response = await getUserByUsername(apiAuth.request, existingUsername, apiAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(existingUsername);
    expect(responseBody.email).toBe(apiAuth.user.email);
    expect(responseBody.firstName).toBe(apiAuth.user.firstName);
    expect(responseBody.lastName).toBe(apiAuth.user.lastName);
    expect(responseBody.roles).toEqual(apiAuth.user.roles);
    expect(typeof responseBody.id).toBe('number');
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // given
    const username = 'anyuser';

    // when
    const response = await request.get(`http://localhost:4001/users/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found for non-existent username - 404', async ({ apiAuth }) => {
    // given
    const nonExistentUsername = 'nonexistentuser99999';

    // when
    const response = await getUserByUsername(apiAuth.request, nonExistentUsername, apiAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

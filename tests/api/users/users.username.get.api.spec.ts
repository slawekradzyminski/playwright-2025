import { test, expect } from '../../fixtures/authFixtures';
import {
  getUserByUsername,
  getUserByUsernameWithoutAuth,
} from '../../../http/users/usersByUsernameGetClient';
import type { UserResponseDto } from '../../../types/auth';

test.describe('/users/{username} GET', () => {
  test('should retrieve user by username with valid token - 200', async ({ request, authenticatedAdmin }) => {
    const response = await getUserByUsername(
      request,
      authenticatedAdmin.token,
      authenticatedAdmin.user.username,
    );

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as UserResponseDto;
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBe(authenticatedAdmin.user.username);
    expect(responseBody.email).toBe(authenticatedAdmin.user.email);
    expect(responseBody.firstName).toBe(authenticatedAdmin.user.firstName);
    expect(responseBody.lastName).toBe(authenticatedAdmin.user.lastName);
    expect(responseBody.roles).toEqual(authenticatedAdmin.user.roles);
  });

  test('should return unauthorized without token - 401', async ({ request, authenticatedAdmin }) => {
    const response = await getUserByUsernameWithoutAuth(request, authenticatedAdmin.user.username);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return not found for non existing user - 404', async ({ request, authenticatedAdmin }) => {
    const unknownUsername = `non-existing-${Date.now()}`;

    const response = await getUserByUsername(request, authenticatedAdmin.token, unknownUsername);

    expect(response.status()).toBe(404);
  });
});

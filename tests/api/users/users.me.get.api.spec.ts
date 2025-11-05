import { test, expect } from '../../fixtures/authFixtures';
import {
  getCurrentUserProfile,
  getCurrentUserProfileWithoutAuth,
} from '../../../http/users/usersMeClient';
import type { UserResponseDto } from '../../../types/auth';

test.describe('/users/me GET', () => {
  test('should return current admin user profile - 200', async ({ request, authenticatedAdmin }) => {
    const response = await getCurrentUserProfile(request, authenticatedAdmin.token);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as UserResponseDto;
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBe(authenticatedAdmin.user.username);
    expect(responseBody.email).toBe(authenticatedAdmin.user.email);
    expect(responseBody.firstName).toBe(authenticatedAdmin.user.firstName);
    expect(responseBody.lastName).toBe(authenticatedAdmin.user.lastName);
    expect(responseBody.roles).toEqual(authenticatedAdmin.user.roles);
  });

  test('should return current client user profile - 200', async ({ request, authenticatedClient }) => {
    const response = await getCurrentUserProfile(request, authenticatedClient.token);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as UserResponseDto;
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBe(authenticatedClient.user.username);
    expect(responseBody.email).toBe(authenticatedClient.user.email);
    expect(responseBody.firstName).toBe(authenticatedClient.user.firstName);
    expect(responseBody.lastName).toBe(authenticatedClient.user.lastName);
    expect(responseBody.roles).toEqual(authenticatedClient.user.roles);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    const response = await getCurrentUserProfileWithoutAuth(request);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

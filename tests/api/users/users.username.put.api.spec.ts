import { test, expect } from '../../../fixtures/authFixtures';
import {
  updateUserByUsername,
  updateUserByUsernameWithoutAuth,
} from '../../../http/users/usersByUsernamePutClient';
import { getUserByUsername } from '../../../http/users/usersByUsernameGetClient';
import type { UserEditDto, UserEntity } from '../../../types/auth';

test.describe('/users/{username} PUT', () => {
  test('should update user by username with admin token - 200', async ({ request, authenticatedAdmin }) => {
    const payload: UserEditDto = {
      email: `updated-${Date.now()}@example.com`,
      firstName: 'UpdatedName',
      lastName: 'UpdatedUser',
    };

    const response = await updateUserByUsername(
      request,
      authenticatedAdmin.token,
      authenticatedAdmin.user.username,
      payload,
    );

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as UserEntity;
    expect(responseBody.username).toBe(authenticatedAdmin.user.username);
    expect(responseBody.email).toBe(payload.email);
    expect(responseBody.firstName).toBe(payload.firstName);
    expect(responseBody.lastName).toBe(payload.lastName);
    expect(responseBody.roles).toEqual(authenticatedAdmin.user.roles);

    const verifyResponse = await getUserByUsername(
      request,
      authenticatedAdmin.token,
      authenticatedAdmin.user.username,
    );
    const verifyBody = (await verifyResponse.json()) as UserEntity;
    expect(verifyBody.email).toBe(payload.email);
    expect(verifyBody.firstName).toBe(payload.firstName);
    expect(verifyBody.lastName).toBe(payload.lastName);
  });

  test('should return unauthorized without token - 401', async ({ request, authenticatedAdmin }) => {
    const payload: UserEditDto = {
      email: `unauthorized-${Date.now()}@example.com`,
    };

    const response = await updateUserByUsernameWithoutAuth(
      request,
      authenticatedAdmin.user.username,
      payload,
    );

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return forbidden for client role - 403', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    const payload: UserEditDto = {
      email: `forbidden-${Date.now()}@example.com`,
    };

    const response = await updateUserByUsername(
      request,
      authenticatedClient.token,
      authenticatedAdmin.user.username,
      payload,
    );

    expect(response.status()).toBe(403);
  });

  test('should return not found for missing user - 404', async ({ request, authenticatedAdmin }) => {
    const payload: UserEditDto = {
      email: `missing-${Date.now()}@example.com`,
    };

    const response = await updateUserByUsername(request, authenticatedAdmin.token, 'unknown-user', payload);

    expect(response.status()).toBe(404);
  });
});

import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import { createUser } from '../../../../generators/userGenerator';
import { attemptSignup } from '../../../../http/signupClient';
import { deleteUser, getUserByUsername, updateUser } from '../../../../http/userProfileClient';
import type { UserResponseDto } from '../../../../types/auth';
import { test } from '../../../fixtures/auth.fixture';

test.describe('/users/{username} API tests', () => {
  test('should return user by username for authenticated request - 200', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await getUserByUsername(request, authenticatedUser.jwtToken, 'client');

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe('client');
  });

  test('should return unauthorized for user by username request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users/client`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return not found for user that does not exist - 404', async ({ request, adminAuth }) => {
    // given
    // when
    const response = await getUserByUsername(request, adminAuth.jwtToken, 'unknown-user-987654');

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: "The user doesn't exist" });
  });

  test('should update own user profile - 200', async ({ request, authenticatedUser }) => {
    // given
    const payload = {
      email: authenticatedUser.user.email,
      firstName: 'UpdatedFirst',
      lastName: 'UpdatedLast'
    };

    // when
    const response = await updateUser(
      request,
      authenticatedUser.jwtToken,
      authenticatedUser.user.username,
      payload
    );

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.firstName).toBe(payload.firstName);
    expect(responseBody.lastName).toBe(payload.lastName);
  });

  test('should return unauthorized for update user request without token - 401', async ({ request }) => {
    // given
    const payload = {
      email: 'some@example.com',
      firstName: 'First',
      lastName: 'Last'
    };

    // when
    const response = await request.put(`${API_BASE_URL}/users/client`, {
      data: payload
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return forbidden for updating different user as client - 403', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const payload = {
      email: 'awesome@testing.com',
      firstName: 'Nope',
      lastName: 'Nope'
    };

    // when
    const response = await updateUser(request, authenticatedUser.jwtToken, 'admin', payload);

    // then
    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Access denied' });
  });

  test('should return not found for update user that does not exist - 404', async ({
    request,
    adminAuth
  }) => {
    // given
    const payload = {
      email: 'unknown@example.com',
      firstName: 'Unknown',
      lastName: 'Unknown'
    };

    // when
    const response = await updateUser(request, adminAuth.jwtToken, 'unknown-user-987654', payload);

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: "The user doesn't exist" });
  });

  test('should delete user as admin - 204', async ({ request, adminAuth }) => {
    // given
    const userToDelete = createUser({ roles: ['ROLE_CLIENT'] });
    const signupResponse = await attemptSignup(request, userToDelete);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await deleteUser(request, adminAuth.jwtToken, userToDelete.username);

    // then
    expect(response.status()).toBe(204);
    expect(await response.text()).toBe('');
  });

  test('should return unauthorized for delete user request without token - 401', async ({
    request,
    adminAuth
  }) => {
    // given
    const userToDelete = createUser({ roles: ['ROLE_CLIENT'] });
    const signupResponse = await attemptSignup(request, userToDelete);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await request.delete(`${API_BASE_URL}/users/${userToDelete.username}`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
    await deleteUser(request, adminAuth.jwtToken, userToDelete.username);
  });

  test('should return forbidden for delete user as client - 403', async ({
    request,
    adminAuth,
    authenticatedUser
  }) => {
    // given
    const userToDelete = createUser({ roles: ['ROLE_CLIENT'] });
    const signupResponse = await attemptSignup(request, userToDelete);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await deleteUser(request, authenticatedUser.jwtToken, userToDelete.username);

    // then
    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Access denied' });
    await deleteUser(request, adminAuth.jwtToken, userToDelete.username);
  });

  test('should return not found for delete user that does not exist - 404', async ({
    request,
    adminAuth
  }) => {
    // given
    // when
    const response = await deleteUser(request, adminAuth.jwtToken, 'unknown-user-987654');

    // then
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: "The user doesn't exist" });
  });
});

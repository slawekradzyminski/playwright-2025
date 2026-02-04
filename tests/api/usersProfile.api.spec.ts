import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import { createUser } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/signupClient';
import {
  deleteUser,
  getChatSystemPrompt,
  getCurrentUser,
  getToolSystemPrompt,
  getUserByUsername,
  logoutUser,
  updateChatSystemPrompt,
  updateToolSystemPrompt,
  updateUser
} from '../../http/userProfileClient';
import type { UserResponseDto } from '../../types/auth';
import { test } from '../fixtures/auth.fixture';

test.describe('/users profile and management API tests', () => {
  test('should return current user for authenticated request - 200', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await getCurrentUser(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserResponseDto = await response.json();
    expect(responseBody.username).toBe(authenticatedUser.user.username);
  });

  test('should return unauthorized for current user request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users/me`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

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

  test('should return chat system prompt for authenticated user - 200', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await getChatSystemPrompt(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.chatSystemPrompt).toBeDefined();
  });

  test('should return unauthorized for chat system prompt request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users/chat-system-prompt`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should update chat system prompt for authenticated user - 200', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const payload = { chatSystemPrompt: 'Respond with short and clear answers.' };

    // when
    const response = await updateChatSystemPrompt(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(payload);
  });

  test('should return unauthorized for update chat system prompt without token - 401', async ({
    request
  }) => {
    // given
    const payload = { chatSystemPrompt: 'Short answers only.' };

    // when
    const response = await request.put(`${API_BASE_URL}/users/chat-system-prompt`, {
      data: payload
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return tool system prompt for authenticated user - 200', async ({
    request,
    authenticatedUser
  }) => {
    // given
    // when
    const response = await getToolSystemPrompt(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.toolSystemPrompt).toBeDefined();
  });

  test('should return unauthorized for tool system prompt request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users/tool-system-prompt`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should update tool system prompt for authenticated user - 200', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const payload = { toolSystemPrompt: 'Always query product data before answering.' };

    // when
    const response = await updateToolSystemPrompt(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(payload);
  });

  test('should return unauthorized for update tool system prompt without token - 401', async ({
    request
  }) => {
    // given
    const payload = { toolSystemPrompt: 'Use tools.' };

    // when
    const response = await request.put(`${API_BASE_URL}/users/tool-system-prompt`, {
      data: payload
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should logout authenticated user - 200', async ({ request, authenticatedUser }) => {
    // given
    // when
    const response = await logoutUser(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(await response.text()).toBe('');
  });

  test('should return unauthorized for logout without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/users/logout`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});

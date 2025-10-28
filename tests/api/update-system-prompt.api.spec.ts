import { test, expect } from '../../fixtures/apiAuthFixture';
import type { SystemPromptDto } from '../../types/user';
import { updateSystemPrompt } from '../../http/updateSystemPromptClient';
import { generateRandomUserWithRole } from '../../generators/userGenerator';
import { attemptRegistration } from '../../http/registerClient';

test.describe('/users/{username}/system-prompt PUT API tests', () => {
  test('should update system prompt for user - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const userToUpdate = generateRandomUserWithRole('ROLE_CLIENT');
    const registrationResponse = await attemptRegistration(request, userToUpdate);
    expect(registrationResponse.status()).toBe(201);

    const systemPromptPayload: SystemPromptDto = {
      systemPrompt: 'You are a friendly assistant.'
    };

    // when
    const response = await updateSystemPrompt(
      request,
      userToUpdate.username,
      systemPromptPayload,
      authenticatedAdmin.token
    );

    // then
    expect(response.status()).toBe(200);
    const responseBody: SystemPromptDto = await response.json();
    expect(responseBody.systemPrompt).toBe(systemPromptPayload.systemPrompt);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedClient }) => {
    // given
    const systemPromptPayload: SystemPromptDto = {
      systemPrompt: 'Unauthorized update attempt.'
    };

    // when
    const response = await updateSystemPrompt(
      request,
      authenticatedClient.userData.username,
      systemPromptPayload
    );

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized error when user does not exist - 401', async ({ request, authenticatedAdmin }) => {
    // given
    const unknownUser = `non-existing-user-${Date.now()}`;
    const systemPromptPayload: SystemPromptDto = {
      systemPrompt: 'Ghost prompt'
    };

    // when
    const response = await updateSystemPrompt(
      request,
      unknownUser,
      systemPromptPayload,
      authenticatedAdmin.token
    );

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return forbidden error when user lacks permissions - 403', async ({ request, authenticatedClient }) => {
    // given
    const systemPromptPayload: SystemPromptDto = {
      systemPrompt: 'Not allowed'
    };

    // when
    const response = await updateSystemPrompt(
      request,
      'admin',
      systemPromptPayload,
      authenticatedClient.token
    );

    // then
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Access denied');
  });
});

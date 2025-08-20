import { updateSystemPromptForUser, updateSystemPromptForUserWithoutToken, getSystemPromptForUser } from '../../http/usersClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { SystemPromptDto } from '../../types/user';

test.describe('/users/{username}/system-prompt (PUT) API tests', () => {
  const newPrompt: SystemPromptDto = { systemPrompt: 'You are a helpful assistant.' };

  test('should successfully update own system prompt as CLIENT - 200', async ({ request, authenticatedClient }) => {
    // given
    const token = authenticatedClient.token;
    const username = authenticatedClient.user.username;

    // when
    const response = await updateSystemPromptForUser(request, token, username, newPrompt);

    // then
    expect(response.status()).toBe(200);
    const updatedPrompt: SystemPromptDto = await response.json();
    expect(updatedPrompt.systemPrompt).toBe(newPrompt.systemPrompt);

    // Verify the update
    const getResponse = await getSystemPromptForUser(request, token, username);
    const currentPrompt: SystemPromptDto = await getResponse.json();
    expect(currentPrompt.systemPrompt).toBe(newPrompt.systemPrompt);
  });

  test('should successfully update user system prompt as ADMIN - 200', async ({ request, authenticatedAdmin, authenticatedClient }) => {
    // given
    const adminToken = authenticatedAdmin.token;
    const clientUsername = authenticatedClient.user.username;

    // when
    const response = await updateSystemPromptForUser(request, adminToken, clientUsername, newPrompt);

    // then
    expect(response.status()).toBe(200);
    const updatedPrompt: SystemPromptDto = await response.json();
    expect(updatedPrompt.systemPrompt).toBe(newPrompt.systemPrompt);
  });

  test('should return unauthorized error for missing token - 401', async ({ request, authenticatedClient }) => {
    // given
    const username = authenticatedClient.user.username;

    // when
    const response = await updateSystemPromptForUserWithoutToken(request, username, newPrompt);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error for updating another user\'s prompt as CLIENT - 403', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    const clientToken = authenticatedClient.token;
    const adminUsername = authenticatedAdmin.user.username;

    // when
    const response = await updateSystemPromptForUser(request, clientToken, adminUsername, newPrompt);

    // then
    expect(response.status()).toBe(403);
  });

});

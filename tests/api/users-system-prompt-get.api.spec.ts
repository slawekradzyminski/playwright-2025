import { getSystemPromptForUser, getSystemPromptForUserWithoutToken } from '../../http/usersClient';
import { test, expect } from '../../fixtures/auth.fixtures';
import { SystemPromptDto } from '../../types/user';

test.describe('/users/{username}/system-prompt (GET) API tests', () => {
  test('should successfully get own system prompt as CLIENT - 200', async ({ request, authenticatedClient }) => {
    // given
    const token = authenticatedClient.token;
    const username = authenticatedClient.user.username;

    // when
    const response = await getSystemPromptForUser(request, token, username);

    // then
    expect(response.status()).toBe(200);
    const systemPrompt: SystemPromptDto = await response.json();
    expect(systemPrompt).toHaveProperty('systemPrompt');
    expect(systemPrompt.systemPrompt === null || typeof systemPrompt.systemPrompt === 'string').toBeTruthy();
  });

  test('should successfully get user system prompt as ADMIN - 200', async ({ request, authenticatedAdmin, authenticatedClient }) => {
    // given
    const adminToken = authenticatedAdmin.token;
    const clientUsername = authenticatedClient.user.username;

    // when
    const response = await getSystemPromptForUser(request, adminToken, clientUsername);

    // then
    expect(response.status()).toBe(200);
    const systemPrompt: SystemPromptDto = await response.json();
    expect(systemPrompt).toHaveProperty('systemPrompt');
  });

  test('should return unauthorized error for missing token - 401', async ({ request, authenticatedClient }) => {
    // given
    const username = authenticatedClient.user.username;

    // when
    const response = await getSystemPromptForUserWithoutToken(request, username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error for getting another user\'s prompt as CLIENT - 403', async ({ request, authenticatedClient, authenticatedAdmin }) => {
    // given
    const clientToken = authenticatedClient.token;
    const adminUsername = authenticatedAdmin.user.username;

    // when
    const response = await getSystemPromptForUser(request, clientToken, adminUsername);

    // then
    expect(response.status()).toBe(403);
  });

});

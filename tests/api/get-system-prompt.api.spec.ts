import { test, expect } from '../../fixtures/apiAuthFixture';
import type { SystemPromptDto } from '../../types/user';
import { getSystemPrompt } from '../../http/getSystemPromptClient';

test.describe('/users/{username}/system-prompt GET API tests', () => {
  test('should retrieve system prompt for authenticated user - 200', async ({ request, authenticatedClient }) => {
    // when
    const response = await getSystemPrompt(request, authenticatedClient.userData.username, authenticatedClient.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: SystemPromptDto = await response.json();
    expect(responseBody.systemPrompt).toBeNull();
  });

  test('should return unauthorized error when no token provided - 401', async ({ request, authenticatedClient }) => {
    // when
    const response = await getSystemPrompt(request, authenticatedClient.userData.username);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized error when user does not exist - 401', async ({ request, authenticatedAdmin }) => {
    // given
    const unknownUsername = `non-existing-user-${Date.now()}`;

    // when
    const response = await getSystemPrompt(request, unknownUsername, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return forbidden error when user lacks permissions - 403', async ({ request, authenticatedClient }) => {
    // given
    const username = 'admin';

    // when
    const response = await getSystemPrompt(request, username, authenticatedClient.token);

    // then
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Access denied');
  });
});

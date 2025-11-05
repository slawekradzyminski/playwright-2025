import { test, expect } from '../../../fixtures/authFixtures';
import { getSystemPrompt, getSystemPromptWithoutAuth } from '../../../http/users/systemPromptGetClient';
import type { SystemPromptDto } from '../../../types/auth';

test.describe('/users/system-prompt GET', () => {
  test('should return system prompt for admin user - 200', async ({ request, authenticatedAdmin }) => {
    const response = await getSystemPrompt(request, authenticatedAdmin.token);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as SystemPromptDto;
    expect(responseBody).toHaveProperty('systemPrompt');
    expect(typeof responseBody.systemPrompt === 'string' || responseBody.systemPrompt === null).toBe(true);
  });

  test('should return system prompt for client user - 200', async ({ request, authenticatedClient }) => {
    const response = await getSystemPrompt(request, authenticatedClient.token);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as SystemPromptDto;
    expect(responseBody).toHaveProperty('systemPrompt');
    expect(typeof responseBody.systemPrompt === 'string' || responseBody.systemPrompt === null).toBe(true);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    const response = await getSystemPromptWithoutAuth(request);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

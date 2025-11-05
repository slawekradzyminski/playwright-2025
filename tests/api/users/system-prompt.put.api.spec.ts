import { test, expect } from '../../../fixtures/authFixtures';
import {
  updateSystemPrompt,
  updateSystemPromptWithoutAuth,
} from '../../../http/users/systemPromptPutClient';
import { getSystemPrompt } from '../../../http/users/systemPromptGetClient';
import type { SystemPromptDto } from '../../../types/auth';

test.describe('/users/system-prompt PUT', () => {
  test('should update system prompt for admin user - 200', async ({ request, authenticatedAdmin }) => {
    const payload: SystemPromptDto = {
      systemPrompt: `Admin prompt ${Date.now()}`,
    };

    const response = await updateSystemPrompt(request, authenticatedAdmin.token, payload);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as SystemPromptDto;
    expect(responseBody.systemPrompt).toBe(payload.systemPrompt);

    const verifyResponse = await getSystemPrompt(request, authenticatedAdmin.token);
    const verifyBody = (await verifyResponse.json()) as SystemPromptDto;
    expect(verifyBody.systemPrompt).toBe(payload.systemPrompt);
  });

  test('should update system prompt for client user - 200', async ({ request, authenticatedClient }) => {
    const payload: SystemPromptDto = {
      systemPrompt: `Client prompt ${Date.now()}`,
    };

    const response = await updateSystemPrompt(request, authenticatedClient.token, payload);

    expect(response.status()).toBe(200);
    const responseBody = (await response.json()) as SystemPromptDto;
    expect(responseBody.systemPrompt).toBe(payload.systemPrompt);

    const verifyResponse = await getSystemPrompt(request, authenticatedClient.token);
    const verifyBody = (await verifyResponse.json()) as SystemPromptDto;
    expect(verifyBody.systemPrompt).toBe(payload.systemPrompt);
  });

  test('should return unauthorized without token - 401', async ({ request }) => {
    const payload: SystemPromptDto = {
      systemPrompt: 'No auth prompt',
    };

    const response = await updateSystemPromptWithoutAuth(request, payload);

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });
});

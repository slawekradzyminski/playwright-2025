import { test, expect } from '../../../fixtures/apiAuthFixture';
import { getSystemPrompt } from '../../../http/users/getSystemPromptRequest';
import type { SystemPromptDto } from '../../../types/auth';
import { INVALID_TOKEN } from '../../../config/constants';
import { updateSystemPrompt } from '../../../http/users/updateSystemPromptRequest';
import { faker } from '@faker-js/faker';

test.describe('GET /users/system-prompt API tests', () => {
  test('authenticated user should get their system prompt - 200', async ({ request, clientAuth }) => {
    // when
    const response = await getSystemPrompt(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: SystemPromptDto = await response.json();
    expect(responseBody).toHaveProperty('systemPrompt');
    expect(responseBody.systemPrompt).toBeNull();
  });

  test('authenticated user should get their non-null system prompt - 200', async ({ request, clientAuth }) => {
    // given
    const systemPromptData: SystemPromptDto = {
      systemPrompt: faker.lorem.sentence()
    };
    const updateResponse = await updateSystemPrompt(request, systemPromptData, clientAuth.token);
    expect(updateResponse.status()).toBe(200);

    // when
    const response = await getSystemPrompt(request, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: SystemPromptDto = await response.json();
    expect(responseBody).toHaveProperty('systemPrompt');
    expect(responseBody.systemPrompt).toBe(systemPromptData.systemPrompt);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await getSystemPrompt(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // given

    // when
    const response = await getSystemPrompt(request, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});


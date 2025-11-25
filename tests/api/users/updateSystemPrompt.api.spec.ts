import { test, expect } from '../../../fixtures/apiAuthFixture';
import { faker } from '@faker-js/faker';
import { updateSystemPrompt } from '../../../http/users/updateSystemPromptRequest';
import type { SystemPromptDto } from '../../../types/auth';
import { INVALID_TOKEN } from '../../../config/constants';

test.describe('PUT /users/system-prompt API tests', () => {
  test('authenticated user should be able to update and verify their system prompt with GET - 200', async ({ request, clientAuth }) => {
    // given
    const systemPromptData: SystemPromptDto = {
      systemPrompt: faker.lorem.paragraph()
    };

    // when
    const updateResponse = await updateSystemPrompt(request, systemPromptData, clientAuth.token);

    // then
    expect(updateResponse.status()).toBe(200);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // given
    const systemPromptData: SystemPromptDto = {
      systemPrompt: faker.lorem.sentence()
    };

    // when
    const response = await updateSystemPrompt(request, systemPromptData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // given
    const systemPromptData: SystemPromptDto = {
      systemPrompt: faker.lorem.sentence()
    };

    // when
    const response = await updateSystemPrompt(request, systemPromptData, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });
});

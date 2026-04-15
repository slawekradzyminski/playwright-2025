import { test, expect } from '../../fixtures/apiAuthFixture';
import { toolSystemPromptClient } from '../../httpclients/toolSystemPromptClient';
import { faker } from '@faker-js/faker';
import { ToolSystemPromptResponse } from '../../types/prompts';

test.describe('/api/v1/users/tool-system-prompt PUT API tests', () => {
  test('should successfully update tool system prompt - 200', async ({ request, auth }) => {
    // given
    const { token } = auth;
    const newPrompt = faker.lorem.paragraphs();
    const newToolSystemPrompt = { toolSystemPrompt: newPrompt };

    // when
    const response = await toolSystemPromptClient.putToolSystemPrompt(request, newToolSystemPrompt, token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ToolSystemPromptResponse = await response.json();
    expect(responseBody.toolSystemPrompt).toEqual(newPrompt);

    const getPromptResponse = await toolSystemPromptClient.getToolSystemPrompt(request, token);
    expect(getPromptResponse.status()).toBe(200);
    const getPromptResponseBody: ToolSystemPromptResponse = await getPromptResponse.json();
    expect(getPromptResponseBody.toolSystemPrompt).toEqual(newPrompt);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await toolSystemPromptClient.putToolSystemPrompt(request, { toolSystemPrompt: 'test' });

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error if fake token provided - 401', async ({ request }) => {
    // when
    const response = await toolSystemPromptClient.putToolSystemPrompt(request, { toolSystemPrompt: 'test' }, 'fakeToken');

    // then
    expect(response.status()).toBe(401);
  });

}); 

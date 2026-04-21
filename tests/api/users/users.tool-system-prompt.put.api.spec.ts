import { UsersClient } from '../../../httpclients/usersClient';
import type { ToolSystemPromptDto } from '../../../types/systemPrompt';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';

test.describe('PUT /api/v1/users/tool-system-prompt API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should update current user tool system prompt - 200', async ({ authenticatedUser }) => {
    // given
    const prompt: ToolSystemPromptDto = {
      toolSystemPrompt: `Updated tool prompt ${Date.now()}`
    };

    // when
    const response = await usersClient.updateToolSystemPrompt(prompt, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: ToolSystemPromptDto = await response.json();
    expect(responseBody.toolSystemPrompt).toBe(prompt.toolSystemPrompt);

    const getResponse = await usersClient.getToolSystemPrompt(authenticatedUser.token);
    const getResponseBody: ToolSystemPromptDto = await getResponse.json();
    expect(getResponseBody.toolSystemPrompt).toBe(prompt.toolSystemPrompt);
  });

  test('should return validation error when tool system prompt is too long - 400', async ({ authenticatedUser }) => {
    // given
    const prompt: ToolSystemPromptDto = {
      toolSystemPrompt: 'a'.repeat(5001)
    };

    // when
    const response = await usersClient.updateToolSystemPrompt(prompt, authenticatedUser.token);

    // then
    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.toolSystemPrompt).toBe('Tool system prompt must be at most 5000 characters');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.updateToolSystemPrompt({
      toolSystemPrompt: 'Updated tool prompt without token'
    });

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.updateToolSystemPrompt(
      {
        toolSystemPrompt: 'Updated tool prompt with invalid token'
      },
      'invalid-token'
    );

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

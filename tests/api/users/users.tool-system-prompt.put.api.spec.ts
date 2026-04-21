import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';
import type { ToolSystemPromptDto } from '../../../types/systemPrompt';

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
    const initialResponse = await usersClient.getToolSystemPrompt(authenticatedUser.token);
    const initialPrompt = await expectJsonResponse<ToolSystemPromptDto>(initialResponse, 200);

    try {
      // when
      const response = await usersClient.updateToolSystemPrompt(prompt, authenticatedUser.token);

      // then
      const responseBody = await expectJsonResponse<ToolSystemPromptDto>(response, 200);
      expect(responseBody.toolSystemPrompt).toBe(prompt.toolSystemPrompt);

      const getResponse = await usersClient.getToolSystemPrompt(authenticatedUser.token);
      const getResponseBody = await expectJsonResponse<ToolSystemPromptDto>(getResponse, 200);
      expect(getResponseBody.toolSystemPrompt).toBe(prompt.toolSystemPrompt);
    } finally {
      await usersClient.updateToolSystemPrompt(initialPrompt, authenticatedUser.token);
    }
  });

  test('should return validation error when tool system prompt is too long - 400', async ({ authenticatedUser }) => {
    // given
    const prompt: ToolSystemPromptDto = {
      toolSystemPrompt: 'a'.repeat(5001)
    };

    // when
    const response = await usersClient.updateToolSystemPrompt(prompt, authenticatedUser.token);

    // then
    const responseBody = await expectJsonResponse<{ toolSystemPrompt: string }>(response, 400);
    expect(responseBody.toolSystemPrompt).toBe('Tool system prompt must be at most 5000 characters');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.updateToolSystemPrompt({
      toolSystemPrompt: 'Updated tool prompt without token'
    });

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.updateToolSystemPrompt(
      {
        toolSystemPrompt: 'Updated tool prompt with invalid token'
      },
      INVALID_TOKEN
    );

    // then
    await expectInvalidToken(response);
  });
});

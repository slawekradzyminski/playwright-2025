import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';
import type { ChatSystemPromptDto } from '../../../types/systemPrompt';

test.describe('PUT /api/v1/users/chat-system-prompt API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should update current user chat system prompt - 200', async ({ authenticatedApiUser }) => {
    // given
    const prompt: ChatSystemPromptDto = {
      chatSystemPrompt: `Updated chat prompt ${Date.now()}`
    };
    const initialResponse = await usersClient.getChatSystemPrompt(authenticatedApiUser.token);
    const initialPrompt = await expectJsonResponse<ChatSystemPromptDto>(initialResponse, 200);

    try {
      // when
      const response = await usersClient.updateChatSystemPrompt(prompt, authenticatedApiUser.token);

      // then
      const responseBody = await expectJsonResponse<ChatSystemPromptDto>(response, 200);
      expect(responseBody.chatSystemPrompt).toBe(prompt.chatSystemPrompt);

      const getResponse = await usersClient.getChatSystemPrompt(authenticatedApiUser.token);
      const getResponseBody = await expectJsonResponse<ChatSystemPromptDto>(getResponse, 200);
      expect(getResponseBody.chatSystemPrompt).toBe(prompt.chatSystemPrompt);
    } finally {
      await usersClient.updateChatSystemPrompt(initialPrompt, authenticatedApiUser.token);
    }
  });

  test('should return validation error when chat system prompt is too long - 400', async ({ authenticatedApiUser }) => {
    // given
    const prompt: ChatSystemPromptDto = {
      chatSystemPrompt: 'a'.repeat(5001)
    };

    // when
    const response = await usersClient.updateChatSystemPrompt(prompt, authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<{ chatSystemPrompt: string }>(response, 400);
    expect(responseBody.chatSystemPrompt).toBe('Chat system prompt must be at most 5000 characters');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.updateChatSystemPrompt({
      chatSystemPrompt: 'Updated chat prompt without token'
    });

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.updateChatSystemPrompt(
      {
        chatSystemPrompt: 'Updated chat prompt with invalid token'
      },
      INVALID_TOKEN
    );

    // then
    await expectInvalidToken(response);
  });
});

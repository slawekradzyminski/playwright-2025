import { UsersClient } from '../../../httpclients/usersClient';
import type { ChatSystemPromptDto } from '../../../types/systemPrompt';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';

test.describe('PUT /api/v1/users/chat-system-prompt API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should update current user chat system prompt - 200', async ({ authenticatedUser }) => {
    // given
    const prompt: ChatSystemPromptDto = {
      chatSystemPrompt: `Updated chat prompt ${Date.now()}`
    };

    // when
    const response = await usersClient.updateChatSystemPrompt(prompt, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: ChatSystemPromptDto = await response.json();
    expect(responseBody.chatSystemPrompt).toBe(prompt.chatSystemPrompt);

    const getResponse = await usersClient.getChatSystemPrompt(authenticatedUser.token);
    const getResponseBody: ChatSystemPromptDto = await getResponse.json();
    expect(getResponseBody.chatSystemPrompt).toBe(prompt.chatSystemPrompt);
  });

  test('should return validation error when chat system prompt is too long - 400', async ({ authenticatedUser }) => {
    // given
    const prompt: ChatSystemPromptDto = {
      chatSystemPrompt: 'a'.repeat(5001)
    };

    // when
    const response = await usersClient.updateChatSystemPrompt(prompt, authenticatedUser.token);

    // then
    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.chatSystemPrompt).toBe('Chat system prompt must be at most 5000 characters');
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.updateChatSystemPrompt({
      chatSystemPrompt: 'Updated chat prompt without token'
    });

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.updateChatSystemPrompt(
      {
        chatSystemPrompt: 'Updated chat prompt with invalid token'
      },
      'invalid-token'
    );

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

import { test, expect } from '../fixtures/auth.fixture';
import type { ChatSystemPromptDto, ErrorResponse } from '../../types/auth';
import { getChatSystemPromptRequest } from './http/getChatSystemPromptRequest';
import { updateChatSystemPromptRequest } from './http/updateChatSystemPromptRequest';

test.describe('/users/chat-system-prompt PUT API tests', () => {
  test('should update chat system prompt for authenticated user - 200', async ({
    request,
    authenticatedUser,
  }) => {
    // given
    const payload: ChatSystemPromptDto = {
      chatSystemPrompt: `Chat prompt updated at ${Date.now()}`,
    };

    // when
    const updateResponse = await updateChatSystemPromptRequest(
      request,
      authenticatedUser.jwtToken,
      payload,
    );

    // then
    expect(updateResponse.status()).toBe(200);
    expect(updateResponse.headers()['content-type']).toContain('application/json');

    const updateResponseBody = (await updateResponse.json()) as ChatSystemPromptDto;
    expect(updateResponseBody.chatSystemPrompt).toBe(payload.chatSystemPrompt);

    const getResponse = await getChatSystemPromptRequest(request, authenticatedUser.jwtToken);
    expect(getResponse.status()).toBe(200);
    const getResponseBody = (await getResponse.json()) as ChatSystemPromptDto;
    expect(getResponseBody.chatSystemPrompt).toBe(payload.chatSystemPrompt);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.put('/users/chat-system-prompt', {
      data: { chatSystemPrompt: 'missing-token' },
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

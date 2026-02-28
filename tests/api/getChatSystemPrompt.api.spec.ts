import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { ChatSystemPromptDto } from '../../types/prompt';
import { getChatSystemPromptRequest } from './http/getChatSystemPromptRequest';

test.describe('/users/chat-system-prompt GET API tests', () => {
  test('should get chat system prompt for authenticated user - 200', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await getChatSystemPromptRequest(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ChatSystemPromptDto;
    expect(typeof responseBody.chatSystemPrompt).toBe('string');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/users/chat-system-prompt');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

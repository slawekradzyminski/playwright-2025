import { test, expect } from '../fixtures/authFixture';
import { UserClient } from '../../../httpclients/userClient';
import type { ChatSystemPromptDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MAX_PLUS_ONE_PROMPT = 'c'.repeat(5001);

test.describe('PUT /api/v1/users/chat-system-prompt', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should update chat system prompt and persist it - 200', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;
    const prompt = 'Use concise responses in this chat session.';

    // when
    const response = await client.updateChatSystemPrompt({ chatSystemPrompt: prompt }, token);

    // then
    expect(response.status()).toBe(200);
    const body: ChatSystemPromptDto = await response.json();
    expect(body.chatSystemPrompt).toBe(prompt);

    const readBack = await client.getChatSystemPrompt(token);
    expect(readBack.status()).toBe(200);
    const readBackBody: ChatSystemPromptDto = await readBack.json();
    expect(readBackBody.chatSystemPrompt).toBe(prompt);
  });

  test('should return bad request for chat system prompt longer than 5000 chars - 400', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;

    // when
    const response = await client.updateChatSystemPrompt({ chatSystemPrompt: MAX_PLUS_ONE_PROMPT }, token);

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.chatSystemPrompt).toBe('Chat system prompt must be at most 5000 characters');
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.updateChatSystemPrompt({ chatSystemPrompt: 'No auth update' });

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });
});

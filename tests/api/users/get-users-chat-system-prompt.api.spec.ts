import { test, expect } from '../fixtures/authFixture';
import { UserClient } from '../../../httpclients/userClient';
import type { ChatSystemPromptDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('GET /api/v1/users/chat-system-prompt', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should return effective chat system prompt and fallback when value is blank - 200', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;
    const clearResponse = await client.updateChatSystemPrompt({ chatSystemPrompt: '' }, token);
    expect(clearResponse.status()).toBe(200);

    // when
    const response = await client.getChatSystemPrompt(token);

    // then
    expect(response.status()).toBe(200);
    const body: ChatSystemPromptDto = await response.json();
    expect(typeof body.chatSystemPrompt).toBe('string');
    expect(body.chatSystemPrompt.length).toBeGreaterThan(0);
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.getChatSystemPrompt();

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });
});

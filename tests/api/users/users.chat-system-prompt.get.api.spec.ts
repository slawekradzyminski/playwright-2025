import { UsersClient } from '../../../httpclients/usersClient';
import type { ChatSystemPromptDto } from '../../../types/systemPrompt';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';

test.describe('GET /api/v1/users/chat-system-prompt API tests', () => {
  test('should return current user chat system prompt - 200', async ({ request, authenticatedUser }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getChatSystemPrompt(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: ChatSystemPromptDto = await response.json();
    expect(responseBody.chatSystemPrompt).toEqual(expect.any(String));
    expect(responseBody.chatSystemPrompt.length).toBeGreaterThan(0);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getChatSystemPrompt();

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const usersClient = new UsersClient(request);

    // when
    const response = await usersClient.getChatSystemPrompt('invalid-token');

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

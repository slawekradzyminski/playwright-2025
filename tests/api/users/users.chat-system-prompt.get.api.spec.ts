import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';
import type { ChatSystemPromptDto } from '../../../types/systemPrompt';

test.describe('GET /api/v1/users/chat-system-prompt API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return current user chat system prompt - 200', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await usersClient.getChatSystemPrompt(authenticatedUser.token);

    // then
    const responseBody = await expectJsonResponse<ChatSystemPromptDto>(response, 200);
    expect(responseBody.chatSystemPrompt).toEqual(expect.any(String));
    expect(responseBody.chatSystemPrompt.length).toBeGreaterThan(0);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getChatSystemPrompt();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getChatSystemPrompt(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

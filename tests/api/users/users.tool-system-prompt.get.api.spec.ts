import { UsersClient } from '../../../httpclients/usersClient';
import type { ToolSystemPromptDto } from '../../../types/systemPrompt';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';

test.describe('GET /api/v1/users/tool-system-prompt API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return current user tool system prompt - 200', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await usersClient.getToolSystemPrompt(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: ToolSystemPromptDto = await response.json();
    expect(responseBody.toolSystemPrompt).toEqual(expect.any(String));
    expect(responseBody.toolSystemPrompt.length).toBeGreaterThan(0);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getToolSystemPrompt();

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getToolSystemPrompt('invalid-token');

    // then
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

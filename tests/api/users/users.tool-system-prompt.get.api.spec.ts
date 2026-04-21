import { expect, test } from '../../../fixtures/authenticatedApiUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { UsersClient } from '../../../httpclients/usersClient';
import type { ToolSystemPromptDto } from '../../../types/systemPrompt';

test.describe('GET /api/v1/users/tool-system-prompt API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should return current user tool system prompt - 200', async ({ authenticatedApiUser }) => {
    // given

    // when
    const response = await usersClient.getToolSystemPrompt(authenticatedApiUser.token);

    // then
    const responseBody = await expectJsonResponse<ToolSystemPromptDto>(response, 200);
    expect(responseBody.toolSystemPrompt).toEqual(expect.any(String));
    expect(responseBody.toolSystemPrompt.length).toBeGreaterThan(0);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await usersClient.getToolSystemPrompt();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await usersClient.getToolSystemPrompt(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

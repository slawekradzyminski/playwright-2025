import { test, expect } from '../../fixtures/apiAuthFixture';
import { toolSystemPromptClient } from '../../httpclients/toolSystemPromptClient';
import { API_TEST_DETAILS } from '../../config/testDetails';

test.describe('/api/v1/users/tool-system-prompt GET API tests', API_TEST_DETAILS, () => {
  test('should successfully get tool system prompt - 200', async ({ request, auth }) => {
    // given
    const { token } = auth;

    // when
    const response = await toolSystemPromptClient.getToolSystemPrompt(request, token);

    // then
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      toolSystemPrompt: expect.any(String),
    });
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // when
    const response = await toolSystemPromptClient.getToolSystemPrompt(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error if fake token provided - 401', async ({ request }) => {
    // when
    const response = await toolSystemPromptClient.getToolSystemPrompt(request, 'fakeToken');

    // then
    expect(response.status()).toBe(401);
  });

}); 

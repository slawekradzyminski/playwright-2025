import { test, expect } from '../../fixtures/apiAuthFixture';
import type { SystemPromptDto } from '../../types/auth';
import { getSystemPrompt, getSystemPromptWithoutAuth } from '../../http/getSystemPromptRequest';

test.describe('GET /users/system-prompt API tests', () => {
  test('should successfully get system prompt with valid token - 200', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;

    // when
    const response = await getSystemPrompt(request, token);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: SystemPromptDto = await response.json();
    expect(responseBody).toBeDefined();
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given / when
    const response = await getSystemPromptWithoutAuth(request);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.here';

    // when
    const response = await getSystemPrompt(request, invalidToken);

    // then
    expect(response.status()).toBe(401);
  });
});


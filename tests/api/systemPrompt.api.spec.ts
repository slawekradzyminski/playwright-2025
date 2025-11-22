import { test, expect } from '../../fixtures/apiAuthFixture';
import type { SystemPromptDto } from '../../types/auth';
import { getSystemPrompt, getSystemPromptWithoutAuth, updateSystemPrompt, updateSystemPromptWithoutAuth } from '../../http/userEndpointsRequest';

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

test.describe('PUT /users/system-prompt API tests', () => {
  test('should successfully update system prompt with valid token - 200', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const newSystemPrompt = 'You are a helpful AI assistant specialized in testing.';

    // when
    const response = await updateSystemPrompt(request, token, newSystemPrompt);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: SystemPromptDto = await response.json();
    expect(responseBody.systemPrompt).toBe(newSystemPrompt);

    const getResponse = await getSystemPrompt(request, token);
    const getResponseBody: SystemPromptDto = await getResponse.json();
    expect(getResponseBody.systemPrompt).toBe(newSystemPrompt);
  });

  test('should successfully update system prompt to empty string - 200', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const emptyPrompt = '';

    // when
    const response = await updateSystemPrompt(request, token, emptyPrompt);
    
    // then
    expect(response.status()).toBe(200);
    const responseBody: SystemPromptDto = await response.json();
    expect(responseBody.systemPrompt).toBe(emptyPrompt);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const systemPrompt = 'Test prompt';

    // when
    const response = await updateSystemPromptWithoutAuth(request, systemPrompt);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.here';
    const systemPrompt = 'Test prompt';

    // when
    const response = await updateSystemPrompt(request, invalidToken, systemPrompt);

    // then
    expect(response.status()).toBe(401);
  });
});


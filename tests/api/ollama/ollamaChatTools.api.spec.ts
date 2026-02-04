import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { chatWithOllamaTools, getOllamaToolDefinitions } from '../../../http/ollamaClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/chat/tools POST API tests', () => {
  test('should stream chat response with tools - 200', async ({ request, authenticatedUser }) => {
    // given
    const definitionsResponse = await getOllamaToolDefinitions(request, authenticatedUser.jwtToken);
    expect(definitionsResponse.status()).toBe(200);
    const tools = await definitionsResponse.json();

    // when
    const response = await chatWithOllamaTools(request, authenticatedUser.jwtToken, {
      model: 'qwen3:4b-instruct',
      messages: [{ role: 'user', content: 'Show products' }],
      tools
    });

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
    const responseText = await response.text();
    expect(responseText).toContain('data:');
    expect(responseText).toContain('"message"');
  });

  test('should return validation error for missing tools - 400', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const payload = {
      model: 'qwen3:4b-instruct',
      messages: [{ role: 'user', content: 'Show products' }]
    };

    // when
    const response = await chatWithOllamaTools(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      error: 'At least one tool definition is required'
    });
  });

  test('should return unauthorized for chat tools request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/api/ollama/chat/tools`, {
      data: {
        model: 'qwen3:4b-instruct',
        messages: [{ role: 'user', content: 'Show products' }],
        tools: []
      }
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});

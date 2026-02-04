import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { chatWithOllama } from '../../../http/ollamaClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/chat POST API tests', () => {
  test('should stream chat response - 200', async ({ request, authenticatedUser }) => {
    // given
    const payload = {
      model: 'qwen3:4b-instruct',
      messages: [{ role: 'user', content: 'Hello' }]
    };

    // when
    const response = await chatWithOllama(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
    const responseText = await response.text();
    expect(responseText).toContain('data:');
    expect(responseText).toContain('"message"');
  });

  test('should return validation error for invalid payload - 400', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const payload = {
      model: 'qwen3:4b-instruct',
      messages: []
    };

    // when
    const response = await chatWithOllama(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      messages: 'At least one message is required'
    });
  });

  test('should return unauthorized for chat request without token - 401', async ({ request }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/api/ollama/chat`, {
      data: { model: 'qwen3:4b-instruct', messages: [{ role: 'user', content: 'Hi' }] }
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});

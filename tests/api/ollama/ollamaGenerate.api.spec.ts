import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { generateWithOllama } from '../../../http/ollamaClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/generate POST API tests', () => {
  test('should stream generated response - 200', async ({ request, authenticatedUser }) => {
    // given
    const payload = { model: 'qwen3:4b-instruct', prompt: 'Hello there' };

    // when
    const response = await generateWithOllama(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
    const responseText = await response.text();
    expect(responseText).toContain('data:');
    expect(responseText).toContain('"model"');
  });

  test('should return validation error for invalid payload - 400', async ({
    request,
    authenticatedUser
  }) => {
    // given
    const payload = { model: '', prompt: '' };

    // when
    const response = await generateWithOllama(request, authenticatedUser.jwtToken, payload);

    // then
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      model: 'must not be blank',
      prompt: 'must not be blank'
    });
  });

  test('should return unauthorized for generate request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.post(`${API_BASE_URL}/api/ollama/generate`, {
      data: { model: 'qwen3:4b-instruct', prompt: 'Hi' }
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});

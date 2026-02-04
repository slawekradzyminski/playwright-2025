import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { generateWithOllama } from '../../../http/ollamaClient';
import {
  collectGenerateResponse,
  parseEventStream,
  type OllamaGenerateStreamChunk
} from '../helpers/ollamaStreamTestUtils';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/generate POST API tests', () => {
  test('should stream generated response - 200', async ({ request, clientAuth }) => {
    // given
    const payload = { model: 'qwen3:4b-instruct', prompt: 'Provide a motivational quote' };

    // when
    const response = await generateWithOllama(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
    const responseText = await response.text();
    const chunks = parseEventStream<OllamaGenerateStreamChunk>(responseText);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.model === payload.model)).toBe(true);
    expect(chunks.at(-1)?.done).toBe(true);
    expect(collectGenerateResponse(chunks).trim()).toBe(
      'Keep shipping mock services — momentum beats perfection.'
    );
  });

  test('should return validation error for invalid payload - 400', async ({
    request,
    clientAuth
  }) => {
    // given
    const payload = { model: '', prompt: '' };

    // when
    const response = await generateWithOllama(request, clientAuth.jwtToken, payload);

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

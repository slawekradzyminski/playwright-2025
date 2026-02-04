import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { chatWithOllama } from '../../../http/ollamaClient';
import {
  collectChatContent,
  parseEventStream,
  type OllamaChatStreamChunk
} from '../helpers/ollamaStreamTestUtils';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/chat POST API tests', () => {
  test('should stream chat response - 200', async ({ request, clientAuth }) => {
    // given
    const payload = {
      model: 'qwen3:4b-instruct',
      messages: [{ role: 'user', content: 'Give me a quick status update on the Ollama mock' }]
    };

    // when
    const response = await chatWithOllama(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
    const responseText = await response.text();
    const chunks = parseEventStream<OllamaChatStreamChunk>(responseText);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.model === payload.model)).toBe(true);
    expect(chunks.at(-1)?.done).toBe(true);
    expect(chunks.filter((chunk) => !chunk.done).every((chunk) => chunk.message?.role === 'assistant')).toBe(
      true
    );
    expect(collectChatContent(chunks).trim()).toBe(
      'The Ollama mock is up on port 11434, streaming deterministic responses so backend/frontend teams can skip the heavy container during the local profile.'
    );
  });

  test('should return validation error for invalid payload - 400', async ({
    request,
    clientAuth
  }) => {
    // given
    const payload = {
      model: 'qwen3:4b-instruct',
      messages: []
    };

    // when
    const response = await chatWithOllama(request, clientAuth.jwtToken, payload);

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

import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { ChatRequestDto } from '../../types/ollama';
import { chatRequest } from './http/chatRequest';
import { parseChatStream } from './http/ollamaStreamParser';

test.describe('/api/ollama/chat API tests', () => {
  test('should stream deterministic chat timeline with thinking enabled - 200', async ({
    request,
    clientAuth,
  }) => {
    // given
    const payload: ChatRequestDto = {
      model: 'qwen3:4b-instruct',
      think: true,
      messages: [
        {
          role: 'user',
          content: 'Narrate the full streaming timeline for this mock',
        },
      ],
      options: {
        temperature: 0,
      },
    };

    // when
    const response = await chatRequest(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');

    const { chunks, contentText, thinkingText } = await parseChatStream(response);
    expect(chunks.length).toBeGreaterThan(8);

    expect(chunks.some((chunk) => chunk.done === true)).toBeTruthy();
    expect(chunks.some((chunk) => chunk.done === false)).toBeTruthy();

    const doneChunk = chunks.find((chunk) => chunk.done === true);
    expect(doneChunk?.message ?? null).toBeNull();

    expect(contentText).toContain('First you fire a request at /api/chat');
    expect(contentText).toContain('Then the thinking paragraph arrives slowly');
    expect(contentText).toContain('/api/chat/tools variant');

    expect(thinkingText).toContain('Collecting the internal notes about NDJSON streaming');
  });

  test('should return validation error when a tool message has no tool_name - 400', async ({
    request,
    clientAuth,
  }) => {
    // given
    const payload: ChatRequestDto = {
      model: 'qwen3:4b-instruct',
      messages: [
        {
          role: 'tool',
          content: '{}',
        },
      ],
    };

    // when
    const response = await chatRequest(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as Record<string, string>;
    expect(Object.values(responseBody)).toContain('Tool messages must include tool_name');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.post('/api/ollama/chat', {
      data: {
        model: 'qwen3:4b-instruct',
        messages: [
          {
            role: 'user',
            content: 'Narrate the full streaming timeline for this mock',
          },
        ],
      } as ChatRequestDto,
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ErrorResponse;
    expect(responseBody.message).toBeTruthy();
  });
});

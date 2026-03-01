import { test, expect } from '../../fixtures/auth.fixture';
import type { ErrorResponse } from '../../../types/common';
import type { StreamedRequestDto } from '../../../types/ollama';
import { generateTextRequest } from '../../../http/ollama/generateTextRequest';
import { parseGenerateStream } from '../../../http/ollama/ollamaStreamParser';

test.describe('/api/ollama/generate API tests', () => {
  test('should stream deterministic generated text with thinking enabled - 200', async ({
    request,
    clientAuth,
  }) => {
    // given
    const payload: StreamedRequestDto = {
      model: 'qwen3:4b-instruct',
      prompt: 'Walk me through the streaming demo for /api/generate',
      think: true,
      options: {
        temperature: 0,
      },
    };

    // when
    const response = await generateTextRequest(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');

    const { chunks, responseText, thinkingText } = await parseGenerateStream(response);
    expect(chunks.length).toBeGreaterThan(5);

    expect(chunks.some((chunk) => chunk.done === true)).toBeTruthy();
    expect(chunks.some((chunk) => chunk.done === false)).toBeTruthy();

    const doneChunk = chunks.find((chunk) => chunk.done === true);
    expect(doneChunk).toBeTruthy();
    expect(doneChunk?.response ?? null).toBeNull();

    expect(responseText).toContain('Here is the play-by-play:');
    expect(responseText).toContain('token slicer');
    expect(responseText).toContain('Grab a terminal, run curl with --no-buffer');

    expect(thinkingText).toContain('Constructing a narrated explanation');
  });

  test('should return validation error when model and prompt are blank - 400', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await generateTextRequest(request, clientAuth.jwtToken, {
      model: '',
      prompt: '',
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as Record<string, string>;
    expect(responseBody.model).toContain('must not be blank');
    expect(responseBody.prompt).toContain('must not be blank');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.post('/api/ollama/generate', {
      data: {
        model: 'qwen3:4b-instruct',
        prompt: 'Walk me through the streaming demo for /api/generate',
      } as StreamedRequestDto,
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ErrorResponse;
    expect(responseBody.message).toBeTruthy();
  });
});

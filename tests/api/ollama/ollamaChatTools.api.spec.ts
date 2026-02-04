import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { chatWithOllamaTools, getOllamaToolDefinitions } from '../../../http/ollamaClient';
import {
  parseEventStream,
  type OllamaChatStreamChunk
} from '../helpers/ollamaStreamTestUtils';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/chat/tools POST API tests', () => {
  test('should stream chat response with tools - 200', async ({ request, clientAuth }) => {
    // given
    const definitionsResponse = await getOllamaToolDefinitions(request, clientAuth.jwtToken);
    expect(definitionsResponse.status()).toBe(200);
    const tools = await definitionsResponse.json();
    expect(tools).toHaveLength(2);

    // when
    const response = await chatWithOllamaTools(request, clientAuth.jwtToken, {
      model: 'qwen3:4b-instruct',
      messages: [{ role: 'user', content: 'What iphones do we have available? Tell me the details about them' }],
      tools
    });

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
    const responseText = await response.text();
    const chunks = parseEventStream<OllamaChatStreamChunk>(responseText);
    expect(chunks.length).toBeGreaterThan(3);
    expect(chunks.some((chunk) => chunk.done)).toBe(true);

    const toolCallNames = chunks
      .flatMap((chunk) => chunk.message?.tool_calls ?? [])
      .map((toolCall) => toolCall.function?.name);
    expect(toolCallNames).toEqual(expect.arrayContaining(['list_products', 'get_product_snapshot']));

    const assistantContent = chunks
      .filter((chunk) => chunk.message?.role === 'assistant')
      .map((chunk) => chunk.message?.content ?? '')
      .join('');

    expect(assistantContent.trim()).toBe(
      'According to the catalog we currently have: iPhone 13 Pro and Samsung Galaxy S21. Snapshot for iPhone 13 Pro: priced at $999 with 5 unit(s) in stock.'
    );
  });

  test('should return validation error for missing tools - 400', async ({
    request,
    clientAuth
  }) => {
    // given
    const payload = {
      model: 'qwen3:4b-instruct',
      messages: [{ role: 'user', content: 'Show products' }]
    };

    // when
    const response = await chatWithOllamaTools(request, clientAuth.jwtToken, payload);

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

import { test, expect } from '../../fixtures/auth.fixture';
import type { ErrorResponse } from '../../../types/common';
import type { ChatRequestDto, OllamaToolDefinitionDto } from '../../../types/ollama';
import { chatWithToolsRequest } from '../../../http/ollama/chatWithToolsRequest';
import { parseChatStream } from '../../../http/ollama/ollamaStreamParser';

const tools: OllamaToolDefinitionDto[] = [
  {
    type: 'function',
    function: {
      name: 'get_product_snapshot',
      description: 'Get product details by product id.',
      parameters: {
        type: 'object',
        properties: {
          productId: {
            type: 'integer',
            description: 'Numeric product id',
          },
        },
        required: ['productId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_products',
      description: 'List products by category.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Category filter',
          },
          limit: {
            type: 'integer',
            description: 'Maximum returned rows',
          },
          inStockOnly: {
            type: 'boolean',
            description: 'Whether to include only in-stock products',
          },
        },
      },
    },
  },
];

const indexOfFirstChunk = (
  values: string[],
  predicate: (value: string) => boolean,
): number => values.findIndex(predicate);

test.describe('/api/ollama/chat/tools API tests', () => {
  test('should stream a full tool-calling sequence in the expected order - 200', async ({
    request,
    clientAuth,
  }) => {
    // given
    const payload: ChatRequestDto = {
      model: 'qwen3:4b-instruct',
      think: false,
      messages: [
        {
          role: 'user',
          content: 'Walk me through a two-step catalog lookup where you narrate between tool calls',
        },
      ],
      tools,
      options: {
        temperature: 0,
      },
    };

    // when
    const response = await chatWithToolsRequest(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');

    const { chunks, contentText } = await parseChatStream(response);
    expect(chunks.length).toBeGreaterThan(6);

    const toolCallNames = chunks.flatMap((chunk) =>
      (chunk.message?.tool_calls ?? []).map((toolCall) => toolCall.function.name),
    );
    expect(toolCallNames).toEqual(expect.arrayContaining(['list_products', 'get_product_snapshot']));

    const toolMessageNames = chunks
      .filter((chunk) => chunk.message?.role === 'tool')
      .map((chunk) => chunk.message?.tool_name)
      .filter((value): value is string => typeof value === 'string');
    expect(toolMessageNames).toEqual(expect.arrayContaining(['list_products', 'get_product_snapshot']));

    expect(contentText).toContain('Got the catalog slice first.');
    expect(contentText).toContain('Snapshot confirms iPhone 13 Pro is $999');

    const streamMarkers = chunks
      .map((chunk) => {
        const toolCallName = chunk.message?.tool_calls?.[0]?.function?.name;
        if (toolCallName) {
          return `tool-call:${toolCallName}`;
        }
        if (chunk.message?.role === 'tool' && chunk.message.tool_name) {
          return `tool-result:${chunk.message.tool_name}`;
        }
        return chunk.message?.content ?? '';
      })
      .filter((value) => value.length > 0);

    const listCallIndex = indexOfFirstChunk(streamMarkers, (value) => value === 'tool-call:list_products');
    const listResultIndex = indexOfFirstChunk(streamMarkers, (value) => value === 'tool-result:list_products');
    const snapshotCallIndex = indexOfFirstChunk(
      streamMarkers,
      (value) => value === 'tool-call:get_product_snapshot',
    );
    const snapshotResultIndex = indexOfFirstChunk(
      streamMarkers,
      (value) => value === 'tool-result:get_product_snapshot',
    );

    expect(listCallIndex).toBeGreaterThanOrEqual(0);
    expect(listResultIndex).toBeGreaterThan(listCallIndex);
    expect(snapshotCallIndex).toBeGreaterThan(listResultIndex);
    expect(snapshotResultIndex).toBeGreaterThan(snapshotCallIndex);

    expect(chunks.some((chunk) => chunk.done === true)).toBeTruthy();
  });

  test('should return validation error when tools list is empty - 400', async ({ request, clientAuth }) => {
    // when
    const response = await chatWithToolsRequest(request, clientAuth.jwtToken, {
      model: 'qwen3:4b-instruct',
      messages: [
        {
          role: 'user',
          content: 'Walk me through a two-step catalog lookup where you narrate between tool calls',
        },
      ],
      tools: [],
    });

    // then
    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as Record<string, string>;
    expect(responseBody.error).toContain('At least one tool definition is required');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.post('/api/ollama/chat/tools', {
      data: {
        model: 'qwen3:4b-instruct',
        messages: [
          {
            role: 'user',
            content: 'Walk me through a two-step catalog lookup where you narrate between tool calls',
          },
        ],
        tools,
      } as ChatRequestDto,
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ErrorResponse;
    expect(responseBody.message).toBeTruthy();
  });
});

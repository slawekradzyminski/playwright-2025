import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { OllamaClient } from '../../../httpclients/ollamaClient';
import type { OllamaToolDefinitionDto } from '../../../types/ollama';

test.describe('GET /api/v1/ollama/chat/tools/definitions API tests', () => {
  let ollamaClient: OllamaClient;

  test.beforeEach(async ({ request }) => {
    ollamaClient = new OllamaClient(request);
  });

  test('should return Ollama tool definitions - 200', async ({ authenticatedUser }) => {
    // given

    // when
    const response = await ollamaClient.getToolDefinitions(authenticatedUser.token);

    // then
    const responseBody = await expectJsonResponse<OllamaToolDefinitionDto[]>(response, 200);
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);

    const toolNames = responseBody.map((tool) => tool.function.name);
    expect(toolNames).toContain('get_product_snapshot');
    expect(toolNames).toContain('list_products');

    for (const tool of responseBody) {
      expect(tool.type).toBe('function');
      expect(tool.function.name).toEqual(expect.any(String));
      expect(tool.function.parameters.type).toBe('object');
      expect(Object.keys(tool.function.parameters.properties).length).toBeGreaterThan(0);
    }
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await ollamaClient.getToolDefinitions();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await ollamaClient.getToolDefinitions(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});

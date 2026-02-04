import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getOllamaToolDefinitions } from '../../../http/ollamaClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/chat/tools/definitions GET API tests', () => {
  test('should return tool definitions - 200', async ({ request, clientAuth }) => {
    // given
    // when
    const response = await getOllamaToolDefinitions(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveLength(2);

    const [snapshotTool, listProductsTool] = responseBody
      .slice()
      .sort((a: { function: { name: string } }, b: { function: { name: string } }) =>
        a.function.name.localeCompare(b.function.name)
      );

    expect(snapshotTool.type).toBe('function');
    expect(snapshotTool.function.name).toBe('get_product_snapshot');
    expect(snapshotTool.function.parameters.type).toBe('object');
    expect(snapshotTool.function.parameters.properties.productId.type).toBe('integer');
    expect(snapshotTool.function.parameters.properties.name.type).toBe('string');
    expect(snapshotTool.function.parameters.oneOf).toEqual(
      expect.arrayContaining([{ required: ['productId'] }, { required: ['name'] }])
    );

    expect(listProductsTool.type).toBe('function');
    expect(listProductsTool.function.name).toBe('list_products');
    expect(listProductsTool.function.parameters.type).toBe('object');
    expect(listProductsTool.function.parameters.properties.offset.type).toBe('integer');
    expect(listProductsTool.function.parameters.properties.limit.type).toBe('integer');
    expect(listProductsTool.function.parameters.properties.category.type).toBe('string');
    expect(listProductsTool.function.parameters.properties.inStockOnly.type).toBe('boolean');
  });

  test('should return unauthorized for tool definitions request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/api/ollama/chat/tools/definitions`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});

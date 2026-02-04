import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { getOllamaToolDefinitions } from '../../../http/ollamaClient';
import { test } from '../../fixtures/auth.fixture';

test.describe('/api/ollama/chat/tools/definitions GET API tests', () => {
  test('should return tool definitions - 200', async ({ request, authenticatedUser }) => {
    // given
    // when
    const response = await getOllamaToolDefinitions(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
    expect(responseBody[0].type).toBe('function');
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

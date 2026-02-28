import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse, ToolSystemPromptDto } from '../../types/auth';
import { getToolSystemPromptRequest } from './http/getToolSystemPromptRequest';

test.describe('/users/tool-system-prompt GET API tests', () => {
  test('should get tool system prompt for authenticated user - 200', async ({
    request,
    authenticatedUser,
  }) => {
    // when
    const response = await getToolSystemPromptRequest(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ToolSystemPromptDto;
    expect(typeof responseBody.toolSystemPrompt).toBe('string');
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/users/tool-system-prompt');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

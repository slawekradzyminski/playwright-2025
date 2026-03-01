import { test, expect } from '../../fixtures/auth.fixture';
import type { ErrorResponse } from '../../../types/common';
import type { ToolSystemPromptDto } from '../../../types/prompt';
import { getToolSystemPromptRequest } from '../../../http/users/getToolSystemPromptRequest';
import { updateToolSystemPromptRequest } from '../../../http/users/updateToolSystemPromptRequest';

test.describe('/users/tool-system-prompt PUT API tests', () => {
  test('should update tool system prompt for authenticated user - 200', async ({
    request,
    clientAuth,
  }) => {
    // given
    const payload: ToolSystemPromptDto = {
      toolSystemPrompt: `Tool prompt updated at ${Date.now()}`,
    };

    // when
    const updateResponse = await updateToolSystemPromptRequest(
      request,
      clientAuth.jwtToken,
      payload,
    );

    // then
    expect(updateResponse.status()).toBe(200);
    expect(updateResponse.headers()['content-type']).toContain('application/json');

    const updateResponseBody = (await updateResponse.json()) as ToolSystemPromptDto;
    expect(updateResponseBody.toolSystemPrompt).toBe(payload.toolSystemPrompt);

    const getResponse = await getToolSystemPromptRequest(request, clientAuth.jwtToken);
    expect(getResponse.status()).toBe(200);
    const getResponseBody = (await getResponse.json()) as ToolSystemPromptDto;
    expect(getResponseBody.toolSystemPrompt).toBe(payload.toolSystemPrompt);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.put('/users/tool-system-prompt', {
      data: { toolSystemPrompt: 'missing-token' },
    });

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

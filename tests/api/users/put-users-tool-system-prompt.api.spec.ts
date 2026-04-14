import { test, expect } from '../fixtures/authFixture';
import { UserClient } from '../../../httpclients/userClient';
import type { ToolSystemPromptDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MAX_PLUS_ONE_PROMPT = 't'.repeat(5001);

test.describe('PUT /api/v1/users/tool-system-prompt', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should update tool system prompt and persist it - 200', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;
    const prompt = 'Call tools before answering domain-specific questions.';

    // when
    const response = await client.updateToolSystemPrompt({ toolSystemPrompt: prompt }, token);

    // then
    expect(response.status()).toBe(200);
    const body: ToolSystemPromptDto = await response.json();
    expect(body.toolSystemPrompt).toBe(prompt);

    const readBack = await client.getToolSystemPrompt(token);
    expect(readBack.status()).toBe(200);
    const readBackBody: ToolSystemPromptDto = await readBack.json();
    expect(readBackBody.toolSystemPrompt).toBe(prompt);
  });

  test('should return bad request for tool system prompt longer than 5000 chars - 400', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;

    // when
    const response = await client.updateToolSystemPrompt({ toolSystemPrompt: MAX_PLUS_ONE_PROMPT }, token);

    // then
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.toolSystemPrompt).toBe('Tool system prompt must be at most 5000 characters');
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.updateToolSystemPrompt({ toolSystemPrompt: 'No auth update' });

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });
});

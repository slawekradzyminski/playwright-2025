import { test, expect } from '../fixtures/authFixture';
import { UserClient } from '../../../httpclients/userClient';
import type { ToolSystemPromptDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('GET /api/v1/users/tool-system-prompt', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should return tool system prompt for authenticated user - 200', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;

    // when
    const response = await client.getToolSystemPrompt(token);

    // then
    expect(response.status()).toBe(200);
    const body: ToolSystemPromptDto = await response.json();
    expect(typeof body.toolSystemPrompt).toBe('string');
    expect(body.toolSystemPrompt.length).toBeGreaterThan(0);
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.getToolSystemPrompt();

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });
});

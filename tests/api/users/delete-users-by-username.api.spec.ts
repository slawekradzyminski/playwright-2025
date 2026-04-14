import { test, expect } from '../fixtures/adminAuthFixture';
import { UserClient } from '../../../httpclients/userClient';
import { registerAndLogin } from '../helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_USERNAME = 'missing-user-delete';

test.describe('DELETE /api/v1/users/{username}', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should allow admin to delete existing user - 204', async ({ request, adminTokens }) => {
    // given
    const targetUser = await registerAndLogin(request);

    // when
    const response = await client.deleteUser(targetUser.user.username, adminTokens.token);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized without JWT token - 401', async ({ request }) => {
    // given
    const targetUser = await registerAndLogin(request);

    // when
    const response = await client.deleteUser(targetUser.user.username);

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('should return forbidden for regular client - 403', async ({ request }) => {
    // given
    const actor = await registerAndLogin(request);
    const targetUser = await registerAndLogin(request);

    // when
    const response = await client.deleteUser(targetUser.user.username, actor.token);

    // then
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.message).toBe('Access denied');
  });

  test('should return not found for missing username when admin deletes - 404', async ({ adminTokens }) => {
    // when
    const response = await client.deleteUser(MISSING_USERNAME, adminTokens.token);

    // then
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toBe("The user doesn't exist");
  });
});

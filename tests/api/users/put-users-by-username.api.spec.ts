import { test, expect } from '../fixtures/adminAuthFixture';
import { UserClient } from '../../../httpclients/userClient';
import { registerAndLogin } from '../../../helpers/authHelper';
import type { UserResponseDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_USERNAME = 'missing-user-put';

test.describe('PUT /api/v1/users/{username}', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should update own user profile - 200', async ({ request }) => {
    // given
    const actor = await registerAndLogin(request);
    const updatedFirstName = `${actor.user.firstName}-updated`;

    // when
    const response = await client.updateUserByUsername(actor.user.username, {
      email: actor.user.email,
      firstName: updatedFirstName,
      lastName: actor.user.lastName
    }, actor.token);

    // then
    expect(response.status()).toBe(200);
    const body: UserResponseDto = await response.json();
    expect(body.username).toBe(actor.user.username);
    expect(body.firstName).toBe(updatedFirstName);
  });

  test('should allow admin to update another user - 200', async ({ request, adminTokens }) => {
    // given
    const targetUser = await registerAndLogin(request);

    // when
    const response = await client.updateUserByUsername(targetUser.user.username, {
      email: targetUser.user.email,
      firstName: targetUser.user.firstName,
      lastName: 'AdminUpdated'
    }, adminTokens.token);

    // then
    expect(response.status()).toBe(200);
    const body: UserResponseDto = await response.json();
    expect(body.username).toBe(targetUser.user.username);
    expect(body.lastName).toBe('AdminUpdated');
  });

  test('should return unauthorized without JWT token - 401', async ({ request }) => {
    // given
    const actor = await registerAndLogin(request);

    // when
    const response = await client.updateUserByUsername(actor.user.username, {
      email: actor.user.email,
      firstName: 'NoAuth',
      lastName: actor.user.lastName
    });

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('should return forbidden when user tries to update another existing user - 403', async ({ request }) => {
    // given
    const actor = await registerAndLogin(request);
    const target = await registerAndLogin(request);

    // when
    const response = await client.updateUserByUsername(target.user.username, {
      email: target.user.email,
      firstName: 'ForbiddenChange',
      lastName: target.user.lastName
    }, actor.token);

    // then
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.message).toBe('Access denied');
  });

  test('should return not found for missing username - 404', async ({ adminTokens }) => {
    // when
    const response = await client.updateUserByUsername(MISSING_USERNAME, {
      email: 'missing-user-put@example.com',
      firstName: 'Missing',
      lastName: 'Username'
    }, adminTokens.token);

    // then
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toBe("The user doesn't exist");
  });
});

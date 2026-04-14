import { test, expect } from '../fixtures/authFixture';
import { UserClient } from '../../../httpclients/userClient';
import type { UserResponseDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const MISSING_USERNAME = 'missing-user-get';

test.describe('GET /api/v1/users/{username}', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should return user details for existing username - 200', async ({ authenticatedUser }) => {
    // given
    const { token, user } = authenticatedUser;

    // when
    const response = await client.getUserByUsername(user.username, token);

    // then
    expect(response.status()).toBe(200);
    const body: UserResponseDto = await response.json();
    expect(body.username).toBe(user.username);
    expect(body.email).toBe(user.email);
    expect(body.firstName).toBe(user.firstName);
    expect(body.lastName).toBe(user.lastName);
    expect(Array.isArray(body.roles)).toBe(true);
  });

  test('should return unauthorized without JWT token - 401', async ({ authenticatedUser }) => {
    // given
    const { user } = authenticatedUser;

    // when
    const response = await client.getUserByUsername(user.username);

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });

  test('should return not found for missing username - 404', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;

    // when
    const response = await client.getUserByUsername(MISSING_USERNAME, token);

    // then
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toBe("The user doesn't exist");
  });
});

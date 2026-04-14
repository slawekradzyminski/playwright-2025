import { test, expect } from '../fixtures/authFixture';
import { UserClient } from '../../../httpclients/userClient';
import type { UserResponseDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

test.describe('GET /api/v1/users', () => {
  let client: UserClient;

  test.beforeEach(async ({ request }) => {
    client = new UserClient(request, APP_BASE_URL);
  });

  test('should return users list for authenticated client - 200', async ({ authenticatedUser }) => {
    // given
    const { token } = authenticatedUser;

    // when
    const response = await client.getUsers(token);

    // then
    expect(response.status()).toBe(200);
    const body: UserResponseDto[] = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
      email: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      roles: expect.any(Array)
    });
  });

  test('should return unauthorized without JWT token - 401', async () => {
    // when
    const response = await client.getUsers();

    // then
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Unauthorized');
  });
});

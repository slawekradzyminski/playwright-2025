import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/common';
import type { UserResponseDto } from '../../types/user';
import { getByUsernameRequest } from './http/getByUsernameRequest';

test.describe('/users/{username} GET API tests', () => {
  test('should return user details by username - 200', async ({ request, clientAuth }) => {
    // when
    const response = await getByUsernameRequest(
      request,
      clientAuth.jwtToken,
      clientAuth.userDetails.username,
    );

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as UserResponseDto;
    expect(responseBody.username).toBe(clientAuth.userDetails.username);
    expect(responseBody.email).toBe(clientAuth.userDetails.email);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/users/some-user');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });

  test('should return not found for missing username - 404', async ({ request, clientAuth }) => {
    // when
    const response = await getByUsernameRequest(
      request,
      clientAuth.jwtToken,
      `missing-user-${Date.now()}`,
    );

    // then
    expect(response.status()).toBe(404);
  });
});

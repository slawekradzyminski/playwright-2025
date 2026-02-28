import { test, expect } from '../fixtures/auth.fixture';
import type { ErrorResponse } from '../../types/auth';
import { logoutRequest } from './http/logoutRequest';

test.describe('/users/logout API tests', () => {
  test('should logout authenticated user - 200', async ({ request, authenticatedUser }) => {
    // when
    const response = await logoutRequest(request, authenticatedUser.jwtToken);

    // then
    expect(response.status()).toBe(200);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.post('/users/logout');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

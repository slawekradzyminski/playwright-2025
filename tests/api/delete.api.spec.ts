import { test, expect } from '../fixtures/auth.fixture';
import { generateUser } from '../../generators/userGenerator';
import type { ErrorResponse } from '../../types/common';
import { deleteRequest } from './http/deleteRequest';
import { signupRequest } from './http/signupRequest';

test.describe('/users/{username} DELETE API tests', () => {
  test('should delete user with admin token - 204', async ({ request, adminAuth }) => {
    // given
    const targetUser = generateUser();
    const signupResponse = await signupRequest(request, targetUser);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await deleteRequest(request, adminAuth.jwtToken, targetUser.username);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.delete('/users/some-user');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });

  test('should return forbidden for non-admin user - 403', async ({ request, clientAuth }) => {
    // given
    const targetUser = generateUser();
    const signupResponse = await signupRequest(request, targetUser);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await deleteRequest(request, clientAuth.jwtToken, targetUser.username);

    // then
    expect(response.status()).toBe(403);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return not found for missing username - 404', async ({ request, adminAuth }) => {
    // when
    const response = await deleteRequest(request, adminAuth.jwtToken, `missing-user-${Date.now()}`);

    // then
    expect(response.status()).toBe(404);
  });
});

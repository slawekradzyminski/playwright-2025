import { test, expect } from '../../fixtures/auth.fixture';
import { generateUser } from '../../../generators/userGenerator';
import type { ErrorResponse } from '../../../types/common';
import type { UserEditDto, UserEntity } from '../../../types/user';
import { editRequest } from '../../../http/users/editRequest';
import { signupRequest } from '../../../http/users/signupRequest';

test.describe('/users/{username} PUT API tests', () => {
  test('should update user with admin token - 200', async ({ request, adminAuth }) => {
    // given
    const targetUser = generateUser();
    const signupResponse = await signupRequest(request, targetUser);
    expect(signupResponse.status()).toBe(201);

    const payload: UserEditDto = {
      email: targetUser.email,
      firstName: 'UpdatedFirst',
      lastName: 'UpdatedLast',
    };

    // when
    const response = await editRequest(request, adminAuth.jwtToken, targetUser.username, payload);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as UserEntity;
    expect(responseBody.username).toBe(targetUser.username);
    expect(responseBody.firstName).toBe(payload.firstName);
    expect(responseBody.lastName).toBe(payload.lastName);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.put('/users/some-user', {
      data: { email: 'user@example.com' },
    });

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
    const response = await editRequest(request, clientAuth.jwtToken, targetUser.username, {
      email: targetUser.email,
      firstName: 'ForbiddenName',
      lastName: 'ForbiddenLast',
    });

    // then
    expect(response.status()).toBe(403);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return not found for missing username - 404', async ({ request, adminAuth }) => {
    // when
    const response = await editRequest(request, adminAuth.jwtToken, `missing-user-${Date.now()}`, {
      email: 'missing@example.com',
      firstName: 'Missing',
      lastName: 'User',
    });

    // then
    expect(response.status()).toBe(404);
  });
});

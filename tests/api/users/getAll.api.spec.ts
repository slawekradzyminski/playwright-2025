import { test, expect } from '../../fixtures/auth.fixture';
import type { ErrorResponse } from '../../../types/common';
import type { UserResponseDto } from '../../../types/user';
import { getAllRequest } from '../../../http/users/getAllRequest';

test.describe('/users GET API tests', () => {
  test('should return all users for authenticated user - 200', async ({
    request,
    clientAuth,
  }) => {
    // when
    const response = await getAllRequest(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = (await response.json()) as UserResponseDto[];
    expect(Array.isArray(responseBody)).toBe(true);
    expect(
      responseBody.every(
        (user) =>
          typeof user.id === 'number' &&
          typeof user.username === 'string' &&
          typeof user.email === 'string' &&
          Array.isArray(user.roles),
      ),
    ).toBe(true);
    expect(responseBody.some((user) => user.username === clientAuth.userDetails.username)).toBe(
      true,
    );
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // when
    const response = await request.get('/users');

    // then
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    const responseBody = (await response.json()) as ErrorResponse;
    expect(typeof responseBody.message).toBe('string');
    expect(responseBody.message).toBeTruthy();
  });
});

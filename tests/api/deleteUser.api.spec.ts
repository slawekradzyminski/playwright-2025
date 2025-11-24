import { test, expect } from '../../fixtures/apiAuthFixture';
import { deleteUser } from '../../http/deleteUserRequest';
import { attemptSignup } from '../../http/signupRequest';
import { generateClientUser } from '../../generators/userGenerator';
import type { UserRegisterDto } from '../../types/auth';
import { INVALID_TOKEN } from '../../config/constants';

test.describe('DELETE /users/{username} API tests', () => {
  test('admin should delete an arbitrary user - 204', async ({ request, adminAuth }) => {
    // given
    const targetUser: UserRegisterDto = generateClientUser();
    const signupResponse = await attemptSignup(request, targetUser);
    expect(signupResponse.status()).toBe(201);

    // when
    const response = await deleteUser(request, targetUser.username, adminAuth.token);

    // then
    expect(response.status()).toBe(204);
  });

  test('should return unauthorized for missing token - 401', async ({ request, clientAuth }) => {
    // when
    const response = await deleteUser(request, clientAuth.userData.username);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request, clientAuth }) => {
    // when
    const response = await deleteUser(request, clientAuth.userData.username, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden when client deletes own account - 403', async ({ request, clientAuth }) => {
    // when
    const response = await deleteUser(request, clientAuth.userData.username, clientAuth.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for missing user - 404', async ({ request, adminAuth }) => {
    // when
    const response = await deleteUser(request, 'missing-user-1234', adminAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

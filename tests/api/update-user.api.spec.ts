import { test, expect } from '../../fixtures/apiAuthFixture';
import type { UserEntityDto, UserEditDto } from '../../types/user';
import { updateUser } from '../../http/updateUserClient';
import { generateRandomUserWithRole } from '../../generators/userGenerator';
import { attemptRegistration } from '../../http/registerClient';

test.describe('/users/{username} PUT API tests', () => {
  test('should update user when data is valid - 200', async ({ request, authenticatedAdmin }) => {
    // given
    const userToUpdate = generateRandomUserWithRole('ROLE_CLIENT');
    await attemptRegistration(request, userToUpdate);

    const updatePayload: UserEditDto = {
      email: `updated-${userToUpdate.username}@example.com`,
      firstName: 'UpdatedFirst',
      lastName: 'UpdatedLast'
    };

    // when
    const response = await updateUser(request, userToUpdate.username, updatePayload, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserEntityDto = await response.json();
    expect(responseBody.username).toBe(userToUpdate.username);
    expect(responseBody.email).toBe(updatePayload.email);
    expect(responseBody.firstName).toBe(updatePayload.firstName);
    expect(responseBody.lastName).toBe(updatePayload.lastName);
    expect(responseBody.roles).toEqual(userToUpdate.roles);
    expect(responseBody.systemPrompt ?? null).toBeNull();
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const updatePayload: UserEditDto = {
      email: 'unauthorized@example.com',
      firstName: 'NoAuth',
      lastName: 'User'
    };

    // when
    const response = await updateUser(request, 'anyuser', updatePayload);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return forbidden error when user lacks permissions - 403', async ({ request, authenticatedClient }) => {
    // given
    const updatePayload: UserEditDto = {
      email: 'forbidden@example.com'
    };

    // when
    const response = await updateUser(request, 'admin', updatePayload, authenticatedClient.token);

    // then
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Access denied');
  });

  test('should return not found when user does not exist - 404', async ({ request, authenticatedAdmin }) => {
    // given
    const updatePayload: UserEditDto = {
      email: 'missing@example.com',
      firstName: 'Missing',
      lastName: 'User'
    };
    const nonExistingUsername = `non-existing-user-${Date.now()}`;

    // when
    const response = await updateUser(request, nonExistingUsername, updatePayload, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.message).toBe("The user doesn't exist");
  });
});

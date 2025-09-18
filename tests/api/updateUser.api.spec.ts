import { test, expect } from '../../fixtures/apiAuth';
import { updateUser } from '../../http/updateUserClient';
import type { UserEditDto, UserEntity } from '../../types/auth';

test.describe('/users/{username} PUT API tests', () => {
  test('should update user details when user updates own profile - 200', async ({ apiAuth }) => {
    // given
    const username = apiAuth.user.username;
    const updateData: UserEditDto = {
      email: `updated-${apiAuth.user.email}`,
      firstName: 'UpdatedFirst',
      lastName: 'UpdatedLast'
    };

    // when
    const response = await updateUser(apiAuth.request, username, updateData, apiAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserEntity = await response.json();
    expect(responseBody.email).toBe(updateData.email);
    expect(responseBody.firstName).toBe(updateData.firstName);
    expect(responseBody.lastName).toBe(updateData.lastName);
    expect(responseBody.username).toBe(username);
  });

  test('should update user details when admin updates any user - 200', async ({ apiAuth, apiAuthAdmin }) => {
    // given
    const targetUsername = apiAuth.user.username;
    const updateData: UserEditDto = {
      email: `admin-updated-${apiAuth.user.email}`,
      firstName: 'AdminUpdatedFirst',
      lastName: 'AdminUpdatedLast'
    };

    // when
    const response = await updateUser(apiAuthAdmin.request, targetUsername, updateData, apiAuthAdmin.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: UserEntity = await response.json();
    expect(responseBody.email).toBe(updateData.email);
    expect(responseBody.firstName).toBe(updateData.firstName);
    expect(responseBody.lastName).toBe(updateData.lastName);
    expect(responseBody.username).toBe(targetUsername);
  });

  test('should return validation error for invalid email format - 400', async ({ apiAuth }) => {
    // given
    const username = apiAuth.user.username;
    const invalidUpdateData: UserEditDto = {
      email: 'invalid-email-format'
    };

    // when
    const response = await updateUser(apiAuth.request, username, invalidUpdateData, apiAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized for missing token - 401', async ({ request, apiAuth }) => {
    // given
    const username = apiAuth.user.username;
    const updateData: UserEditDto = {
      email: 'test@example.com'
    };

    // when
    const response = await request.put(`http://localhost:4001/users/${username}`, {
      data: updateData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden when non-admin user tries to update another user - 403', async ({ apiAuth, apiAuthAdmin }) => {
    // given
    const targetUsername = apiAuthAdmin.user.username;
    const updateData: UserEditDto = {
      email: 'forbidden@example.com'
    };

    // when
    const response = await updateUser(apiAuth.request, targetUsername, updateData, apiAuth.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found for non-existent username - 404', async ({ apiAuth }) => {
    // given
    const nonExistentUsername = 'nonexistentuser99999';
    const updateData: UserEditDto = {
      email: 'test@example.com'
    };

    // when
    const response = await updateUser(apiAuth.request, nonExistentUsername, updateData, apiAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});

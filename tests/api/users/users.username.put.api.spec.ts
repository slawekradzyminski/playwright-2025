import { expect, test } from '../../../fixtures/adminApiFixture';
import { randomUserEdit } from '../../../generators/userGenerator';
import { expectJsonResponse } from '../../../helpers/apiAssertions';
import { expectUserProfile } from '../../../helpers/userHelpers';
import { UsersClient } from '../../../httpclients/usersClient';
import type { UserEditDto, UserResponseDto } from '../../../types/auth';

test.describe('PUT /api/v1/users/{username} API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should update own profile as owner - 200', async ({ createDisposableApiUser }) => {
    // given
    const user = await createDisposableApiUser();
    const userUpdate = randomUserEdit();

    // when
    const response = await usersClient.updateUser(user.userData.username, userUpdate, user.token);

    // then
    const responseBody = await expectJsonResponse<UserResponseDto>(response, 200);
    expectUserProfile(responseBody, {
      username: user.userData.username,
      roles: ['ROLE_CLIENT'],
      ...userUpdate
    });

    const getResponse = await usersClient.getUserByUsername(user.userData.username, user.token);
    const getResponseBody = await expectJsonResponse<UserResponseDto>(getResponse, 200);
    expectUserProfile(getResponseBody, {
      username: user.userData.username,
      roles: ['ROLE_CLIENT'],
      ...userUpdate
    });
  });

  test('should update another user profile as admin - 200', async ({ adminApiUser, createDisposableApiUser }) => {
    // given
    const user = await createDisposableApiUser();
    const userUpdate = randomUserEdit();

    // when
    const response = await usersClient.updateUser(user.userData.username, userUpdate, adminApiUser.token);

    // then
    const responseBody = await expectJsonResponse<UserResponseDto>(response, 200);
    expectUserProfile(responseBody, {
      username: user.userData.username,
      roles: ['ROLE_CLIENT'],
      ...userUpdate
    });
  });

  test('should return validation error for invalid email - 400', async ({ createDisposableApiUser }) => {
    // given
    const user = await createDisposableApiUser();
    const userUpdate: UserEditDto = {
      email: 'invalid-email'
    };

    // when
    const response = await usersClient.updateUser(user.userData.username, userUpdate, user.token);

    // then
    const responseBody = await expectJsonResponse<{ email: string }>(response, 400);
    expect(responseBody.email).toBe('Email should be valid');
  });

  test('should return forbidden when other user updates profile - 403', async ({ createDisposableApiUser }) => {
    // given
    const targetUser = await createDisposableApiUser();
    const otherUser = await createDisposableApiUser();

    // when
    const response = await usersClient.updateUser(targetUser.userData.username, randomUserEdit(), otherUser.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found when user does not exist - 404', async ({ adminApiUser }) => {
    // given
    const missingUsername = `missing-user-${Date.now()}`;

    // when
    const response = await usersClient.updateUser(missingUsername, randomUserEdit(), adminApiUser.token);

    // then
    expect(response.status()).toBe(404);
  });
});

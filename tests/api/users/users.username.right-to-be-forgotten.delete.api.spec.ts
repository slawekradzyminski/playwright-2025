import { expect, test } from '../../../fixtures/adminApiFixture';
import { UsersClient } from '../../../httpclients/usersClient';

test.describe('DELETE /api/v1/users/{username}/right-to-be-forgotten API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should delete own account and data as owner - 204', async ({ adminApiUser, createDisposableApiUser }) => {
    // given
    const user = await createDisposableApiUser();

    // when
    const response = await usersClient.deleteUserRightToBeForgotten(user.userData.username, user.token);

    // then
    expect(response.status()).toBe(204);

    const getDeletedUserResponse = await usersClient.getUserByUsername(user.userData.username, adminApiUser.token);
    expect(getDeletedUserResponse.status()).toBe(404);
  });

  test('should delete another user account and data as admin - 204', async ({
    adminApiUser,
    createDisposableApiUser
  }) => {
    // given
    const user = await createDisposableApiUser();

    // when
    const response = await usersClient.deleteUserRightToBeForgotten(user.userData.username, adminApiUser.token);

    // then
    expect(response.status()).toBe(204);

    const getDeletedUserResponse = await usersClient.getUserByUsername(user.userData.username, adminApiUser.token);
    expect(getDeletedUserResponse.status()).toBe(404);
  });

  test('should return forbidden when other user deletes account and data - 403', async ({
    createDisposableApiUser
  }) => {
    // given
    const targetUser = await createDisposableApiUser();
    const otherUser = await createDisposableApiUser();

    // when
    const response = await usersClient.deleteUserRightToBeForgotten(targetUser.userData.username, otherUser.token);

    // then
    expect(response.status()).toBe(403);
  });
});

import { expect, test } from '../../../fixtures/adminApiFixture';
import { UsersClient } from '../../../httpclients/usersClient';

test.describe('DELETE /api/v1/users/{username} API tests', () => {
  let usersClient: UsersClient;

  test.beforeEach(async ({ request }) => {
    usersClient = new UsersClient(request);
  });

  test('should delete disposable user as admin - 204', async ({ adminApiUser, createDisposableApiUser }) => {
    // given
    const user = await createDisposableApiUser();

    // when
    const response = await usersClient.deleteUser(user.userData.username, adminApiUser.token);

    // then
    expect(response.status()).toBe(204);

    const getDeletedUserResponse = await usersClient.getUserByUsername(user.userData.username, adminApiUser.token);
    expect(getDeletedUserResponse.status()).toBe(404);
  });

  test('should return forbidden when other user deletes profile - 403', async ({
    clientApiUser,
    createDisposableApiUser
  }) => {
    // given
    const user = await createDisposableApiUser();

    // when
    const response = await usersClient.deleteUser(user.userData.username, clientApiUser.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found when user does not exist - 404', async ({ adminApiUser }) => {
    // given
    const missingUsername = `missing-user-${Date.now()}`;

    // when
    const response = await usersClient.deleteUser(missingUsername, adminApiUser.token);

    // then
    expect(response.status()).toBe(404);
  });
});

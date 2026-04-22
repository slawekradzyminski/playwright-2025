import { randomUUID } from 'node:crypto';
import { expect, test } from '../../../fixtures/adminUiFixture';
import { expectJsonResponse } from '../../../helpers/apiAssertions';
import { UsersClient } from '../../../httpclients/usersClient';
import { EditUserPage } from '../../../pages/editUserPage';
import { UsersPage } from '../../../pages/usersPage';
import type { UserResponseDto } from '../../../types/auth';

test.describe('Edit user admin UI tests', () => {
  let editUserPage: EditUserPage;
  let usersClient: UsersClient;
  let usersPage: UsersPage;

  test.beforeEach(async ({ page, request }) => {
    editUserPage = new EditUserPage(page);
    usersClient = new UsersClient(request);
    usersPage = new UsersPage(page);
  });

  test('should show not found state for missing user', async () => {
    // given
    const missingUsername = 'does-not-exist-phase4a';

    // when
    await editUserPage.open(missingUsername);

    // then
    await editUserPage.assertThatUrlIs(EditUserPage.urlPattern);
    await editUserPage.assertThatNotFoundIsVisible();
  });

  test('should load existing values before editing user', async ({ clientApiUser }) => {
    // given

    // when
    await editUserPage.open(clientApiUser.userData.username);

    // then
    await editUserPage.assertThatUrlIs(EditUserPage.urlPattern);
    await editUserPage.assertThatEditFormIsVisible(clientApiUser.userData.username);
    await editUserPage.assertThatUserValuesAreFilled(clientApiUser.userData);
  });

  test('should show required validation when email is empty', async ({ clientApiUser }) => {
    // given
    await editUserPage.open(clientApiUser.userData.username);
    await editUserPage.assertThatEditFormIsVisible(clientApiUser.userData.username);

    // when
    await editUserPage.clearEmailAndSubmit();

    // then
    await editUserPage.assertThatUrlIs(EditUserPage.urlPattern);
    await editUserPage.assertThatEmailFieldIsRequired();
  });

  test('should save user changes through admin edit route', async ({ adminApiUser, clientApiUser }) => {
    // given
    const updatedEmail = `edited.${randomUUID()}@example.com`;
    const updatedFirstName = `Edit${randomUUID().slice(0, 8)}`;
    await editUserPage.open(clientApiUser.userData.username);
    await editUserPage.assertThatEditFormIsVisible(clientApiUser.userData.username);

    // when
    await editUserPage.updateUser(clientApiUser.userData.username, {
      email: updatedEmail,
      firstName: updatedFirstName,
      lastName: clientApiUser.userData.lastName
    });

    // then
    await usersPage.assertThatUrlIs(UsersPage.url);
    await usersPage.assertThatUsersPageIsVisible();
    await usersPage.assertThatUserIsVisible({
      fullName: `${updatedFirstName} ${clientApiUser.userData.lastName}`,
      email: updatedEmail,
      username: clientApiUser.userData.username,
      role: 'ROLE_CLIENT'
    });

    const userResponse = await usersClient.getUserByUsername(clientApiUser.userData.username, adminApiUser.token);
    const savedUser = await expectJsonResponse<UserResponseDto>(userResponse, 200);
    expect(savedUser.email).toBe(updatedEmail);
    expect(savedUser.firstName).toBe(updatedFirstName);
  });
});

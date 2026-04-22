import { test } from '../../../fixtures/adminUiFixture';
import { UsersPage } from '../../../pages/usersPage';

test.describe('Users admin UI tests', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
  });

  test('should display edit and delete actions for admin user', async ({ clientApiUser }) => {
    // given

    // when
    await usersPage.open();

    // then
    await usersPage.assertThatUrlIs(UsersPage.url);
    await usersPage.assertThatUsersPageIsVisible();
    await usersPage.assertThatUserIsVisible({
      fullName: `${clientApiUser.userData.firstName} ${clientApiUser.userData.lastName}`,
      email: clientApiUser.userData.email,
      username: clientApiUser.userData.username,
      role: 'ROLE_CLIENT'
    });
    await usersPage.assertThatUserActionsAreVisible(clientApiUser.userData.username);
  });
});

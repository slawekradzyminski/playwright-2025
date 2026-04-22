import { test } from '../../fixtures/authenticatedUiUserFixture';
import { UsersPage } from '../../pages/usersPage';

test.describe('Users UI tests', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
  });

  test('should display users list for authenticated client without admin actions', async ({ authenticatedUiUser }) => {
    // given

    // when
    await usersPage.open();

    // then
    await usersPage.assertThatUrlIs(UsersPage.url);
    await usersPage.assertThatUsersPageIsVisible();
    await usersPage.assertThatUserIsVisible({
      fullName: `${authenticatedUiUser.userData.firstName} ${authenticatedUiUser.userData.lastName}`,
      email: authenticatedUiUser.userData.email,
      username: authenticatedUiUser.userData.username,
      role: 'ROLE_CLIENT'
    });
    await usersPage.assertThatUserIsVisible({
      fullName: 'Slawomir Radzyminski',
      email: 'awesome@testing.com',
      username: 'admin',
      role: 'ROLE_ADMIN'
    });
    await usersPage.assertThatNoRowActionsAreVisible();
  });
});

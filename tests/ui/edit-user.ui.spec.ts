import { test } from '../../fixtures/authenticatedUiUserFixture';
import { EditUserPage } from '../../pages/editUserPage';

test.describe('Edit user UI tests', () => {
  let editUserPage: EditUserPage;

  test.beforeEach(async ({ page }) => {
    editUserPage = new EditUserPage(page);
  });

  test('should show access denied state for client user', async () => {
    // given

    // when
    await editUserPage.open('admin');

    // then
    await editUserPage.assertThatUrlIs(EditUserPage.urlPattern);
    await editUserPage.assertThatAccessDeniedIsVisible();
  });
});

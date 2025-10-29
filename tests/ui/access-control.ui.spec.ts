import { test } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/homePage';
import { FRONTEND_URL } from '../../config/constants';

test.describe('Client access control', () => {
  test('should hide admin navigation and redirect when client visits admin dashboard', async ({ page, authenticatedUIClient: _authenticatedUIClient }) => {
    // given
    const homePage = new HomePage(page);

    // then
    await homePage.header.expectAdminLinkHidden();

    // when
    await page.goto(`${FRONTEND_URL}/admin`);

    // then
    await homePage.expectOnPage();
  });
});

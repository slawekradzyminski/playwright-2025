import { test, expect } from '../fixtures/ui-auth.fixture';
import { HOME_URL } from './constants/ui.urls.constants';
import { HomePage } from './pages/home.page';

test.describe('Home UI tests', () => {
  test('should show authenticated user email on homepage', async ({ authenticatedPage, clientAuth }) => {
    // given
    const homePage = new HomePage(authenticatedPage);

    // then
    await expect(authenticatedPage).toHaveURL(HOME_URL);
    await expect(homePage.userEmail).toHaveText(clientAuth.userDetails.email);
  });
});

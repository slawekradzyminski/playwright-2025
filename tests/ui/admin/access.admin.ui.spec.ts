import { expect, test } from '@playwright/test';
import { createAuthenticatedUser } from '../../../helpers/authenticationHelpers';
import { injectBrowserAuth } from '../../../helpers/browserAuthHelpers';
import { AdminProductsPage } from '../../../pages/admin/adminProductsPage';
import { HomePage } from '../../../pages/homePage';

test.describe('Admin access UI tests', () => {
  test('should redirect client user away from admin product list', async ({ page, request }) => {
    // given
    const clientUser = await createAuthenticatedUser(request);
    await injectBrowserAuth(page, clientUser);

    // when
    await page.goto(AdminProductsPage.url);

    // then
    await expect(page).toHaveURL(HomePage.url);
  });
});

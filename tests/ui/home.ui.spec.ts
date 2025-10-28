import { test } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/homePage';

test.describe('Home UI tests', () => {
  test('should display authenticated admin user email', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when

    // then
    await homePage.expectUserEmail(authenticatedUIAdmin.userData.email);
  });

});

import { test } from '../../fixtures/ui.auth.fixture';
import { HomePage } from '../../pages/HomePage';

test.describe('Home UI tests', () => {
  test('should display all header navigation elements after login', async ({ loggedInPage, authToken, userDetails }) => {
    // given
    const homePage = new HomePage(loggedInPage);
    
    // when
    await homePage.goto();

    // then
    await homePage.expectHeaderLinksToBeVisible();
    await homePage.expectUserProfileLinkToContainName(userDetails.firstName, userDetails.lastName);
  });
});

import { test, expect } from '../../fixtures/auth.fixtures';
import { HomePage } from '../../pages/HomePage';

test.describe('Home Page', () => {
  test('should be logged in as client user', async ({ page, loggedInClient }) => {
    // when
    const homePage = new HomePage(page);
    
    // then
    await homePage.expectSuccessfulLogin(
      loggedInClient.user.firstName,
      loggedInClient.user.email,
      loggedInClient.user.lastName
    );
  });
});

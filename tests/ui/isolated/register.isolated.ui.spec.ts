import {  test } from '@playwright/test';
import { generateUser } from '../../../generators/userGenerator';
import { LoginPage } from '../../../pages/LoginPage';
import { RegisterPage } from '../../../pages/RegisterPage';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register new user', async ( { page } ) => {
    // given
     await page.route('**/users/signup', async route => {
      await route.fulfill({
        status: 201,
      });
    });
    const loginPage = new LoginPage(page)
    const user = generateUser();

    // when
    await registerPage.register(user);

    // then
    await loginPage.expectToBeOnPage(LoginPage.url);
    await loginPage.toast.expectSuccessToastMessageToHaveText('Registration successful! You can now log in.');
  });

});

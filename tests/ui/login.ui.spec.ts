import { expect, test } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../config/constants';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async () => {
    // given
    const homePage = new HomePage(loginPage.page);
    const credentials: LoginDto = {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToLeavePage(LoginPage.url);
    await expect(homePage.welcomeMessage).toBeVisible();
    await homePage.expectToBeOnPage(HomePage.url);
  });

  test('should show error for empty password', async () => {
    // given
    const credentials: LoginDto = {
      username: ADMIN_USERNAME,
      password: ''
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnPage(LoginPage.url);
    await loginPage.expectPasswordErrorToHaveText('Password is required');
  });

  test('should show error for invalid credentials', async () => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnPage(LoginPage.url);
    await loginPage.toast.expectErrorToastMessageToHaveText('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async () => {
    // given
    const registerPage = new RegisterPage(loginPage.page);

    // when
    await loginPage.clickRegisterButton();

    // then
    await loginPage.expectToBeOnPage(RegisterPage.url);
    await expect(registerPage.createAccountButton).toBeVisible();
  });

  test('should navigate to register page when register link is clicked', async () => {
    // given
    const registerPage = new RegisterPage(loginPage.page);

    // when
    await loginPage.clickRegisterNavigationLink();

    // then
    await loginPage.expectToBeOnPage(RegisterPage.url);
    await expect(registerPage.createAccountButton).toBeVisible();
  });

  test('should have proper form validation for short username', async () => {
    // given
    const credentials: LoginDto = {
      username: 'abc',
      password: ADMIN_PASSWORD
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnPage(LoginPage.url);
  });

}); 

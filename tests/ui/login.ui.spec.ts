import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { LoginPage } from '../../pages/loginPage';
import { RegisterPage } from '../../pages/registerPage';
import { HomePage } from '../../pages/homePage';

test.describe('Login UI tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(loginPage.homepageUrl);
    await expect(homePage.emailParagraph).toBeVisible();
    await expect(homePage.emailParagraph).toHaveText('awesome@testing.com');
  });

  test('should show error for empty password', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    const credentials = {
      username: 'admin',
      password: ''
    };

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.passwordErrorAlert).toBeVisible();
    await expect(loginPage.passwordErrorAlert).toHaveText('Password is required');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.toastNotification).toBeVisible();
    await expect(loginPage.toastNotification).toContainText('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    // when
    await loginPage.clickLoginRegisterLink();

    // then
    await expect(page).toHaveURL(registerPage.url);
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    // when
    await loginPage.clickRegisterLink();

    // then
    await expect(page).toHaveURL(registerPage.url);
  });

  test('should have proper form validation for short username', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    const credentials = {
      username: 'abc',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.usernameErrorAlert).toBeVisible();
    await expect(loginPage.usernameErrorAlert).toHaveText('Username must be at least 4 characters');
  });

}); 
import { test, expect } from '@playwright/test';
import { generateUserData } from '../../generators/userGenerator';
import { RegisterPage } from '../../pages/registerPage';
import { LoginPage } from '../../pages/loginPage';
import { attemptRegistration } from '../../http/registerClient';

test.describe('Register UI tests', () => {
  test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register a new user', async ({ page }) => {
    // given
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const user = generateUserData(['ROLE_CLIENT']);

    // when
    await registerPage.register(user);

    // then
    await expect(page).toHaveURL(loginPage.url);
    await expect(registerPage.toastNotification).toBeVisible();
    await expect(registerPage.toastNotification).toContainText('Registration successful');
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // given
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // when
    await registerPage.clickLoginLink();

    // then
    await expect(page).toHaveURL(loginPage.url);
  });

  test('should navigate to login page when sign in button is clicked', async ({ page }) => {
    // given
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    // when
    await registerPage.clickRegisterLoginLink();

    // then
    await expect(page).toHaveURL(loginPage.url);
  });

  test('should show error for duplicate username', async ({ page, request }) => {
    // given
    const registerPage = new RegisterPage(page);
    const user = generateUserData(['ROLE_CLIENT']);
    await attemptRegistration(request, user);

    // when
    await registerPage.register(user);

    // then
    await expect(page).toHaveURL(registerPage.url);
    await expect(registerPage.toastNotification).toBeVisible();
    await expect(registerPage.toastNotification).toContainText('Username already exists');
  });
});


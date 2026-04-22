import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { ADMIN_PASSWORD } from '../../config/constants';
import { HomePage } from '../../pages/homePage';
import { LoginPage } from '../../pages/loginPage';
import { RegisterPage } from '../../pages/registerPage';
import type { LoginDto } from '../../types/auth';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.assertThatLoginFormIsVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: ADMIN_PASSWORD
    };

    // when
    await loginPage.login(credentials);

    // then
    const homePage = new HomePage(page);
    await homePage.assertThatUrlIs(HomePage.url);
    await homePage.assertThatHomePageIsVisible();
  });

  test('should show error for empty password', async () => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: ''
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.assertThatUrlIs(LoginPage.url);
    await loginPage.assertThatCredentialsAreFilled(credentials);
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
    await loginPage.assertThatUrlIs(LoginPage.url);
    await loginPage.assertThatCredentialsAreFilled(credentials);
    await loginPage.assertThatLoginFormIsVisible();
  });

  test('should show error toast for invalid credentials', async () => {
    // given
    const credentials: LoginDto = {
      username: `wronguser-${randomUUID()}`,
      password: 'wrongpassword'
    };

    // when
    await loginPage.loginAndWaitForSignInResponse(credentials);

    // then
    await loginPage.assertThatUrlIs(LoginPage.url);
    await loginPage.toast.assertThatErrorToastContainsText('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await loginPage.clickRegisterButton();

    // then
    const registerPage = new RegisterPage(page);
    await registerPage.assertThatUrlIs(RegisterPage.url);
    await registerPage.assertThatRegisterFormIsVisible();
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await loginPage.loggedOutHeader.clickRegisterLink();

    // then
    const registerPage = new RegisterPage(page);
    await registerPage.assertThatUrlIs(RegisterPage.url);
    await registerPage.assertThatRegisterFormIsVisible();
  });
});

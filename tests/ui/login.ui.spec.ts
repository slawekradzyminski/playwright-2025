import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { generateValidUser } from '../../generators/userGenerator';
import { signup } from '../../http/registrationClient';
import { LoginPage, HomePage } from '../../pages';
import { FRONTEND_URL } from '../../pages/constants';

test.describe('Login UI tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({ page, request }) => {
    // given
    const user = generateValidUser();
    await signup(request, user);
    const credentials: LoginDto = {
      username: user.username,
      password: user.password
    };
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    // when
    await loginPage.login(credentials);

    // then
    await homePage.expectSuccessfulLogin(user.firstName, user.email, user.lastName);
  });

  test('should show error for empty username', async ({ page }) => {
    // given
    const credentials = {
      username: '',
      password: 'admin'
    };
    const loginPage = new LoginPage(page);

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectUsernameRequiredError();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };
    const loginPage = new LoginPage(page);

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectInvalidCredentialsError();
  });

  test('should have proper form validation for short username', async ({ page }) => {
    // given
    const credentials = {
      username: 'abc',
      password: 'admin'
    };
    const loginPage = new LoginPage(page);

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectShortUsernameError();
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);

    // when
    await loginPage.clickRegisterLink();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/register`);
  });

}); 
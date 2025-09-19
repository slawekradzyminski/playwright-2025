import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { LoginPage } from '../../pages/loginPage';
import { HomePage } from '../../pages/homePage';
import { randomClient } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/signupClient';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({ page, request }) => {
    // given
    const user = randomClient();
    await attemptSignup(request, user);
    const credentials: LoginDto = {
      username: user.username,
      password: user.password
    };
    const homePage = new HomePage(page);

    // when
    await loginPage.login(credentials);

    // then
    await homePage.verifyUserEmail(user.email);
    await homePage.expectToBeOnHomePage();
  });

  test('should show error for empty username', async () => {
    // given
    const credentials = {
      username: '',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectUsernameRequiredError();
  });

  test('should show error for empty password', async () => {
    // given
    const credentials = {
      username: 'admin',
      password: ''
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectPasswordRequiredError();
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
    await loginPage.expectToBeOnLoginPage();
    await loginPage.toast.verifyErrorMessage('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async () => {
    // given
    // when
    await loginPage.clickRegisterButton();

    // then
    await loginPage.expectToBeOnRegisterPage();
  });

  test('should navigate to register page when register link is clicked', async () => {
    // given
    // when
    await loginPage.clickRegisterLink();

    // then
    await loginPage.expectToBeOnRegisterPage();
  });

  test('should have proper form validation for short username', async () => {
    // given
    const credentials = {
      username: 'abc',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectUsernameMinLengthError();
  });

  test('should show both username and password required errors when both fields are empty', async () => {
    // given
    // when
    await loginPage.clickSignIn();

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectUsernameRequiredError();
    await loginPage.expectPasswordRequiredError();
  });

}); 
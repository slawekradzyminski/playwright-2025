import { test } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import type { LoginDto } from '../../types/auth';
import { generateRandomUser } from '../../generators/userGenerator';  
import { attemptRegistration } from '../../http/registerClient';
import { HomePage } from '../../pages/homePage';
import { RegisterPage } from '../../pages/registerPage';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto('login');
  });

  test('should successfully login with valid credentials', async ({ request, page }) => {
    // given
    const randomUser = generateRandomUser();
    await attemptRegistration(request, randomUser);
    const credentials: LoginDto = {
      username: randomUser.username,
      password: randomUser.password
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectNotOnPage('login');
    const homePage = new HomePage(page);
    await homePage.expectUserEmail(randomUser.email);
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
    await loginPage.expectOnPage();
    await loginPage.expectUsernameError('Username must be at least 4 characters');
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
    await loginPage.expectOnPage();
    await loginPage.expectPasswordError('Password is required');
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
    await loginPage.expectOnPage();
    await loginPage.expectErrorToastMessage('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // given
    // when
    await loginPage.clickRegisterButton();

    // then
    const registerPage = new RegisterPage(page);
    await registerPage.expectOnPage();
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // given
    // when
    await loginPage.clickRegisterLink();

    // then
    const registerPage = new RegisterPage(page);
    await registerPage.expectOnPage();
  });

}); 
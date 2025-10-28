import { test } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import type { LoginDto } from '../../types/auth';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto('login');
  });

  test('should successfully login with valid credentials', async () => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectNotOnPage('login');
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
    await loginPage.expectOnPage('login');
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
    await loginPage.expectOnPage('login');
  });

  test('should navigate to register page when register button is clicked', async () => {
    // given
    // when
    await loginPage.clickRegisterButton();

    // then
    await loginPage.expectOnPage('register');
  });

  test('should navigate to register page when register link is clicked', async () => {
    // given
    // when
    await loginPage.clickRegisterLink();

    // then
    await loginPage.expectOnPage('register');
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
    await loginPage.expectOnPage('login');
  });

}); 
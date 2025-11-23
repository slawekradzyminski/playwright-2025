import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { UI_BASE_URL } from '../../config/constants';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { generateRandomClientUser } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/users/signupRequest';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({ page, request }) => {
    // given
    const randomUser = generateRandomClientUser();  
    await attemptSignup(request, randomUser);
    const credentials: LoginDto = {
      username: randomUser.username,
      password: randomUser.password
    };
    const homePage = new HomePage(page);

    // when
    await loginPage.login(credentials);

    // then
    await homePage.expectToBeOnHomePage();
    await homePage.expectWelcomeMessage();
    await homePage.header.expectLogoutButtonVisible();
  });

  test('should show error for empty password', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: ''
    };

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/login`);
    await loginPage.expectPasswordError('Password is required');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/login`);
    await loginPage.toast.expectError('Error', 'Invalid username/password');
  });


  test('should have proper form validation for short username', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'abc',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/login`);
    await loginPage.expectUsernameError('Username must be at least 4 characters');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await loginPage.clickRegisterButton();

    // then

    await expect(page).toHaveURL(`${UI_BASE_URL}/register`);
  });

  test('should navigate to register page when register link in header is clicked', async ({ page }) => {
    // when
    await loginPage.header.clickRegisterLink();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/register`);
  });
}); 
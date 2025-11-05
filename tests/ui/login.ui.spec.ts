import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { UI_BASE_URL } from '../../config/constants';

const LOGIN_URL = `${UI_BASE_URL}/login`;

test.describe('Login UI tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).not.toHaveURL(LOGIN_URL);
  });

  test('should show error for empty password', async ({ page }) => {
    // given
    const credentials = {
      username: 'admin',
      password: ''
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // given
    // when
    await page.getByTestId('login-register-link').click();

    // then
    await expect(page).toHaveURL('http://localhost:8081/register');
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // given
    // when
    await page.getByTestId('register-link').click();

    // then
    await expect(page).toHaveURL('http://localhost:8081/register');
  });

  test('should have proper form validation for short username', async ({ page }) => {
    // given
    const credentials = {
      username: 'abc',
      password: 'admin'
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });

}); 
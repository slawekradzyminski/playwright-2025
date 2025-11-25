import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { FRONTEND_URL } from '../../config/constants';

const LOGIN_URL = `${FRONTEND_URL}/login`;

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
    await expect(page).toHaveURL(FRONTEND_URL + '/');
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('home-welcome-title')).toBeVisible();
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
    await expect(page.getByTestId('login-password-error')).toHaveText('Password is required');
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
    await expect(page.getByTestId('toast-title')).toHaveText('Error');
    await expect(page.getByTestId('toast-description')).toHaveText('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await page.getByTestId('login-register-link').click();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/register`);
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await page.getByTestId('register-link').click();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/register`);
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
    await expect(page.getByTestId('login-username-error')).toHaveText('Username must be at least 4 characters');
  });

}); 
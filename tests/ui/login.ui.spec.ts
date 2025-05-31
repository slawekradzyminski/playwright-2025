import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';

const LOGIN_URL = 'http://localhost:8081/login';

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
    await expect(page.getByTestId('toast-description')).toBeVisible();
    await expect(page.getByTestId('toast-description')).toHaveText('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await page.getByTestId('login-register-link').click();

    // then
    await expect(page).toHaveURL('http://localhost:8081/register');
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
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
    await expect(page.getByText('Username must be at least 4 characters')).toBeVisible();
    await expect(page).toHaveURL(LOGIN_URL);
  });
});
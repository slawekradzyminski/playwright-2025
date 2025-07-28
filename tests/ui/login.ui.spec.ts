import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';

const LOGIN_URL = 'http://localhost:8081/login';

test.describe('Login UI tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('should display login form elements', async ({ page }) => {
    // given
    // when
    // then
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByText("Don't have an account?")).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // then
    await expect(page).not.toHaveURL(LOGIN_URL);
  });

  test('should show error for empty username', async ({ page }) => {
    // given
    const credentials = {
      username: '',
      password: 'admin'
    };

    // when
    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should show error for empty password', async ({ page }) => {
    // given
    const credentials = {
      username: 'admin',
      password: ''
    };

    // when
    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

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
    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // given
    // when
    await page.getByRole('button', { name: 'Register' }).click();

    // then
    await expect(page).toHaveURL('http://localhost:8081/register');
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // given
    // when
    await page.getByRole('link', { name: 'Register' }).click();

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
    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should have proper form validation for short password', async ({ page }) => {
    // given
    const credentials = {
      username: 'admin',
      password: 'abc'
    };

    // when
    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.keyboard.press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.keyboard.press('Enter');

    // then
    await expect(page).not.toHaveURL(LOGIN_URL);
  });
}); 
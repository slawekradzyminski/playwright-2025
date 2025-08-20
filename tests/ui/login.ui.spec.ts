import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { generateValidUser } from '../../generators/userGenerator';
import { signup } from '../../http/registrationClient';

const LOGIN_URL = 'http://localhost:8081/login';

test.describe('Login UI tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('should successfully login with valid credentials', async ({ page, request }) => {
    // given
    const user = generateValidUser();
    await signup(request, user);
    const credentials: LoginDto = {
      username: user.username,
      password: user.password
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

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await page.getByRole('link', { name: 'Register' }).click();

    // then
    await expect(page).toHaveURL('http://localhost:8081/register');
  });

}); 
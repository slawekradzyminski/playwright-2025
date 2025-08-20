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
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL('http://localhost:8081/');
    await expect(page.getByTestId('home-welcome-title')).toContainText(`Welcome, ${user.firstName}!`);
    await expect(page.getByTestId('home-user-email')).toContainText(user.email);
    await expect(page.getByTestId('username-profile-link')).toContainText(`${user.firstName} ${user.lastName}`);
    await expect(page.getByTestId('logout-button')).toBeVisible();
  });

  test('should show error for empty username', async ({ page }) => {
    // given
    const credentials = {
      username: '',
      password: 'admin'
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.getByTestId('login-username-error')).toContainText('Username is required');
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
    await expect(page.getByTestId('toast-description')).toContainText('Invalid username/password');
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
    await expect(page.getByTestId('login-username-error')).toContainText('Username must be at least 4 characters');
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await page.getByTestId('login-register-link').click();

    // then
    await expect(page).toHaveURL('http://localhost:8081/register');
  });

}); 
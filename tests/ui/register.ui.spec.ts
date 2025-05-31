import { test, expect } from '@playwright/test';
import type { RegisterDto } from '../../types/auth';
import { RegisterPage } from '../../pages/RegisterPage';
import { generateRandomUser } from '../../generators/userGenerator';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid data', async ({ page }) => {
    // given
    const userData = generateRandomUser();

    // when
    await registerPage.register(userData);

    // then
    await registerPage.expectToBeRedirectedFromRegister();
  });

  test('should show error for duplicate username', async ({ page }) => {
    // given
    const userData = generateRandomUser();
    const registerData: RegisterDto = {
      ...userData,
      username: 'admin',
    };

    // when
    await registerPage.register(registerData);

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectErrorMessage('Username already exists');
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // when
    await registerPage.clickLoginLink();

    // then
    await registerPage.expectToBeOnLoginPage();
  });

  test('should have proper form validation for invalid email', async ({ page }) => {
    // given
    const userData = generateRandomUser();
    const registerData: RegisterDto = {
      ...userData,
      email: 'invalid-email',
    };

    // when
    await registerPage.register(registerData);

    // then
    await registerPage.expectValidationError('Invalid email format');
    await registerPage.expectToBeOnRegisterPage();
  });

  test('should show error for empty required fields', async ({ page }) => {
    // when
    await registerPage.fillPartialForm({});

    // then
    await registerPage.expectValidationError('Username is required');
    await registerPage.expectToBeOnRegisterPage();
  });
}); 
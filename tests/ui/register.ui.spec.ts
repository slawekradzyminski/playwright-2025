import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/registerPage';
import { generateClient } from '../../generator/userGenerator';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // given
    // when
    await registerPage.clickCreateAccount();

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectValidationErrors([
      'Username is required',
      'Email is required', 
      'Password is required',
      'First name is required',
      'Last name is required'
    ]);
  });

  test('should validate email format', async ({ page }) => {
    // given
    const invalidUser = {
      username: 'testuser',
      email: 'invalid-email', // invalid format
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    };

    // when
    await registerPage.fillPartialForm(invalidUser);
    await registerPage.clickCreateAccount();

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectValidationError('Invalid email format');
  });

  test('should successfully register with valid data', async ({ page }) => {
    // given
    const validUser = generateClient();

    // when
    await registerPage.register(validUser);

    // then
    await registerPage.expectToBeOffRegisterPage();
  });

  test('should navigate to login page via "Sign in" button', async ({ page }) => {
    // given
    // when
    await registerPage.clickSignInButton();

    // then
    await registerPage.expectToBeOnLoginPage();
  });
});

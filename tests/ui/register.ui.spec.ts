import { test } from '@playwright/test';
import { config } from 'dotenv';
import { RegisterPage } from '../../pages/registrationPage';
import { generateUser } from '../../generators/userGenerator';

config();

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid data', async () => {
    const user = generateUser();

    await registerPage.register(user);

    await registerPage.expectToBeOnLoginPage();
  });

  test('should show error for duplicate username', async () => {
    const user = generateUser({
      username: process.env.TEST_USERNAME!
    });

    await registerPage.register(user);

    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectToastError('Username already exists');
  });

  test('should navigate to login page when sign in button is clicked', async () => {
    await registerPage.clickSignInButton();

    await registerPage.expectToBeOnLoginPage();
  });

  test('should show error for invalid email format', async () => {
    const user = generateUser({
      email: 'invalid-email'
    });

    await registerPage.register(user);

    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectEmailError('Invalid email format');
  });

  test('should show error for short password', async () => {
    const user = generateUser({
      password: 'short'
    });

    await registerPage.register(user);

    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectPasswordError('Password must be at least 8 characters');
  });
});

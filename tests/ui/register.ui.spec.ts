import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';
import { generateClientUser } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/users/signupRequest';

test.describe('Register UI tests', () => {

  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid data', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);
    const userData = generateClientUser();

    // when
    await registerPage.register(userData);

    // then
    await expect(page).toHaveURL(LoginPage.URL);
    await loginPage.toast.expectSuccess('Registration successful! You can now log in.');
  });

  test('should show error when registering with existing username', async ({ request }) => {
    // given
    const existingUser = generateClientUser();
    await attemptSignup(request, existingUser);

    // when
    await registerPage.register({...existingUser, email: 'different@email.com'});

    // then
    await registerPage.toast.expectError('Username already exists');
  });

  test('should show validation errors for empty form', async () => {
    // when
    await registerPage.submitButton.click();

    // then
    await expect(registerPage.usernameError).toHaveText('Username is required');
    await expect(registerPage.emailError).toHaveText('Email is required');
    await expect(registerPage.passwordError).toHaveText('Password is required');
    await expect(registerPage.firstNameError).toHaveText('First name is required');
    await expect(registerPage.lastNameError).toHaveText('Last name is required');
  });

  test('should navigate to login page when sign in button is clicked', async ({ page }) => {
    // when
    await registerPage.clickLogin();

    // then
    await expect(page).toHaveURL(LoginPage.URL);
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // when
    await registerPage.header.clickLogin();

    // then
    await expect(page).toHaveURL(LoginPage.URL);
  });
});


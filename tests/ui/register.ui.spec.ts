import { test, expect } from '@playwright/test';
import type { SignupDto } from '../../types/auth';
import { generateUser } from '../../generators/userGenerator';
import { SignupClient } from '../../httpclients/signupClient';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const LOGIN_URL = `${APP_BASE_URL}/login`;

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should register a new user and allow them to log in', async ({ page }) => {
    // given
    const user = generateUser();

    // when
    await registerPage.register(user);

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await registerPage.toast.expectMessage('Success', 'Registration successful! You can now log in.');

    // when
    const loginPage = new LoginPage(page);
    await loginPage.login(user.username, user.password);

    // then
    const homePage = new HomePage(page);
    await loginPage.expectToBeRedirectedAway();
    await homePage.expectLoggedInAs(user.firstName, user.email);
  });

  test('should show required field errors when form is empty', async () => {
    // given
    await registerPage.expectToBeOnRegisterPage();

    // when
    await registerPage.submitButton.click();

    // then
    await registerPage.expectToBeOnRegisterPage();
    await expect(registerPage.usernameError).toHaveText('Username is required');
    await expect(registerPage.emailError).toHaveText('Email is required');
    await expect(registerPage.passwordError).toHaveText('Password is required');
    await expect(registerPage.firstNameError).toHaveText('First name is required');
    await expect(registerPage.lastNameError).toHaveText('Last name is required');
  });

  test('should show validation errors for invalid edge-length values', async () => {
    // given
    const invalidUser: SignupDto = {
      username: 'abc',
      email: 'not-an-email',
      password: 'short',
      firstName: 'Bob',
      lastName: 'Li',
    };

    // when
    await registerPage.register(invalidUser);

    // then
    await registerPage.expectToBeOnRegisterPage();
    await expect(registerPage.usernameError).toHaveText('Username must be at least 4 characters');
    await expect(registerPage.emailError).toHaveText('Invalid email format');
    await expect(registerPage.passwordError).toHaveText('Password must be at least 8 characters');
    await expect(registerPage.firstNameError).toHaveText('First name must be at least 4 characters');
    await expect(registerPage.lastNameError).toHaveText('Last name must be at least 4 characters');
  });

  test('should show error toast when username already exists', async ({ request }) => {
    // given
    const existingUser = generateUser();
    const signupClient = new SignupClient(request, APP_BASE_URL);
    const createUserResponse = await signupClient.signup(existingUser);
    expect(createUserResponse.status()).toBe(201);

    const duplicateUsernameUser = {
      ...generateUser(),
      username: existingUser.username,
    };

    // when
    await registerPage.register(duplicateUsernameUser);

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.toast.expectError('Error', 'Username already exists');
  });

  test('should navigate to login page when sign in button is clicked', async () => {
    // given
    await registerPage.expectToBeOnRegisterPage();

    // when
    await registerPage.loginButton.click();

    // then
    await expect(registerPage.page).toHaveURL(LOGIN_URL);
  });

  test('should navigate to login page when login nav link is clicked', async () => {
    // given
    await registerPage.expectToBeOnRegisterPage();

    // when
    await registerPage.header.loginLink.click();

    // then
    await expect(registerPage.page).toHaveURL(LOGIN_URL);
  });
});

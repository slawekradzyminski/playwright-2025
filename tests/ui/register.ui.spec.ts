import { test } from '@playwright/test';
import { randomUser } from '../../generators/userGenerator';
import type { UserRegisterDto } from '../../types/auth';
import { LoginPage } from '../../pages/loginPage';
import { RegisterPage } from '../../pages/registerPage';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
    await registerPage.assertThatRegisterFormIsVisible();
  });

  test('should successfully register new user with valid data', async ({ page }) => {
    // given
    const userData = randomUser();

    // when
    await registerPage.register(userData);

    // then
    const loginPage = new LoginPage(page);
    await loginPage.assertThatUrlIs(LoginPage.url);
    await loginPage.assertThatLoginFormIsVisible();
  });

  test('should show validation errors for empty required fields', async () => {
    // when
    await registerPage.submitEmptyForm();

    // then
    await registerPage.assertThatUrlIs(RegisterPage.url);
    await registerPage.assertThatValidationErrorsAreVisible([
      'Username is required',
      'Email is required',
      'Password is required',
      'First name is required',
      'Last name is required'
    ]);
  });

  test('should show validation errors for too short values', async () => {
    // given
    const userData: UserRegisterDto = {
      ...randomUser(),
      username: 'abc',
      password: 'short',
      firstName: 'Jon',
      lastName: 'Doe'
    };

    // when
    await registerPage.register(userData);

    // then
    await registerPage.assertThatUrlIs(RegisterPage.url);
    await registerPage.assertThatUserDataIsFilled(userData);
    await registerPage.assertThatValidationErrorsAreVisible([
      'Username must be at least 4 characters',
      'Password must be at least 8 characters',
      'First name must be at least 4 characters',
      'Last name must be at least 4 characters'
    ]);
  });

  test('should show validation error for invalid email', async () => {
    // given
    const userData: UserRegisterDto = {
      ...randomUser(),
      email: 'invalid-email'
    };

    // when
    await registerPage.register(userData);

    // then
    await registerPage.assertThatUrlIs(RegisterPage.url);
    await registerPage.assertThatUserDataIsFilled(userData);
    await registerPage.assertThatValidationErrorsAreVisible(['Invalid email format']);
  });

  test('should navigate to login page when login button is clicked', async ({ page }) => {
    // when
    await registerPage.clickLoginButton();

    // then
    const loginPage = new LoginPage(page);
    await loginPage.assertThatUrlIs(LoginPage.url);
    await loginPage.assertThatLoginFormIsVisible();
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // when
    await registerPage.loggedOutHeader.clickLoginLink();

    // then
    const loginPage = new LoginPage(page);
    await loginPage.assertThatUrlIs(LoginPage.url);
    await loginPage.assertThatLoginFormIsVisible();
  });
});

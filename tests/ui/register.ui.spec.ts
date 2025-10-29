import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/registerPage';
import { LoginPage } from '../../pages/loginPage';
import type { UserRegisterDto } from '../../types/auth';
import { generateRandomUser } from '../../generators/userGenerator';
import { attemptRegistration } from '../../http/registerClient';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto('register');
  });

  test('should successfully register with valid credentials', async ({ page }) => {
    // given
    const newUser = generateRandomUser();

    // when
    await registerPage.register(newUser);

    // then
    await registerPage.expectNotOnPage('register');
    const loginPage = new LoginPage(page);
    await loginPage.expectOnPage();
    await loginPage.expectSuccessToastMessage('Registration successful! You can now log in.');
  });

  test('should show error for duplicate username', async ({ request, page }) => {
    // given
    const existingUser = generateRandomUser();
    await attemptRegistration(request, existingUser);
    const duplicateUsernameUser: UserRegisterDto = {
      ...generateRandomUser(),
      username: existingUser.username
    };

    // when
    await registerPage.register(duplicateUsernameUser);

    // then
    await registerPage.expectOnPage();
    await registerPage.expectErrorToastMessage('Username already exists');
  });

  test('should show error for duplicate email', async ({ request, page }) => {
    // given
    test.fail(true, 'Duplicate email is not handled properly by backend (500 is returned)');
    const existingUser = generateRandomUser();
    await attemptRegistration(request, existingUser);
    const duplicateEmailUser: UserRegisterDto = {
      ...generateRandomUser(),
      email: existingUser.email
    };

    // when
    await registerPage.register(duplicateEmailUser);

    // then
    await registerPage.expectOnPage();
    await registerPage.expectErrorToastMessage('Email already exists');
  });

  test('should show multiple validation errors when submitting invalid form', async () => {
    // given
    const invalidUser: UserRegisterDto = {
      username: 'abc',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roles: []
    };

    // when
    await registerPage.register(invalidUser);

    // then
    await registerPage.expectOnPage();
    await registerPage.expectUsernameError('Username must be at least 4 characters');
    await registerPage.expectEmailError('Email is required');
    await registerPage.expectPasswordError('Password is required');
    await registerPage.expectFirstNameError('First name is required');
    await registerPage.expectLastNameError('Last name is required');
  });

  test('should show validation error for short first name', async () => {
    // given
    const userData: UserRegisterDto = {
      ...generateRandomUser(),
      firstName: 'abc'
    };

    // when
    await registerPage.register(userData);

    // then
    await registerPage.expectOnPage();
    await registerPage.expectFirstNameError('First name must be at least 4 characters');
  });

  test('should navigate to login page when sign in button is clicked', async ({ page }) => {
    // when
    await registerPage.clickSignInButton();

    // then
    const loginPage = new LoginPage(page);
    await loginPage.expectOnPage();
  });

});


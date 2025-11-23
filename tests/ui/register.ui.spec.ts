import { test, expect } from '@playwright/test';
import { UI_BASE_URL } from '../../config/constants';
import { RegisterPage } from '../../pages/RegisterPage';
import { generateRandomClientUser } from '../../generators/userGenerator';
import { attemptSignup } from '../../http/users/signupRequest';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid data', async ({ page }) => {
    // given
    const userData = generateRandomClientUser();

    // when
    await registerPage.attemptRegister(userData);

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/login`);
    await registerPage.toast.expectSuccess('Success', 'Registration successful! You can now log in.');
  });

  test('should show errors for empty fields', async ({ page }) => {
    // given
    const emptyUserData = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    // when
    await registerPage.attemptRegister(emptyUserData);

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/register`);
    await registerPage.expectUsernameError('Username is required');
    await registerPage.expectEmailError('Email is required');
    await registerPage.expectPasswordError('Password is required');
    await registerPage.expectFirstNameError('First name is required');
    await registerPage.expectLastNameError('Last name is required');
  });

  test('should show error for existing username', async ({ page, request }) => {
    // given
    const existingUser = generateRandomClientUser();
    await attemptSignup(request, existingUser);

    // when
    await registerPage.attemptRegister(existingUser);

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/register`);
    await registerPage.toast.expectError('Error', 'Username already exists');
  });

  test('should show error for invalid email format', async ({ page }) => {
    // given
    const userData = {...generateRandomClientUser(), email: 'invalidemail'};

    // when
    await registerPage.attemptRegister(userData);

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/register`);
    await registerPage.expectEmailError('Invalid email format');
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // when
    await registerPage.clickLoginLink();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/login`);
  });
});


import { test, expect } from '@playwright/test';
import { generateValidUser, generateInvalidUser } from '../../generators/userGenerator';
import { RegisterPage, LoginPage } from '../../pages';
import { FRONTEND_URL } from '../../pages/constants';

test.describe('Register UI tests', () => {
  test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid user data', async ({ page }) => {
    // given
    const user = generateValidUser();
    const registerPage = new RegisterPage(page);

    // when
    await registerPage.register(user);

    // then
    await registerPage.expectSuccessfulRegistration();
  });

  test('should show error for empty username', async ({ page }) => {
    // given
    const user = generateValidUser({ username: '' });
    const registerPage = new RegisterPage(page);

    // when
    await registerPage.register(user);

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectUsernameRequiredError();
  });

  test('should show error for invalid email format', async ({ page }) => {
    // given
    const user = generateInvalidUser('email', 'invalid-email');
    const registerPage = new RegisterPage(page);

    // when
    await registerPage.register(user);

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectInvalidEmailError();
  });


  test('should show error for short password', async ({ page }) => {
    // given
    const user = generateInvalidUser('password', '123');
    const registerPage = new RegisterPage(page);

    // when
    await registerPage.register(user);

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectShortPasswordError();
  });

  test('should navigate to login page when login link is clicked', async ({ page }) => {
    // given
    const registerPage = new RegisterPage(page);

    // when
    await registerPage.clickLoginLink();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/login`);
  });

});

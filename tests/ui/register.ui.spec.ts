import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import type { RegisterDto } from '../../types/auth';
import { getRandomUser } from '../../generators/userGenerator';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid data', async () => {
    // given
    const userData: RegisterDto = getRandomUser();

    // when
    await registerPage.register(userData);

    // then
    await registerPage.expectToNotBeOnRegisterPage();
  });

  test('should show error for existing username', async () => {
    // given
    const userData: RegisterDto = {
      ...getRandomUser(),
      username: 'admin'
    };

    // when
    await registerPage.register(userData);

    // then
    await registerPage.expectToBeOnRegisterPage();
  });

  test('should show error for empty first name', async () => {
    // given
    const userData: RegisterDto = {
      ...getRandomUser(),
      firstName: ''
    };

    // when
    await registerPage.register(userData);

    // then
    await registerPage.expectToBeOnRegisterPage();
  });

  test('should navigate to login page when sign in button is clicked', async () => {
    // given
    // when
    await registerPage.goToLoginPage();

    // then
    await registerPage.expectToBeOnLoginPage();
  });

  test('should have proper form validation for invalid email format', async () => {
    // given
    const userData: RegisterDto = {
      ...getRandomUser(),
      email: 'invalid-email'
    };

    // when
    await registerPage.register(userData);

    // then
    await registerPage.expectToBeOnRegisterPage();
  });

}); 
import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/registerPage';
import { randomClient } from '../../generators/userGenerator';
import { LoginPage } from '../../pages/loginPage';
import { attemptSignup } from '../../http/signupClient';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid data', async ( { page }) => {
    // given
    const userData = randomClient();
    const loginPage = new LoginPage(page);

    // when
    await registerPage.register(userData);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.getToast().verifySuccessMessage('Registration successful! You can now log in.');
  });

  test('should show required field errors when all fields are empty', async () => {
    // given
    // when
    await registerPage.clickSubmit();

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectUsernameRequiredError();
    await registerPage.expectEmailRequiredError();
    await registerPage.expectPasswordRequiredError();
    await registerPage.expectFirstNameRequiredError();
    await registerPage.expectLastNameRequiredError();
  });

  test('should show username minimum length error', async () => {
    // given
    const userData = randomClient();
    userData.username = 'abc'; // less than 4 characters

    // when
    await registerPage.fillUsername(userData.username);
    await registerPage.fillEmail(userData.email);
    await registerPage.fillPassword(userData.password);
    await registerPage.fillFirstName(userData.firstName);
    await registerPage.fillLastName(userData.lastName);
    await registerPage.clickSubmit();

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectUsernameMinLengthError();
  });

  test('should show password minimum length error', async () => {
    // given
    const userData = randomClient();
    userData.password = '1234567'; // less than 8 characters

    // when
    await registerPage.fillUsername(userData.username);
    await registerPage.fillEmail(userData.email);
    await registerPage.fillPassword(userData.password);
    await registerPage.fillFirstName(userData.firstName);
    await registerPage.fillLastName(userData.lastName);
    await registerPage.clickSubmit();

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.expectPasswordMinLengthError();
  });

  test('should show error when username already exists', async ({ request }) => {
    // given
    const user = randomClient();
    await attemptSignup(request, user);
    const userData = randomClient();
    userData.username = user.username; // existing username

    // when
    await registerPage.register(userData);

    // then
    await registerPage.expectToBeOnRegisterPage();
    await registerPage.getToast().verifyErrorMessage('Username already exists');
  });

  test('should navigate to login page when sign in link is clicked', async () => {
    // given
    // when
    await registerPage.clickSignInLink();

    // then
    await registerPage.expectToBeOnLoginPage();
  });
});

import { expect, test } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { loginClient } from '../../httpclients/loginClient';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register new user', async ( { request, page } ) => {
    // given
    const loginPage = new LoginPage(page)
    const user = generateUser();

    // when
    await registerPage.register(user);

    // then
    await loginPage.expectToBeOnPage(LoginPage.url);
    await loginPage.toast.expectSuccessToastMessageToHaveText('Registration successful! You can now log in.');

    // check that we can login via API with registered user
    const response = await loginClient.postLogin(request, { username: user.username, password: user.password });
    expect(response.status()).toBe(200);
  });

  test('should show frontend validation errors for empty required fields', async () => {
    // when
    await registerPage.submit();

    // then
    await registerPage.expectToBeOnPage(RegisterPage.url);
    await registerPage.expectRequiredFieldErrors();
  });

});

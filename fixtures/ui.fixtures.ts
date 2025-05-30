import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import type { LoginDto, LoginResponseDto, RegisterDto } from '../types/auth';
import { attemptLogin } from '../http/postSignIn';
import { attemptRegister } from '../http/postSignUp';
import { getRandomUser } from '../generators/userGenerator';

type UIFixtures = {
  loggedInPage: Page;
  authToken: string;
  user: RegisterDto;
};

export const test = base.extend<UIFixtures>({
  user: async ({ request }, use) => {
    const registerData: RegisterDto = getRandomUser();
    
    const registerResponse = await attemptRegister(request, registerData);
    if (registerResponse.status() !== 201) {
      throw new Error(`User registration failed with status ${registerResponse.status()}`);
    }
    
    await use(registerData);
  },

  authToken: async ({ request, user }, use) => {
    const loginData: LoginDto = {
      username: user.username,
      password: user.password
    };
    
    const loginResponse = await attemptLogin(request, loginData);
    const loginBody: LoginResponseDto = await loginResponse.json();
    
    await use(loginBody.token);
  },

  loggedInPage: async ({ page, user }, use) => {
    const loginPage = new LoginPage(page);
    const credentials: LoginDto = {
      username: user.username,
      password: user.password
    };
    
    await loginPage.goto();
    await loginPage.login(credentials);
    await loginPage.expectToNotBeOnLoginPage();
    
    await use(page);
  },
});

export { expect }; 
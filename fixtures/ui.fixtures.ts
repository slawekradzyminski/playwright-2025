import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import type { LoginDto } from '../types/auth';

type UIFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<UIFixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };
    
    await loginPage.goto();
    await loginPage.login(credentials);
    await loginPage.expectToNotBeOnLoginPage();
    
    await use(page);
  },
});

export { expect }; 
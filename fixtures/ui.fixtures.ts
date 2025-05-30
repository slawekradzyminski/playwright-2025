import { FRONTEND_BASE_URL } from '../constants/config';
import { RegisterDto } from '../types/auth';
import { test as authTest, expect } from './auth.fixtures';
import type { Page } from '@playwright/test';

type UIFixtures = {
  loggedInPage: Page;
  authToken: string;
  user: RegisterDto;
};

export const test = authTest.extend<UIFixtures>({
  loggedInPage: async ({ page, authToken }, use) => {
    await page.goto(FRONTEND_BASE_URL);
    
    await page.evaluate((token) => {
      localStorage.setItem('token', token);
    }, authToken);
    
    await page.goto(FRONTEND_BASE_URL);
    
    await use(page);
  },
});

export { expect }; 
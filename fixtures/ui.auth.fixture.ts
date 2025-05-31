import { type Page } from '@playwright/test';
import { test as authTest } from './auth.fixture';
import { FRONTEND_URL } from '../config/constants';

export const test = authTest.extend<{ 
  loggedInPage: Page;
}>({
  loggedInPage: async ({ page, authToken }, use) => {
    await page.goto(`${FRONTEND_URL}/`);
    
    await page.evaluate((token) => {
      localStorage.setItem('token', token);
    }, authToken);
    
    await page.goto(`${FRONTEND_URL}/`);
    await use(page);
  },
});
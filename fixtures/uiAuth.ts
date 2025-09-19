import { test as base, Page } from './apiAuth';
import { UserRegisterDto } from '../types/auth';
import { FRONTEND_URL } from '../config/constants';

export interface UiAuthFixture {
  page: Page;
  user: UserRegisterDto;
  token: string;
}

export interface UiAuthFixtures {
  uiAuth: UiAuthFixture;
  uiAuthAdmin: UiAuthFixture;
}

async function setupUiAuth(
  page: Page,
  token: string,
  user: UserRegisterDto,
  use: (fixture: UiAuthFixture) => Promise<void>
) {
  await page.addInitScript((tokenValue) => {
    localStorage.setItem('token', tokenValue);
  }, token);

  await page.goto(`${FRONTEND_URL}/`);

  await use({ page, user, token });
}

export const test = base.extend<UiAuthFixtures>({
  uiAuth: async ({ apiAuth, page }, use) => {
    await setupUiAuth(page, apiAuth.token, apiAuth.user, use);
  },

  uiAuthAdmin: async ({ apiAuthAdmin, page }, use) => {
    await setupUiAuth(page, apiAuthAdmin.token, apiAuthAdmin.user, use);
  }
});

export { expect } from '@playwright/test';

import { test as base } from '@playwright/test';
import { generateRandomClientUser, generateRandomAdminUser } from '../generators/userGenerator';
import { UI_BASE_URL } from '../config/constants';
import { createAndAuthenticateUser, type AuthenticatedUser } from './helpers/authHelper';

interface UiAuthFixtures {
  authenticatedUiClientUser: AuthenticatedUser;
  authenticatedUiAdminUser: AuthenticatedUser;
}

const createAuthenticatedUiFixture = async (
  { page, request }: { page: any; request: any },
  userGenerator: () => any,
  use: (user: AuthenticatedUser) => Promise<void>
) => {
  const authenticatedUser = await createAndAuthenticateUser(request, userGenerator);

  await page.addInitScript((token: string) => {
    localStorage.setItem('token', token);
  }, authenticatedUser.token);

  await page.goto(UI_BASE_URL);

  await use(authenticatedUser);
};

export const test = base.extend<UiAuthFixtures>({
  authenticatedUiClientUser: async ({ page, request }, use) => {
    await createAuthenticatedUiFixture({ page, request }, generateRandomClientUser, use);
  },

  authenticatedUiAdminUser: async ({ page, request }, use) => {
    await createAuthenticatedUiFixture({ page, request }, generateRandomAdminUser, use);
  },
});

export { expect } from '@playwright/test';


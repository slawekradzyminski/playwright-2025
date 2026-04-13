import { test as base, expect } from '@playwright/test';
import { registerAndLogin, type AuthenticatedUser } from '../helpers/authHelper';

type AuthFixtures = {
  authenticatedUser: AuthenticatedUser;
};

export const test = base.extend<AuthFixtures>({
  authenticatedUser: async ({ request }, use) => {
    const authenticatedUser = await registerAndLogin(request);
    await use(authenticatedUser);
  }
});

export { expect };

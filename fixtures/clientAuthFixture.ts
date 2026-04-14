import { test as base, expect } from '@playwright/test';
import { registerAndLogin, type AuthenticatedUser } from '../helpers/authHelper';

export const APP_BASE_URL = process.env.APP_BASE_URL || '';

type ClientAuthFixtures = {
  authenticatedClientUser: AuthenticatedUser;
};

export const test = base.extend<ClientAuthFixtures>({
  authenticatedClientUser: async ({ request }, use) => {
    // given
    const authenticatedClientUser = await registerAndLogin(request);

    await use(authenticatedClientUser);
  },
});

export { expect };

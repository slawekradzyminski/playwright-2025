import { test as base } from '@playwright/test';
import { generateRandomClientUser, generateRandomAdminUser } from '../generators/userGenerator';
import { createAndAuthenticateUser, type AuthenticatedUser } from './helpers/authHelper';

interface AuthFixtures {
  authenticatedClientUser: AuthenticatedUser;
  authenticatedAdminUser: AuthenticatedUser;
}

export const test = base.extend<AuthFixtures>({
  authenticatedClientUser: async ({ request }, use) => {
    const authenticatedUser = await createAndAuthenticateUser(request, generateRandomClientUser);
    await use(authenticatedUser);
  },

  authenticatedAdminUser: async ({ request }, use) => {
    const authenticatedUser = await createAndAuthenticateUser(request, generateRandomAdminUser);
    await use(authenticatedUser);
  },
});

export { expect } from '@playwright/test';

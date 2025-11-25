import { test as base } from '@playwright/test';
import type { AuthFixture } from '../types/fixtures';
import { generateClientUser, generateAdminUser } from '../generators/userGenerator';
import { createAuthFixture } from './createAuthFixture';

interface AuthFixtures {
  clientAuth: AuthFixture;
  adminAuth: AuthFixture;
}

export const test = base.extend<AuthFixtures>({
  clientAuth: async ({ request }, use) => {
    const authFixture = await createAuthFixture(request, generateClientUser);
    await use(authFixture);
  },

  adminAuth: async ({ request }, use) => {
    const authFixture = await createAuthFixture(request, generateAdminUser);
    await use(authFixture);
  }
});

export { expect } from '@playwright/test';

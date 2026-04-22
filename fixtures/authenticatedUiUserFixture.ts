import { test as base } from '@playwright/test';
import { type AuthenticatedUser, createAuthenticatedUser } from '../helpers/authenticationHelpers';
import { injectBrowserAuth } from '../helpers/browserAuthHelpers';

interface AuthenticatedUiUserFixture {
  authenticatedUiUser: AuthenticatedUser;
}

export const test = base.extend<AuthenticatedUiUserFixture>({
  authenticatedUiUser: async ({ request }, use) => {
    const authenticatedUiUser = await createAuthenticatedUser(request);

    await use(authenticatedUiUser);
  },

  page: async ({ page, authenticatedUiUser }, use) => {
    await injectBrowserAuth(page, authenticatedUiUser);

    await use(page);
  }
});

export { expect } from '@playwright/test';

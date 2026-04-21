import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import { type AuthenticatedUser, createAuthenticatedUser } from '../helpers/authenticationHelpers';

interface AuthenticatedUiUserFixture {
  authenticatedUiUser: AuthenticatedUser;
}

export const test = base.extend<AuthenticatedUiUserFixture>({
  authenticatedUiUser: async ({ request }, use) => {
    const authenticatedUiUser = await createAuthenticatedUser(request);

    await use(authenticatedUiUser);
  },

  page: async ({ page, authenticatedUiUser }, use) => {
    await page.addInitScript(
      (authState) => {
        window.localStorage.setItem('token', authState.token);
        window.localStorage.setItem('refreshToken', authState.refreshToken);
        window.localStorage.setItem('clientSessionId', authState.clientSessionId);
      },
      {
        token: authenticatedUiUser.token,
        refreshToken: authenticatedUiUser.refreshToken,
        clientSessionId: randomUUID()
      }
    );

    await use(page);
  }
});

export { expect } from '@playwright/test';

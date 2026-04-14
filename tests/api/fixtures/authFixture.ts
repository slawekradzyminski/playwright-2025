import { test as clientAuthTest, expect } from '../../../fixtures/clientAuthFixture';
import type { AuthenticatedUser } from '../../../helpers/authHelper';

type AuthFixtures = {
  authenticatedUser: AuthenticatedUser;
};

export const test = clientAuthTest.extend<AuthFixtures>({
  authenticatedUser: async ({ authenticatedClientUser }, use) => {
    await use(authenticatedClientUser);
  },
});

export { expect };

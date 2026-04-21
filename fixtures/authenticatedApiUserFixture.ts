import { test as base } from '@playwright/test';
import { type AuthenticatedUser, createAuthenticatedUser } from '../helpers/authenticationHelpers';

interface AuthenticatedApiUserFixture {
  authenticatedApiUser: AuthenticatedUser;
}

export const test = base.extend<AuthenticatedApiUserFixture>({
  authenticatedApiUser: async ({ request }, use) => {
    // This will run before each test using this fixture
    const authenticatedApiUser = await createAuthenticatedUser(request);

    // this is returned to test using this fixture
    await use(authenticatedApiUser);

    // this will run after each test using this fixture
  }
});

export { expect } from '@playwright/test';

import { test as base } from '@playwright/test';
import { createAuthenticatedUser, type AuthenticatedUser } from './authFixtureHelper';

type AuthFixtureReturn = {
    auth: AuthenticatedUser
};

export const test = base.extend<AuthFixtureReturn>({
    auth: async ({ request }, use) => {
        const { user, token } = await createAuthenticatedUser(request);

        await use({
            user,
            token
        });
    }
});

export { expect } from '@playwright/test';

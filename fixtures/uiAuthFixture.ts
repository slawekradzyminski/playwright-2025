import { test as base, type Page } from '@playwright/test';
import { createAuthenticatedUser, type AuthenticatedUser } from './authFixtureHelper';

type AuthFixtureReturn = {
    uiAuth: AuthenticatedUser & {
        page: Page
    }
};

export const test = base.extend<AuthFixtureReturn>({
    uiAuth: async ({ request, page }, use) => {
        const { user, token, refreshToken } = await createAuthenticatedUser(request);

        page.addInitScript(({ token, refreshToken }) => {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
        }, { token, refreshToken });

        await use({
            user,
            token,
            page
        });
    }
});

export { expect } from '@playwright/test';

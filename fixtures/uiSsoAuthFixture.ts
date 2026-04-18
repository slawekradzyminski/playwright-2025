import { test as base, type Page } from '@playwright/test';
import {
  createSsoAuthenticatedUser,
  type SsoAuthenticatedUser,
} from './ssoAuthFixtureHelper';

type SsoAuthFixtureReturn = {
  ssoAuth: SsoAuthenticatedUser & {
    page: Page;
  };
};

export const test = base.extend<SsoAuthFixtureReturn>({
  ssoAuth: async ({ request, page }, use) => {
    const { username, token, refreshToken } = await createSsoAuthenticatedUser(request);

    await page.addInitScript(({ token, refreshToken }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }, { token, refreshToken });

    await use({
      username,
      token,
      refreshToken,
      page,
    });
  },
});

export { expect } from '@playwright/test';

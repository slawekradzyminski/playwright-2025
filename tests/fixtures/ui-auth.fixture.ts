import { test as base, type Page } from '@playwright/test';
import { HOME_URL } from '../ui/constants/ui.urls.constants';
import type { AuthSession } from './auth-session.util';
import {
  useAdminAuthSession,
  useClientAuthSessionWithCleanup,
  useFakerTestSeed,
} from './shared-auth-fixture.util';

type UiAuthFixtures = {
  fakerTestSeed: number;
  clientAuth: AuthSession;
  adminAuth: AuthSession;
  authenticatedPage: Page;
};

export const test = base.extend<UiAuthFixtures>({
  fakerTestSeed: async ({}, use, testInfo) =>
    useFakerTestSeed(use, testInfo.parallelIndex, testInfo.testId),

  adminAuth: async ({ request, fakerTestSeed }, use) =>
    useAdminAuthSession(request, fakerTestSeed, use),

  clientAuth: async ({ request, fakerTestSeed, adminAuth }, use) =>
    useClientAuthSessionWithCleanup(request, fakerTestSeed, adminAuth, use),

  authenticatedPage: async ({ context, page, clientAuth }, use) => {
    await context.addInitScript(
      ({ token, refreshToken }) => {
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('refreshToken', refreshToken);
      },
      { token: clientAuth.jwtToken, refreshToken: clientAuth.refreshToken },
    );

    await page.goto(HOME_URL);
    await use(page);
  },
});

export { expect } from '@playwright/test';

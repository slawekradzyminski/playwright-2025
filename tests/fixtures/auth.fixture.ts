import { test as base } from '@playwright/test';
import type { AuthSession } from './auth-session.util';
import {
  useAdminAuthSession,
  useClientAuthSessionWithCleanup,
  useFakerTestSeed,
} from './shared-auth-fixture.util';

type TestFixtures = {
  fakerTestSeed: number;
  clientAuth: AuthSession;
  adminAuth: AuthSession;
};

export const test = base.extend<TestFixtures>({
  fakerTestSeed: async ({}, use, testInfo) =>
    useFakerTestSeed(use, testInfo.parallelIndex, testInfo.testId),

  clientAuth: async ({ request, fakerTestSeed, adminAuth }, use) =>
    useClientAuthSessionWithCleanup(request, fakerTestSeed, adminAuth, use),

  adminAuth: async ({ request, fakerTestSeed }, use) =>
    useAdminAuthSession(request, fakerTestSeed, use),
});

export { expect } from '@playwright/test';

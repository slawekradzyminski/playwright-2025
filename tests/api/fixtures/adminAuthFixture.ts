import { request as playwrightRequest, test as base, expect, type APIRequestContext } from '@playwright/test';
import { loginUserForTokens, type AuthTokens } from '../helpers/authHelper';

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:8081';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

type AdminWorkerFixtures = {
  adminTokens: AuthTokens;
  adminRequest: APIRequestContext;
};

/**
 * Admin API fixture for tests that need ROLE_ADMIN access.
 *
 * This extends Playwright's base `test` with worker-scoped fixtures, so each
 * worker logs in as admin once and reuses the authenticated API context for all
 * admin tests assigned to that worker. The normal Playwright `request` fixture
 * is test-scoped, so worker fixtures create their own APIRequestContext via
 * `playwrightRequest.newContext`.
 *
 * Docs:
 * - Fixtures and worker fixtures: https://playwright.dev/docs/test-fixtures
 * - APIRequestContext / API testing: https://playwright.dev/docs/api-testing
 */
export const test = base.extend<{}, AdminWorkerFixtures>({
  adminTokens: [async ({}, use) => {
    // given
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env or the shell environment');
    }

    const loginRequest = await playwrightRequest.newContext({ baseURL: APP_BASE_URL });

    try {
      // when
      const tokens = await loginUserForTokens(loginRequest, {
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD
      }, '');

      // then
      await use(tokens);
    } finally {
      await loginRequest.dispose();
    }
  }, { scope: 'worker' }],

  adminRequest: [async ({ adminTokens }, use) => {
    const context = await playwrightRequest.newContext({
      baseURL: APP_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${adminTokens.token}`
      }
    });

    await use(context);
    await context.dispose();
  }, { scope: 'worker' }]
});

export { expect };

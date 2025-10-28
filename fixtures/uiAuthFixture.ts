import { test as base, expect } from '@playwright/test';
import type { Page, APIRequestContext } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { registerAndLoginUser, type Role } from './authHelpers';
import { FRONTEND_URL } from '../config/constants';

export interface AuthenticatedUIUser {
  userData: UserRegisterDto;
  token: string;
}

async function createAuthenticatedUIUser(
  request: APIRequestContext,
  page: Page,
  role: Role
): Promise<AuthenticatedUIUser> {
  const { userData, token } = await registerAndLoginUser(request, role);

  await page.addInitScript(tokenValue => {
    localStorage.setItem('token', tokenValue);
  }, token);
  await page.goto(FRONTEND_URL);

  return { userData, token };
}

export const test = base.extend<{
  authenticatedUIAdmin: AuthenticatedUIUser;
  authenticatedUIClient: AuthenticatedUIUser;
}>({
  authenticatedUIAdmin: async ({ request, page }, use) => {
    await use(await createAuthenticatedUIUser(request, page, 'ROLE_ADMIN'));
  },

  authenticatedUIClient: async ({ request, page }, use) => {
    await use(await createAuthenticatedUIUser(request, page, 'ROLE_CLIENT'));
  },
});

export { expect };


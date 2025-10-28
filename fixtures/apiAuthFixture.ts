import { test as base, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { registerAndLoginUser } from './authHelpers';

type Role = 'ROLE_ADMIN' | 'ROLE_CLIENT';

export interface AuthenticatedUser {
  userData: UserRegisterDto;
  token: string;
}

async function createAuthenticatedUser(
  request: APIRequestContext,
  role: Role
): Promise<AuthenticatedUser> {
  const { userData, token } = await registerAndLoginUser(request, role);
  return { userData, token };
}

export const test = base.extend<{
  authenticatedAdmin: AuthenticatedUser;
  authenticatedClient: AuthenticatedUser;
}>({
  authenticatedAdmin: async ({ request }, use) => {
    await use(await createAuthenticatedUser(request, 'ROLE_ADMIN'));
  },

  authenticatedClient: async ({ request }, use) => {
    await use(await createAuthenticatedUser(request, 'ROLE_CLIENT'));
  },
});

export { expect };

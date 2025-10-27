import { test as base, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import type { UserRegisterDto, LoginDto, LoginResponseDto } from '../types/auth';
import { generateRandomUserWithRole } from '../generators/userGenerator';
import { attemptRegistration } from '../http/registerClient';
import { attemptLogin } from '../http/loginClient';

type Role = 'ROLE_ADMIN' | 'ROLE_CLIENT';

export interface AuthenticatedUser {
  userData: UserRegisterDto;
  token: string;
}

async function createAuthenticatedUser(
  request: APIRequestContext,
  role: Role
): Promise<AuthenticatedUser> {
  const userData = generateRandomUserWithRole(role);

  await attemptRegistration(request, userData);

  const loginData: LoginDto = {
    username: userData.username,
    password: userData.password,
  };

  const loginResponse = await attemptLogin(request, loginData);
  expect(loginResponse.ok(), 'Login should succeed').toBeTruthy();

  const { token } = (await loginResponse.json()) as LoginResponseDto;

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

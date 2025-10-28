import { test as base, expect } from '@playwright/test';
import type { Page, APIRequestContext } from '@playwright/test';
import type { UserRegisterDto, LoginDto, LoginResponseDto } from '../types/auth';
import { generateRandomUserWithRole } from '../generators/userGenerator';
import { attemptRegistration } from '../http/registerClient';
import { attemptLogin } from '../http/loginClient';
import { FRONTEND_URL } from '../config/constants';

type Role = 'ROLE_ADMIN' | 'ROLE_CLIENT';

export interface AuthenticatedUIUser {
  userData: UserRegisterDto;
  token: string;
  loginResponse: LoginResponseDto;
}

async function createAuthenticatedUIUser(
  request: APIRequestContext,
  page: Page,
  role: Role
): Promise<AuthenticatedUIUser> {
  const userData = generateRandomUserWithRole(role);

  const registrationResponse = await attemptRegistration(request, userData);
  expect(registrationResponse.ok(), 'Registration should succeed').toBeTruthy();

  const loginData: LoginDto = {
    username: userData.username,
    password: userData.password,
  };

  const loginResponse = await attemptLogin(request, loginData);
  expect(loginResponse.ok(), 'Login should succeed').toBeTruthy();

  const loginResponseData = (await loginResponse.json()) as LoginResponseDto;
  const { token } = loginResponseData;

  await page.addInitScript(tokenValue => {
    localStorage.setItem('token', tokenValue);
  }, token);
  await page.goto(FRONTEND_URL);

  return { userData, token, loginResponse: loginResponseData };
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


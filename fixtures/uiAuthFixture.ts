import { test as base } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { attemptSignup } from '../http/users/signupRequest';
import { attemptLogin } from '../http/users/loginRequest';
import { generateRandomClientUser, generateRandomAdminUser } from '../generators/userGenerator';
import { UI_BASE_URL } from '../config/constants';

interface AuthenticatedUser {
  token: string;
  userData: UserRegisterDto;
}

interface UiAuthFixtures {
  authenticatedClientUser: AuthenticatedUser;
  authenticatedAdminUser: AuthenticatedUser;
}

const createAuthenticatedUser = async (
  page: any,
  request: any,
  userGenerator: () => UserRegisterDto,
  use: (value: AuthenticatedUser) => Promise<void>
) => {
  const userData = userGenerator();
  await attemptSignup(request, userData);

  const loginResponse = await attemptLogin(request, {
    username: userData.username,
    password: userData.password
  });

  const { token } = await loginResponse.json();

  await page.addInitScript((token: string) => {
    localStorage.setItem('token', token);
  }, token);

  await page.goto(UI_BASE_URL);

  await use({
    token,
    userData,
  });
};

export const test = base.extend<UiAuthFixtures>({
  authenticatedClientUser: async ({ page, request }, use) => {
    await createAuthenticatedUser(page, request, generateRandomClientUser, use);
  },

  authenticatedAdminUser: async ({ page, request }, use) => {
    await createAuthenticatedUser(page, request, generateRandomAdminUser, use);
  },
});

export { expect } from '@playwright/test';


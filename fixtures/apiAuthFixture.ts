import { test as base } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { attemptSignup } from '../http/users/signupRequest';
import { attemptLogin } from '../http/users/loginRequest';
import { generateRandomClientUser, generateRandomAdminUser } from '../generators/userGenerator';

interface AuthenticatedUser {
  token: string;
  userData: UserRegisterDto;
}

interface AuthFixtures {
  authenticatedClientUser: AuthenticatedUser;
  authenticatedAdminUser: AuthenticatedUser;
}

const createAuthenticatedUser = async (
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

  await use({
    token,
    userData,
  });
};

export const test = base.extend<AuthFixtures>({
  authenticatedClientUser: async ({ request }, use) => {
    await createAuthenticatedUser(request, generateRandomClientUser, use);
  },

  authenticatedAdminUser: async ({ request }, use) => {
    await createAuthenticatedUser(request, generateRandomAdminUser, use);
  },
});

export { expect } from '@playwright/test';

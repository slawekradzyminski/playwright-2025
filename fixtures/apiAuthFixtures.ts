import { test as base, expect } from '@playwright/test';
import { generateUserData } from '../generators/userGenerator';
import { attemptRegistration } from '../http/registerClient';
import { attemptLogin } from '../http/loginClient';
import type { UserRegisterDto, LoginResponseDto } from '../types/auth';

type Role = 'ROLE_CLIENT' | 'ROLE_ADMIN';

type AuthenticatedUser = {
  token: string;
  user: UserRegisterDto;
};

type AuthFixtures = {
  authenticatedClient: AuthenticatedUser;
  authenticatedAdmin: AuthenticatedUser;
};

const makeAuthFixture = (role: Role) =>
  async ({ request }, use: (value: AuthenticatedUser) => Promise<void>) => {
    const user = generateUserData([role]);

    await attemptRegistration(request, user);

    const loginResponse = await attemptLogin(request, {
      username: user.username,
      password: user.password,
    });

    const { token } = (await loginResponse.json()) as LoginResponseDto;

    await use({ token, user });
  };

export const test = base.extend<AuthFixtures>({
  authenticatedClient: makeAuthFixture('ROLE_CLIENT'),
  authenticatedAdmin: makeAuthFixture('ROLE_ADMIN'),
});

export { expect };

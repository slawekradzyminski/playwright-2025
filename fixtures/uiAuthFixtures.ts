import { test as base, expect } from '@playwright/test';
import { generateUserData } from '../generators/userGenerator';
import { attemptRegistration } from '../http/registerClient';
import { attemptLogin } from '../http/loginClient';
import type { UserRegisterDto, LoginResponseDto } from '../types/auth';
import { UI_BASE_URL } from '../config/constants';

type Role = 'ROLE_CLIENT' | 'ROLE_ADMIN';

type AuthenticatedUser = {
  token: string;
  user: UserRegisterDto;
};

type UiAuthFixtures = {
  loggedInClient: AuthenticatedUser;
  loggedInAdmin: AuthenticatedUser;
};

const makeUiAuthFixture = (role: Role) =>
  async ({ page, request }, use: (value: AuthenticatedUser) => Promise<void>) => {
    const user = generateUserData([role]);

    await attemptRegistration(request, user);

    const loginResponse = await attemptLogin(request, {
      username: user.username,
      password: user.password,
    });

    const { token } = (await loginResponse.json()) as LoginResponseDto;

    await page.addInitScript((token: string) => {
      localStorage.setItem('token', token);
    }, token);

    await use({ token, user });
  };

export const test = base.extend<UiAuthFixtures>({
  loggedInClient: makeUiAuthFixture('ROLE_CLIENT'),
  loggedInAdmin: makeUiAuthFixture('ROLE_ADMIN'),
});

export { expect };


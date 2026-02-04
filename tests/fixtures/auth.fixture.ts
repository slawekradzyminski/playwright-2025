import { expect, test as base } from '@playwright/test';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../config/constants';
import { createUser } from '../../generators/userGenerator';
import { attemptLogin } from '../../http/loginClient';
import { attemptSignup } from '../../http/signupClient';
import type { LoginResponseDto, UserRegisterDto } from '../../types/auth';

type AuthenticatedUserFixture = {
  jwtToken: string;
  user: UserRegisterDto;
};

type AdminAuthFixture = {
  jwtToken: string;
  loginResponse: LoginResponseDto;
};

export const test = base.extend<{
  authenticatedUser: AuthenticatedUserFixture;
  adminAuth: AdminAuthFixture;
}>({
  authenticatedUser: async ({ request }, use) => {
    const userData = createUser({ roles: ['ROLE_CLIENT'] });
    const signupResponse = await attemptSignup(request, userData);
    expect(signupResponse.status()).toBe(201);

    const loginResponse = await attemptLogin(request, {
      username: userData.username,
      password: userData.password
    });
    expect(loginResponse.status()).toBe(200);

    await use({
      jwtToken: (await loginResponse.json()).token,
      user: userData
    });
  },
  adminAuth: async ({ request }, use) => {
    const loginResponse = await attemptLogin(request, {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD
    });
    expect(loginResponse.status()).toBe(200);
    const loginResponseBody: LoginResponseDto = await loginResponse.json();

    await use({
      jwtToken: loginResponseBody.token,
      loginResponse: loginResponseBody
    });
  }
});

export { expect };

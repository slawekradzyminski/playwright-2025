import { expect, test as base } from '@playwright/test';
import { createUser } from '../../generators/userGenerator';
import { attemptLogin } from '../../http/loginClient';
import { attemptSignup } from '../../http/signupClient';
import type { UserRegisterDto } from '../../types/auth';

type AuthenticatedUserFixture = {
  jwtToken: string;
  user: UserRegisterDto;
};

export const test = base.extend<{ authenticatedUser: AuthenticatedUserFixture }>({
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
      user: userData,
    });
  }
});

export { expect };

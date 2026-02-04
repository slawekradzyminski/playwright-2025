import { expect, test as base } from '@playwright/test';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../config/constants';
import { createUser } from '../../generators/userGenerator';
import { attemptLogin } from '../../http/loginClient';
import { attemptSignup } from '../../http/signupClient';
import type { LoginResponseDto, UserRegisterDto } from '../../types/auth';
import type { APIRequestContext } from '@playwright/test';

type ClientAuthFixture = {
  jwtToken: string;
  user: UserRegisterDto;
};

type AdminAuthFixture = {
  jwtToken: string;
  loginResponse: LoginResponseDto;
};

export const test = base.extend<{
  clientAuth: ClientAuthFixture;
  adminAuth: AdminAuthFixture;
}>({
  clientAuth: async ({ request }, use) => {
    const userData = createUser({ roles: ['ROLE_CLIENT'] });
    const signupResponse = await attemptSignup(request, userData);
    expect(signupResponse.status()).toBe(201);
    const loginResponseBody = await loginAndGetResponse(request, userData.username, userData.password);

    await use({
      jwtToken: loginResponseBody.token,
      user: userData
    });
  },
  adminAuth: async ({ request }, use) => {
    const loginResponseBody = await loginAndGetResponse(request, ADMIN_USERNAME, ADMIN_PASSWORD);

    await use({
      jwtToken: loginResponseBody.token,
      loginResponse: loginResponseBody
    });
  }
});

const loginAndGetResponse = async (
  request: APIRequestContext,
  username: string,
  password: string
): Promise<LoginResponseDto> => {
  const loginResponse = await attemptLogin(request, { username, password });
  expect(loginResponse.status()).toBe(200);
  return await loginResponse.json();
};

export { expect };

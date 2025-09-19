import { test as base, APIRequestContext } from '@playwright/test';
import { randomClient, randomAdmin } from '../generators/userGenerator';
import { attemptSignup } from '../http/signupClient';
import { attemptLogin } from '../http/loginClient';
import { UserRegisterDto } from '../types/auth';

export interface ApiAuthFixtures {
  apiAuth: {
    request: APIRequestContext;
    user: UserRegisterDto;
    token: string;
  };
  apiAuthAdmin: {
    request: APIRequestContext;
    user: UserRegisterDto;
    token: string;
  };
}

type UserGenerator = () => UserRegisterDto;

async function setupApiAuth(
  request: APIRequestContext,
  gen: UserGenerator
): Promise<{ request: APIRequestContext; user: UserRegisterDto; token: string }> {
  const user = gen();
  await attemptSignup(request, user);

  const loginResponse = await attemptLogin(request, user);
  if (!loginResponse.ok()) {
    const body = await loginResponse.text();
    throw new Error(`Login failed with status ${loginResponse.status()}: ${body}`);
  }

  const json = await loginResponse.json();
  const token = json?.token as string | undefined;
  if (!token) throw new Error('Login response did not contain a token');

  return { request, user, token };
}

export const test = base.extend<ApiAuthFixtures>({
  apiAuth: async ({ request }, use) => {
    const fixture = await setupApiAuth(request, randomClient);
    await use(fixture);
  },

  apiAuthAdmin: async ({ request }, use) => {
    const fixture = await setupApiAuth(request, randomAdmin);
    await use(fixture);
  }
});

export { expect, Page } from '@playwright/test';

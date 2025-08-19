import { test as base } from '@playwright/test';
import type { LoginDto, LoginResponseDto } from '../types/auth';
import type { UserRegisterDto } from '../types/user';
import { login } from '../http/loginClient';
import { signup } from '../http/registrationClient';
import { generateValidUser } from '../generators/userGenerator';

export interface AuthenticatedUser {
  user: UserRegisterDto;
  token: string;
}

type Role = 'ROLE_ADMIN' | 'ROLE_CLIENT';

async function ensureOk(response: any, context: string) {
  if (!response.ok()) {
    throw new Error(`${context} failed: ${response.status()} ${await response.text()}`);
  }
}

async function registerAndAuthenticate(request: any, role: Role): Promise<AuthenticatedUser> {
  const user: UserRegisterDto = generateValidUser({ roles: [role] });

  const signupResponse = await signup(request, user);
  await ensureOk(signupResponse, `${role} registration`);

  const loginData: LoginDto = { username: user.username, password: user.password };
  const loginResponse = await login(request, loginData);
  await ensureOk(loginResponse, `${role} login`);

  const { token } = (await loginResponse.json()) as LoginResponseDto;

  return { user, token };
}

export const test = base.extend<{
  authenticatedAdmin: AuthenticatedUser;
  authenticatedClient: AuthenticatedUser;
}>({
  authenticatedAdmin: async ({ request }, use) => {
    const auth = await registerAndAuthenticate(request, 'ROLE_ADMIN');
    await use(auth);
  },

  authenticatedClient: async ({ request }, use) => {
    const auth = await registerAndAuthenticate(request, 'ROLE_CLIENT');
    await use(auth);
  }
});

export { expect } from '@playwright/test';

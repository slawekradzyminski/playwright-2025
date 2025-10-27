import { test as base } from '@playwright/test';
import type { UserRegisterDto, LoginDto, LoginResponseDto } from '../types/auth';
import { generateRandomUser } from '../generators/userGenerator';
import { attemptRegistration } from '../http/registerClient';
import { attemptLogin } from '../http/loginClient';

export interface AuthenticatedUser {
  userData: UserRegisterDto;
  token: string;
}

export const test = base.extend<{ authenticatedUser: AuthenticatedUser }>({
  authenticatedUser: async ({ request }, use) => {
    const randomUser = generateRandomUser();
    await attemptRegistration(request, randomUser);
    
    const loginData: LoginDto = {
      username: randomUser.username,
      password: randomUser.password
    };
    
    const loginResponse = await attemptLogin(request, loginData);
    const loginBody: LoginResponseDto = await loginResponse.json();
    
    await use({
      userData: randomUser,
      token: loginBody.token,
    });
  }
});

export { expect } from '@playwright/test';


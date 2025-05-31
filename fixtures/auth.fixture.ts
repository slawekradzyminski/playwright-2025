import { test as base } from '@playwright/test';
import type { LoginDto, LoginResponseDto, RegisterDto } from '../types/auth';
import { postSignIn } from '../http/postSignIn';
import { postSignUp } from '../http/postSignUp';
import { generateRandomUser } from '../generators/userGenerator';

export const test = base.extend<{ authToken: string; userDetails: RegisterDto }>({
  userDetails: async ({ request }, use) => {
    const userData = generateRandomUser();
    
    const registerResponse = await postSignUp(request, userData);
    if (!registerResponse.ok()) {
      throw new Error(`Registration failed with status ${registerResponse.status()}`);
    }

    await use(userData);
  },

  authToken: async ({ request, userDetails }, use) => {
    const loginData: LoginDto = {
      username: userDetails.username,
      password: userDetails.password
    };

    const loginResponse = await postSignIn(request, loginData);
    const loginResponseBody: LoginResponseDto = await loginResponse.json();
    const token = loginResponseBody.token;

    await use(token);
  },
});

export { expect } from '@playwright/test'; 
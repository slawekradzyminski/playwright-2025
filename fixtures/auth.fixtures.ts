import { test as base, expect } from '@playwright/test';
import type { LoginDto, LoginResponseDto, RegisterDto } from '../types/auth';
import { attemptLogin } from '../http/postSignIn';
import { attemptRegister } from '../http/postSignUp';
import { getRandomUser } from '../generators/userGenerator';

type AuthFixtures = {
  authToken: string;
  user: RegisterDto;
};

export const test = base.extend<AuthFixtures>({
  user: async ({ request }, use) => {
    const registerData: RegisterDto = getRandomUser();
    
    // Register the user first
    const registerResponse = await attemptRegister(request, registerData);
    if (registerResponse.status() !== 201) {
      throw new Error(`User registration failed with status ${registerResponse.status()}`);
    }
    
    await use(registerData);
  },

  authToken: async ({ request, user }, use) => {
    const loginData: LoginDto = {
      username: user.username,
      password: user.password
    };
    
    // Login as the registered user
    const loginResponse = await attemptLogin(request, loginData);
    const loginBody: LoginResponseDto = await loginResponse.json();
    
    await use(loginBody.token);
  },
});

export { expect }; 
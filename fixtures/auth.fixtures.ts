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

export const test = base.extend<{
  authenticatedUser: AuthenticatedUser;
}>({
  authenticatedUser: async ({ request }, use) => {
    const newUser: UserRegisterDto = generateValidUser();
    
    const signupResponse = await signup(request, newUser);
    if (!signupResponse.ok()) {
      throw new Error(`User registration failed: ${signupResponse.status()} ${await signupResponse.text()}`);
    }
    
    const loginData: LoginDto = {
      username: newUser.username,
      password: newUser.password
    };
    
    const loginResponse = await login(request, loginData);
    if (!loginResponse.ok()) {
      throw new Error(`User login failed: ${loginResponse.status()} ${await loginResponse.text()}`);
    }
    
    const loginBody: LoginResponseDto = await loginResponse.json();
    
    const authenticatedUser: AuthenticatedUser = {
      user: newUser,
      token: loginBody.token
    };
    
    await use(authenticatedUser);
  }
});

export { expect } from '@playwright/test';

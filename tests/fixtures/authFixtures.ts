import { test as base } from '@playwright/test';
import { generateUserData } from '../../generators/userGenerator';
import { attemptRegistration } from '../../http/registrationClient';
import { attemptLogin } from '../../http/loginClient';
import type { UserRegisterDto, LoginResponseDto } from '../../types/auth';

type AuthFixtures = {
  authenticatedUser: {
    token: string;
    user: UserRegisterDto;
  };
};

export const test = base.extend<AuthFixtures>({
  authenticatedUser: async ({ request }, use) => {
    const userData = generateUserData(['ROLE_CLIENT']);
    
    await attemptRegistration(request, userData);
    
    const loginResponse = await attemptLogin(request, {
      username: userData.username,
      password: userData.password
    });
    
    const loginData: LoginResponseDto = await loginResponse.json();
    
    await use({
      token: loginData.token,
      user: userData
    });
  }
});

export { expect } from '@playwright/test';


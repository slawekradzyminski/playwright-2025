import { test as base, APIRequestContext } from '@playwright/test';
import type { UserRegisterDto, LoginDto, LoginResponseDto } from '../types/auth';
import type { AuthFixture } from '../types/fixtures';
import { generateClientUser, generateAdminUser } from '../generators/userGenerator';
import { attemptSignup } from '../http/users/signupRequest';
import { attemptLogin } from '../http/users/loginRequest';

interface AuthFixtures {
  clientAuth: AuthFixture;
  adminAuth: AuthFixture;
}

const createAuthFixture = async (
  request: APIRequestContext,
  userGenerator: () => UserRegisterDto
): Promise<AuthFixture> => {
  const user: UserRegisterDto = userGenerator();
  
  const signupResponse = await attemptSignup(request, user);
  if (signupResponse.status() !== 201) {
    throw new Error(`Signup failed with status ${signupResponse.status()}`);
  }

  const loginData: LoginDto = {
    username: user.username,
    password: user.password
  };

  const loginResponse = await attemptLogin(request, loginData);
  if (loginResponse.status() !== 200) {
    throw new Error(`Login failed with status ${loginResponse.status()}`);
  }
  const loginBody: LoginResponseDto = await loginResponse.json();

  return {
    token: loginBody.token,
    userData: user
  };
};

export const test = base.extend<AuthFixtures>({
  clientAuth: async ({ request }, use) => {
    const authFixture = await createAuthFixture(request, generateClientUser);
    await use(authFixture);
  },

  adminAuth: async ({ request }, use) => {
    const authFixture = await createAuthFixture(request, generateAdminUser);
    await use(authFixture);
  }
});

export { expect } from '@playwright/test';


import { test as base, APIRequestContext } from '@playwright/test';
import { randomClient } from '../generators/userGenerator';
import { attemptSignup } from '../http/signupClient';
import { attemptLogin } from '../http/loginClient';
import { UserRegisterDto } from '../types/auth';

export interface ApiAuthFixtures {
  apiAuth: {
    request: APIRequestContext;
    user: UserRegisterDto;
    token: string;
  };
}

export const test = base.extend<ApiAuthFixtures>({
  apiAuth: async ({ request }, use) => {
    // Setup: Create user, signup, and login to get token
    const user = randomClient();
    await attemptSignup(request, user);
    const loginResponse = await attemptLogin(request, user);
    const token = (await loginResponse.json()).token;

    // Provide the authenticated context to the test
    await use({
      request,
      user,
      token
    });

    // Teardown can be added here if needed
    // For now, we don't need explicit cleanup as the user is temporary
  }
});

export { expect } from '@playwright/test';

import { test as base, expect } from '@playwright/test';
import { randomUser } from '../generators/userGenerator';
import { expectJsonResponse } from '../helpers/apiAssertions';
import { LoginClient } from '../httpclients/loginClient';
import { SignupClient } from '../httpclients/signupClient';
import type { LoginResponseDto, UserRegisterDto } from '../types/auth';

export interface AuthenticatedUser {
  userData: UserRegisterDto;
  token: string;
  refreshToken: string;
}

interface AuthenticatedUserFixture {
  authenticatedUser: AuthenticatedUser;
}

export const test = base.extend<AuthenticatedUserFixture>({
  authenticatedUser: async ({ request }, use) => {
    // This will run before each test using this fixture
    const signupClient = new SignupClient(request);
    const loginClient = new LoginClient(request);
    const userData = randomUser();

    const signupResponse = await signupClient.signup(userData);
    expect(signupResponse.status()).toBe(201);

    const loginResponse = await loginClient.signin({
      username: userData.username,
      password: userData.password
    });
    const loginResponseBody = await expectJsonResponse<LoginResponseDto>(loginResponse, 200);

    // this is returned to test using this fixture
    await use({
      userData,
      token: loginResponseBody.token,
      refreshToken: loginResponseBody.refreshToken
    });

    // this will run after each test using this fixture
  }
});

export { expect } from '@playwright/test';

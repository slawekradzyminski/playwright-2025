import { test as base, APIRequestContext } from '@playwright/test';
import type { AuthFixture } from '../types/fixtures';
import type { LoginDto, LoginResponseDto, UserRegisterDto } from '../types/auth';
import { generateClientUser } from '../generators/userGenerator';
import { attemptSignup } from '../http/users/signupRequest';
import { attemptLogin } from '../http/users/loginRequest';
import { HomePage } from '../pages/HomePage';

interface UiAuthFixtures {
  clientUiAuth: AuthFixture;
}

const registerAndLoginUser = async (
  request: APIRequestContext,
  userGenerator: () => UserRegisterDto
): Promise<AuthFixture> => {
  const user = userGenerator();
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

export const test = base.extend<UiAuthFixtures>({
  clientUiAuth: async ({ page, request }, use) => {
    const authFixture = await registerAndLoginUser(request, generateClientUser);

    await page.addInitScript(
      ({ tokenKey, tokenValue }) => {
        globalThis.localStorage.setItem(tokenKey, tokenValue);
      },
      { tokenKey: 'token', tokenValue: authFixture.token }
    );

    await page.goto(HomePage.URL);
    await use(authFixture);
  }
});

export { expect } from '@playwright/test';

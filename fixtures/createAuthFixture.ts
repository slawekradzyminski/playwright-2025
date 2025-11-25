import type { APIRequestContext } from '@playwright/test';
import type { UserRegisterDto, LoginDto, LoginResponseDto } from '../types/auth';
import type { AuthFixture } from '../types/fixtures';
import { attemptSignup } from '../http/users/signupRequest';
import { attemptLogin } from '../http/users/loginRequest';

export const createAuthFixture = async (
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

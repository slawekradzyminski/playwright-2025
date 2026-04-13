import { expect, type APIRequestContext } from '@playwright/test';
import { generateUser } from '../../../generators/userGenerator';
import { LoginClient } from '../../../httpclients/loginClient';
import { SignupClient } from '../../../httpclients/signupClient';
import type { LoginResponseDto, SignupDto } from '../../../types/auth';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

export interface AuthenticatedUser {
  token: string;
  refreshToken: string;
  user: SignupDto;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export const registerUser = async (
  request: APIRequestContext,
  user: SignupDto,
  baseUrl = APP_BASE_URL
): Promise<SignupDto> => {
  const signupClient = new SignupClient(request, baseUrl);

  const signupResponse = await signupClient.signup(user);
  expect(signupResponse.status()).toBe(201);

  return user;
};

export const loginUser = async (
  request: APIRequestContext,
  credentials: Pick<SignupDto, 'username' | 'password'>,
  baseUrl = APP_BASE_URL
): Promise<string> => {
  const tokens = await loginUserForTokens(request, credentials, baseUrl);

  return tokens.token;
};

export const loginUserForTokens = async (
  request: APIRequestContext,
  credentials: Pick<SignupDto, 'username' | 'password'>,
  baseUrl = APP_BASE_URL
): Promise<AuthTokens> => {
  const loginClient = new LoginClient(request, baseUrl);

  const loginResponse = await loginClient.login({
    username: credentials.username,
    password: credentials.password
  });
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody: LoginResponseDto = await loginResponse.json();
  expect(loginResponseBody.token).toBeDefined();
  expect(loginResponseBody.refreshToken).toBeDefined();

  return {
    token: loginResponseBody.token,
    refreshToken: loginResponseBody.refreshToken
  };
};

export const registerAndLogin = async (
  request: APIRequestContext,
  baseUrl = APP_BASE_URL
): Promise<AuthenticatedUser> => {
  const user = generateUser();

  await registerUser(request, user, baseUrl);
  const { token, refreshToken } = await loginUserForTokens(
    request,
    {
      username: user.username,
      password: user.password
    },
    baseUrl
  );

  return {
    token,
    refreshToken,
    user
  };
};

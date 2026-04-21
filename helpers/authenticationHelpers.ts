import { type APIRequestContext, expect } from '@playwright/test';
import { randomUser } from '../generators/userGenerator';
import { LoginClient } from '../httpclients/loginClient';
import { SignupClient } from '../httpclients/signupClient';
import type { LoginResponseDto, UserRegisterDto } from '../types/auth';
import { expectJsonResponse } from './apiAssertions';

export interface AuthenticatedUser {
  userData: UserRegisterDto;
  token: string;
  refreshToken: string;
}

export async function createAuthenticatedUser(request: APIRequestContext): Promise<AuthenticatedUser> {
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

  return {
    userData,
    token: loginResponseBody.token,
    refreshToken: loginResponseBody.refreshToken
  };
}

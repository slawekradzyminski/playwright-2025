import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import type { UserRegisterDto, LoginDto, LoginResponseDto } from '../types/auth';
import { generateRandomUserWithRole } from '../generators/userGenerator';
import { attemptRegistration } from '../http/registerClient';
import { attemptLogin } from '../http/loginClient';

export type Role = 'ROLE_ADMIN' | 'ROLE_CLIENT';

export interface AuthenticatedUserData {
  userData: UserRegisterDto;
  token: string;
}

export async function registerAndLoginUser(
  request: APIRequestContext,
  role: Role
): Promise<AuthenticatedUserData> {
  const userData = generateRandomUserWithRole(role);

  const registrationResponse = await attemptRegistration(request, userData);
  expect(registrationResponse.ok(), 'Registration should succeed').toBeTruthy();

  const loginData: LoginDto = {
    username: userData.username,
    password: userData.password,
  };

  const loginResponse = await attemptLogin(request, loginData);
  expect(loginResponse.ok(), 'Login should succeed').toBeTruthy();

  const loginResponseData = (await loginResponse.json()) as LoginResponseDto;
  const { token } = loginResponseData;

  return { userData, token };
}


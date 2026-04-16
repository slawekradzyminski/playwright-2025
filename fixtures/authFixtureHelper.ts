import type { APIRequestContext } from '@playwright/test';
import { generateUser } from '../generators/userGenerator';
import { loginClient } from '../httpclients/loginClient';
import { registerClient } from '../httpclients/registerClient';
import type { LoginResponseDto, RegisterDto } from '../types/auth';

type AuthenticatedUser = {
  user: RegisterDto;
  token: string;
};

type AuthenticatedUserWithSession = AuthenticatedUser & {
  refreshToken: string;
};

type LoginResponseWithRefreshToken = LoginResponseDto & {
  refreshToken: string;
};

export const createAuthenticatedUser = async (request: APIRequestContext): Promise<AuthenticatedUserWithSession> => {
  const user = generateUser();
  await registerClient.postRegister(request, user);

  const loginResponse = await loginClient.postLogin(request, {
    username: user.username,
    password: user.password
  });
  const loginResponseBody: LoginResponseWithRefreshToken = await loginResponse.json();

  return {
    user,
    token: loginResponseBody.token,
    refreshToken: loginResponseBody.refreshToken
  };
};

export type { AuthenticatedUser };

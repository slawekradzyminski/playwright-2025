import { APIRequestContext } from '@playwright/test';
import type { UserRegisterDto } from '../../types/auth';
import { attemptSignup } from '../../http/users/signupRequest';
import { attemptLogin } from '../../http/users/loginRequest';

export interface AuthenticatedUser {
  token: string;
  userData: UserRegisterDto;
}

export const createAndAuthenticateUser = async (
  request: APIRequestContext,
  userGenerator: () => UserRegisterDto
): Promise<AuthenticatedUser> => {
  const userData = userGenerator();
  await attemptSignup(request, userData);

  const loginResponse = await attemptLogin(request, {
    username: userData.username,
    password: userData.password
  });

  const { token } = await loginResponse.json();

  return {
    token,
    userData,
  };
};


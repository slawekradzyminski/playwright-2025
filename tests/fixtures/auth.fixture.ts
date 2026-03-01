import { test as base, expect } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { getValidCredentials } from '../../utils/api/loginUtil';
import { loginRequest } from '../../http/users/loginRequest';
import { signupRequest } from '../../http/users/signupRequest';
import type { LoginDto, LoginResponseDto } from '../../types/auth';
import type { UserRegisterDto } from '../../types/user';
import { seedFakerForTest } from '../../utils/fakerSeed';

export type AuthSession = {
  userDetails: UserRegisterDto;
  jwtToken: string;
  refreshToken: string;
};

type TestFixtures = {
  fakerTestSeed: number;
  clientAuth: AuthSession;
  adminAuth: AuthSession;
};

const loginAndBuildSession = async (
  request: Parameters<typeof loginRequest>[0],
  loginData: LoginDto,
  userDetails: UserRegisterDto,
): Promise<AuthSession> => {
  const loginResponse = await loginRequest(request, loginData);
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody = (await loginResponse.json()) as LoginResponseDto;
  expect(loginResponseBody.token).toBeTruthy();

  return {
    userDetails,
    jwtToken: loginResponseBody.token,
    refreshToken: loginResponseBody.refreshToken,
  };
};

const createClientAuthSession = async (
  request: Parameters<typeof signupRequest>[0],
): Promise<AuthSession> => {
  const userDetails = generateUser();
  const signupResponse = await signupRequest(request, userDetails);
  const signupStatus = signupResponse.status();
  const signupResponseBody = await signupResponse.text();
  expect(
    signupStatus,
    `Expected signup to succeed on first attempt. status=${signupStatus}, body=${signupResponseBody}`,
  ).toBe(201);

  return loginAndBuildSession(
    request,
    {
      username: userDetails.username,
      password: userDetails.password,
    },
    userDetails,
  );
};

const createAdminAuthSession = async (
  request: Parameters<typeof loginRequest>[0],
): Promise<AuthSession> => {
  const adminCredentials = getValidCredentials();
  const loginResponse = await loginRequest(request, adminCredentials);
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody = (await loginResponse.json()) as LoginResponseDto;

  return {
    userDetails: {
      username: loginResponseBody.username,
      email: loginResponseBody.email,
      password: adminCredentials.password,
      firstName: loginResponseBody.firstName,
      lastName: loginResponseBody.lastName,
      roles: loginResponseBody.roles as UserRegisterDto['roles'],
    },
    jwtToken: loginResponseBody.token,
    refreshToken: loginResponseBody.refreshToken,
  };
};

export const test = base.extend<TestFixtures>({
  fakerTestSeed: async ({}, use, testInfo) => {
    const seed = seedFakerForTest(testInfo.parallelIndex, testInfo.testId);
    console.log(`[faker-seed] worker=${testInfo.parallelIndex} test=${testInfo.testId} seed=${seed}`);
    await use(seed);
  },

  clientAuth: async ({ request, fakerTestSeed }, use) => {
    void fakerTestSeed;
    await use(await createClientAuthSession(request));
  },

  adminAuth: async ({ request, fakerTestSeed }, use) => {
    void fakerTestSeed;
    await use(await createAdminAuthSession(request));
  },
});

export { expect };

import { test as base, expect } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { loginRequest } from '../api/http/loginRequest';
import { signupRequest } from '../api/http/signupRequest';
import type { LoginResponseDto, UserRegisterDto } from '../../types/auth';
import { seedFakerForWorker } from '../../utils/fakerSeed';

type AuthenticatedUser = {
  userDetails: UserRegisterDto;
  jwtToken: string;
  refreshToken: string;
};

type WorkerFixtures = {
  fakerWorkerSeed: number;
};

type TestFixtures = {
  authenticatedUser: AuthenticatedUser;
};

const MAX_SIGNUP_ATTEMPTS = 3;

export const test = base.extend<TestFixtures, WorkerFixtures>({
  fakerWorkerSeed: [
    async ({}, use, workerInfo) => {
      const seed = seedFakerForWorker(workerInfo.parallelIndex);
      console.log(`[faker-seed] worker=${workerInfo.parallelIndex} seed=${seed}`);
      await use(seed);
    },
    { scope: 'worker' },
  ],

  authenticatedUser: async ({ request, fakerWorkerSeed }, use) => {
    void fakerWorkerSeed;

    let userDetails: UserRegisterDto | undefined;
    let signupStatus = 0;
    let signupResponseBody = '';

    for (let attempt = 1; attempt <= MAX_SIGNUP_ATTEMPTS; attempt += 1) {
      const candidateUser = generateUser();
      const signupResponse = await signupRequest(request, candidateUser);
      signupStatus = signupResponse.status();
      signupResponseBody = await signupResponse.text();

      if (signupStatus === 201) {
        userDetails = candidateUser;
        break;
      }
    }

    if (!userDetails) {
      throw new Error(
        `Signup failed after ${MAX_SIGNUP_ATTEMPTS} attempts. Last status=${signupStatus}, body=${signupResponseBody}`,
      );
    }

    expect(signupStatus).toBe(201);

    const loginResponse = await loginRequest(request, {
      username: userDetails.username,
      password: userDetails.password,
    });
    expect(loginResponse.status()).toBe(200);

    const loginResponseBody = (await loginResponse.json()) as LoginResponseDto;
    expect(loginResponseBody.token).toBeTruthy();

    await use({
      userDetails,
      jwtToken: loginResponseBody.token,
      refreshToken: loginResponseBody.refreshToken,
    });
  },
});

export { expect };

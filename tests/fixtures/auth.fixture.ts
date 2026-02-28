import { test as base, expect } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { loginRequest } from '../api/http/loginRequest';
import { signupRequest } from '../api/http/signupRequest';
import type { LoginResponseDto, UserRegisterDto } from '../../types/auth';
import { seedFakerForWorker } from '../../utils/fakerSeed';

type AuthenticatedUser = {
  userDetails: UserRegisterDto;
  jwtToken: string;
};

type WorkerFixtures = {
  fakerWorkerSeed: number;
};

type TestFixtures = {
  authenticatedUser: AuthenticatedUser;
};

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

    const userDetails = generateUser();
    const signupResponse = await signupRequest(request, userDetails);
    expect(signupResponse.status()).toBe(201);

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
    });
  },
});

export { expect };

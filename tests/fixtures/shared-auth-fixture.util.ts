import { deleteRequest } from '../../http/users/deleteRequest';
import { seedFakerForTest } from '../../utils/fakerSeed';
import {
  createAdminAuthSession,
  createClientAuthSession,
  type AuthSession,
} from './auth-session.util';

type UseFixture<T> = (value: T) => Promise<void>;

export const useFakerTestSeed = async (
  use: UseFixture<number>,
  parallelIndex: number,
  testId: string,
): Promise<void> => {
  const seed = seedFakerForTest(parallelIndex, testId);
  console.log(`[faker-seed] worker=${parallelIndex} test=${testId} seed=${seed}`);
  await use(seed);
};

export const useAdminAuthSession = async (
  request: Parameters<typeof createAdminAuthSession>[0],
  fakerTestSeed: number,
  use: UseFixture<AuthSession>,
): Promise<void> => {
  void fakerTestSeed;
  await use(await createAdminAuthSession(request));
};

export const useClientAuthSessionWithCleanup = async (
  request: Parameters<typeof createClientAuthSession>[0],
  fakerTestSeed: number,
  adminAuth: AuthSession,
  use: UseFixture<AuthSession>,
): Promise<void> => {
  void fakerTestSeed;
  const clientSession = await createClientAuthSession(request);
  let cleanupErrorMessage: string | undefined;

  try {
    await use(clientSession);
  } finally {
    const response = await deleteRequest(request, adminAuth.jwtToken, clientSession.userDetails.username);
    if (![204, 404].includes(response.status())) {
      const responseBody = await response.text();
      cleanupErrorMessage = `Client user cleanup failed for username=${clientSession.userDetails.username}. status=${response.status()}, body=${responseBody}`;
    }
  }

  if (cleanupErrorMessage) {
    throw new Error(cleanupErrorMessage);
  }
};

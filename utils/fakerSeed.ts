import { faker } from '@faker-js/faker';

const MAX_TEST_SEED = 2_147_483_647;

const parseSeed = (seedValue: string | undefined): number => {
  const parsedSeed = Number(seedValue);
  if (!Number.isInteger(parsedSeed) || parsedSeed < 0 || parsedSeed > MAX_TEST_SEED) {
    throw new Error(
      'Missing or invalid TEST_SEED. Ensure Playwright global setup runs or set TEST_SEED manually.',
    );
  }

  return parsedSeed;
};

export const seedFakerForWorker = (workerIndex: number): number => {
  if (!Number.isInteger(workerIndex) || workerIndex < 0) {
    throw new Error(`Invalid worker index: ${workerIndex}`);
  }

  const baseSeed = parseSeed(process.env.TEST_SEED);
  const workerSeed = (baseSeed + workerIndex) % MAX_TEST_SEED;
  faker.seed(workerSeed);
  return workerSeed;
};

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

const hashString = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % MAX_TEST_SEED;
  }
  return hash;
};

export const seedFakerForTest = (workerIndex: number, testId: string): number => {
  if (!Number.isInteger(workerIndex) || workerIndex < 0) {
    throw new Error(`Invalid worker index: ${workerIndex}`);
  }
  if (!testId) {
    throw new Error('Missing test id for faker seed generation');
  }

  const baseSeed = parseSeed(process.env.TEST_SEED);
  const workerSeed = (baseSeed + workerIndex) % MAX_TEST_SEED;
  const testSeed = (workerSeed + hashString(testId)) % MAX_TEST_SEED;

  faker.seed(testSeed);
  return testSeed;
};

import { faker } from '@faker-js/faker';

const MAX_TEST_SEED = 2_147_483_647;
const DEFAULT_TEST_SEED = 1_337_000_001;

const parseSeed = (seedValue: string): number => {
  const parsedSeed = Number(seedValue);
  if (!Number.isInteger(parsedSeed) || parsedSeed < 0 || parsedSeed > MAX_TEST_SEED) {
    throw new Error(`Invalid TEST_SEED value: ${seedValue}`);
  }

  return parsedSeed;
};

const resolveBaseSeed = (): number => {
  const explicitSeed = process.env.TEST_SEED;
  if (explicitSeed === undefined) {
    return DEFAULT_TEST_SEED;
  }

  return parseSeed(explicitSeed);
};

export const seedFakerForWorker = (workerIndex: number): number => {
  if (!Number.isInteger(workerIndex) || workerIndex < 0) {
    throw new Error(`Invalid worker index: ${workerIndex}`);
  }

  const baseSeed = resolveBaseSeed();
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

  const baseSeed = resolveBaseSeed();
  const workerSeed = (baseSeed + workerIndex) % MAX_TEST_SEED;
  const testSeed = (workerSeed + hashString(testId)) % MAX_TEST_SEED;

  faker.seed(testSeed);
  return testSeed;
};

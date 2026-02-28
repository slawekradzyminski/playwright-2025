import type { FullConfig } from '@playwright/test';

const MAX_TEST_SEED = 2_147_483_647;

const toValidSeed = (seedValue: string | undefined): number | null => {
  if (!seedValue) {
    return null;
  }

  const parsedSeed = Number(seedValue);
  if (!Number.isInteger(parsedSeed) || parsedSeed < 0 || parsedSeed > MAX_TEST_SEED) {
    return null;
  }

  return parsedSeed;
};

export default function globalSetup(config: FullConfig): void {
  void config;
  const existingSeed = toValidSeed(process.env.TEST_SEED);
  const seed = existingSeed ?? Math.floor(Math.random() * MAX_TEST_SEED);

  process.env.TEST_SEED = String(seed);
  console.log(`[test-seed] TEST_SEED=${seed}`);
}

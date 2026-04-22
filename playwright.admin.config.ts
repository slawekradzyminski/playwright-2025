import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: env.APP_BASE_URL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'admin-api',
      testMatch: /api\/admin\/.*\.admin\.api\.spec\.ts/
    },
    {
      name: 'admin-ui',
      testMatch: /ui\/admin\/.*\.admin\.ui\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

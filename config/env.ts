import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

interface TestEnv {
  APP_BASE_URL: string;
  ADMIN_PASSWORD: string;
}

const requiredEnv = (name: keyof TestEnv): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const appBaseUrl = requiredEnv('APP_BASE_URL');

try {
  const parsedUrl = new URL(appBaseUrl);

  if (parsedUrl.port === '4001') {
    throw new Error('APP_BASE_URL must target the public gateway, not the backend container port 4001');
  }
} catch (error) {
  if (error instanceof TypeError) {
    throw new Error(`APP_BASE_URL must be a valid absolute URL. Received: ${appBaseUrl}`);
  }

  throw error;
}

export const env: TestEnv = {
  APP_BASE_URL: appBaseUrl,
  ADMIN_PASSWORD: requiredEnv('ADMIN_PASSWORD')
};

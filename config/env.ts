import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4001';
export const UI_BASE_URL = process.env.UI_BASE_URL ?? 'http://localhost:8081';
export const ADMIN_USERNAME = getRequiredEnv('ADMIN_USERNAME');
export const ADMIN_PASSWORD = getRequiredEnv('ADMIN_PASSWORD');

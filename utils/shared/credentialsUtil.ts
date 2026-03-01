import type { LoginDto } from '../../types/auth';

const VALID_LOGIN_USERNAME_ENV = 'API_LOGIN_USERNAME';
const VALID_LOGIN_PASSWORD_ENV = 'API_LOGIN_PASSWORD';

export const getValidCredentials = (): LoginDto => {
  const username = process.env[VALID_LOGIN_USERNAME_ENV];
  const password = process.env[VALID_LOGIN_PASSWORD_ENV];

  if (!username || !password) {
    throw new Error(
      `Missing login credentials. Set ${VALID_LOGIN_USERNAME_ENV} and ${VALID_LOGIN_PASSWORD_ENV} in your environment or .env file.`,
    );
  }

  return { username, password };
};

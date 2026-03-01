import type { LoginDto } from '../../../types/auth';

const UI_BASE_URL_ENV = 'UI_BASE_URL';

const uiBaseUrl = process.env[UI_BASE_URL_ENV] ?? 'http://localhost:8081';

export const LOGIN_URL = new URL('/login', uiBaseUrl).toString();
export const REGISTER_URL = new URL('/register', uiBaseUrl).toString();
export const HOME_URL = new URL('/', uiBaseUrl).toString();

export const INVALID_LOGIN_CREDENTIALS: LoginDto = {
  username: 'wronguser',
  password: 'wrongpassword',
};

export const SHORT_USERNAME_LOGIN_CREDENTIALS: LoginDto = {
  username: 'abc',
  password: 'admin',
};

export const EMPTY_PASSWORD_LOGIN_CREDENTIALS: LoginDto = {
  username: 'admin',
  password: '',
};

export const LOGIN_MESSAGES = {
  heading: 'Sign in to your account',
  passwordRequired: 'Password is required',
  usernameTooShort: 'Username must be at least 4 characters',
  invalidCredentials: 'Invalid username/password',
  errorToastTitle: 'Error',
} as const;

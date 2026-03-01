import type { LoginDto } from '../../../types/auth';
export { HOME_URL, LOGIN_URL, REGISTER_URL } from './ui.urls.constants';

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

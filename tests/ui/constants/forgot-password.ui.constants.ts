export { FORGOT_PASSWORD_URL, LOGIN_URL } from './ui.urls.constants';

export const FORGOT_PASSWORD_MESSAGES = {
  heading: 'Forgot password',
  identifierRequired: 'Username or email is required',
  successToastTitle: 'Check your email',
  successToastMessage: 'If the account exists, we sent password reset instructions.',
} as const;

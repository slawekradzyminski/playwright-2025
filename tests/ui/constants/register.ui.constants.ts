import { generateUser } from '../../../generators/userGenerator';
import type { UserRegisterDto } from '../../../types/user';
export { LOGIN_URL, REGISTER_URL } from './ui.urls.constants';

export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const mapUserToRegisterFormData = (user: UserRegisterDto): RegisterFormData => {
  return {
    username: user.username,
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

const createRegisterFormData = (overrides: Partial<RegisterFormData> = {}): RegisterFormData => {
  const user = generateUser();

  return {
    ...mapUserToRegisterFormData(user),
    ...overrides,
  };
};

export const createValidRegisterFormData = (): RegisterFormData => createRegisterFormData();

export const createInvalidEmailRegisterData = (): RegisterFormData =>
  createRegisterFormData({ email: 'not-an-email' });

export const createMissingEmailRegisterData = (): RegisterFormData =>
  createRegisterFormData({ email: '' });

export const REGISTER_MESSAGES = {
  heading: 'Create your account',
  registrationSuccess: 'Registration successful! You can now log in.',
  successToastTitle: 'Success',
  emailRequired: 'Email is required',
  invalidEmailFormat: 'Invalid email format',
} as const;

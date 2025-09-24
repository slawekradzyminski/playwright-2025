import { faker } from '@faker-js/faker';
import { UserRegisterDto } from '../types/auth';

/**
 * Helper to generate a value until it meets a minimum length
 */
const generateWithMinLength = (generator: () => string, minLength: number): string => {
  let value: string;
  do {
    value = generator();
  } while (value.length < minLength);
  return value;
};

const generateValidUsername = (): string =>
  generateWithMinLength(() => faker.internet.username().toLowerCase(), 4);

const generateValidFirstName = (): string =>
  generateWithMinLength(() => faker.person.firstName(), 4);

const generateValidLastName = (): string =>
  generateWithMinLength(() => faker.person.lastName(), 4);

const generateValidPassword = (): string =>
  generateWithMinLength(() => faker.internet.password({ length: 12 }), 8);

/**
 * Factory for generating users with different roles
 */
const generateUser = (role: 'ROLE_ADMIN' | 'ROLE_CLIENT'): UserRegisterDto => ({
  username: generateValidUsername(),
  email: faker.internet.email(),
  password: generateValidPassword(),
  firstName: generateValidFirstName(),
  lastName: generateValidLastName(),
  roles: [role],
});

export const generateAdmin = (): UserRegisterDto => generateUser('ROLE_ADMIN');
export const generateClient = (): UserRegisterDto => generateUser('ROLE_CLIENT');

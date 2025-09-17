import { faker } from '@faker-js/faker';
import type { UserRegisterDto } from '../types/auth';

const generateValidString = (generator: () => string, minLength: number, maxLength: number, maxAttempts: number = 100): string => {
  let result: string;
  let attempts = 0;
  do {
    result = generator();
    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error(`Failed to generate a valid string after ${maxAttempts} attempts.`);
    }
  } while (result.length < minLength || result.length > maxLength);
  return result;
};

export const randomClient = (): UserRegisterDto => {
  return {
    username: generateValidString(() => faker.internet.username(), 4, 255),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: generateValidString(() => faker.person.firstName(), 4, 255),
    lastName: generateValidString(() => faker.person.lastName(), 4, 255),
    roles: ['ROLE_CLIENT']
  };
};

export const randomAdmin = (): UserRegisterDto => {
  return {
    username: generateValidString(() => faker.internet.username(), 4, 255),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: generateValidString(() => faker.person.firstName(), 4, 255),
    lastName: generateValidString(() => faker.person.lastName(), 4, 255),
    roles: ['ROLE_ADMIN']
  };
};


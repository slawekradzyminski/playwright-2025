import { faker } from '@faker-js/faker';
import type { UserRegisterDto } from '../types/auth';

const generateWithMinLength = (generator: () => string, minLength: number, maxLength: number): string => {
  const maxAttempts = 50;
  let attempts = 0;
  let value = generator();
  
  while (value.length < minLength && attempts < maxAttempts) {
    value = generator();
    attempts++;
  }
  
  if (value.length < minLength) {
    value = value.padEnd(minLength, 'x');
  }
  
  return value.slice(0, maxLength);
};

export const generateRandomUser = (): UserRegisterDto => {
  return {
    username: generateWithMinLength(() => faker.internet.username().toLowerCase(), 4, 255),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: generateWithMinLength(() => faker.person.firstName(), 4, 255),
    lastName: generateWithMinLength(() => faker.person.lastName(), 4, 255),
    roles: ['ROLE_CLIENT', 'ROLE_ADMIN']
  };
};

export const generateRandomUserWithRole = (role: 'ROLE_ADMIN' | 'ROLE_CLIENT'): UserRegisterDto => {
  return {
    ...generateRandomUser(),
    roles: [role]
  };
};


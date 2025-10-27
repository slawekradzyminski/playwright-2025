import { faker } from '@faker-js/faker';
import type { UserRegisterDto } from './types/auth';

export const generateRandomUser = (): UserRegisterDto => {
  return {
    username: faker.internet.username().toLowerCase().slice(0, 20),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    roles: ['ROLE_CLIENT']
  };
};

export const generateRandomUserWithRole = (role: 'ROLE_ADMIN' | 'ROLE_CLIENT'): UserRegisterDto => {
  return {
    ...generateRandomUser(),
    roles: [role]
  };
};


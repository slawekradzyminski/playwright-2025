import { faker } from '@faker-js/faker';
import { UserRegisterDto } from '../types/auth';

const generateValidName = (generator: () => string, fallbackPrefix: string, minLength: number = 4, maxAttempts: number = 10): string => {
  let name: string;
  let attempts = 0;
  do {
    name = generator();
    attempts++;
  } while (name.length < minLength && attempts < maxAttempts);
  
  return name.length >= minLength ? name : `${fallbackPrefix}${faker.number.int({ min: 1000, max: 9999 })}`;
};

export const generateUserData = (roles: string[] = ['ROLE_CLIENT']): UserRegisterDto => {
  const username = faker.internet.username().toLowerCase();
  
  return {
    username: username.length >= 4 ? username : `user${faker.number.int({ min: 1000, max: 9999 })}`,
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: generateValidName(() => faker.person.firstName(), 'User'),
    lastName: generateValidName(() => faker.person.lastName(), 'Name'),
    roles
  };
};

export const generateInvalidUserData = {
  withShortUsername: (): UserRegisterDto => ({
    ...generateUserData(),
    username: faker.string.alpha(3)
  }),

  withInvalidEmail: (): UserRegisterDto => ({
    ...generateUserData(),
    email: 'invalid-email'
  }),

  withShortPassword: (): UserRegisterDto => ({
    ...generateUserData(),
    password: faker.string.alpha(3)
  }),

  withShortFirstName: (): UserRegisterDto => ({
    ...generateUserData(),
    firstName: faker.string.alpha(3)
  }),

  withShortLastName: (): UserRegisterDto => ({
    ...generateUserData(),
    lastName: faker.string.alpha(3)
  }),

  withEmptyRoles: (): UserRegisterDto => ({
    ...generateUserData(),
    roles: []
  })
};


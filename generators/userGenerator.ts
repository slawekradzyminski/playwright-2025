import { faker } from '@faker-js/faker';
import { Role } from '../types/auth';

const generateWithMinLength = (
  generatorFn: () => string, 
  minLength: number, 
  maxAttempts: number = 100
): string => {
  let attempts = 0;
  let result = generatorFn();
  
  while (result.length < minLength && attempts < maxAttempts) {
    result = generatorFn();
    attempts++;
  }
  
  if (result.length < minLength) {
    result = result.padEnd(minLength, '0');
  }
  
  return result;
};

export const generateRandomUser = () => {
  return {
    username: generateWithMinLength(() => faker.internet.username(), 4),
    email: faker.internet.email(),
    password: generateWithMinLength(() => faker.internet.password(), 8),
    firstName: generateWithMinLength(() => faker.person.firstName(), 4),
    lastName: generateWithMinLength(() => faker.person.lastName(), 4),
    roles: [Role.ROLE_CLIENT, Role.ROLE_ADMIN]
  };
};
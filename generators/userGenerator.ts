import { faker } from '@faker-js/faker';
import { RegisterDto, Role } from '../types/auth';

const generateMinLengthString = (generator: () => string, minLength: number): string => {
    let result = generator();
    let attempts = 0;
    const maxAttempts = 10;
    
    while (result.length < minLength && attempts < maxAttempts) {
      result = generator();
      attempts++;
    }
    
    if (result.length < minLength) {
      result = result.padEnd(minLength, faker.string.alphanumeric());
    }
    
    return result;
  };

export const getRandomUser = (): RegisterDto => {
  return {
    username: generateMinLengthString(() => faker.internet.username(), 4),
    email: faker.internet.email(),
    password: generateMinLengthString(() => faker.internet.password(), 8),
    firstName: generateMinLengthString(() => faker.person.firstName(), 4),
    lastName: generateMinLengthString(() => faker.person.lastName(), 4),
    roles: [Role.CLIENT, Role.ADMIN]
  };
};
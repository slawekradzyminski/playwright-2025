import { faker } from '@faker-js/faker';
import type { UserRegisterDto } from '../types/auth';

const generateWithMinLength = (
  generator: () => string,
  minLength: number,
  sanitize: (value: string) => string = (value) => value
): string => {
  let value = '';
  while (value.length < minLength) {
    value = sanitize(generator());
  }
  return value;
};

export const createUser = (overrides: Partial<UserRegisterDto> = {}): UserRegisterDto => {
  const usernameCore = generateWithMinLength(
    () => faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, ''),
    4
  );
  const firstName = generateWithMinLength(
    () => faker.person.firstName(),
    4,
    (value) => value.replace(/[^a-zA-Z]/g, '')
  );
  const lastName = generateWithMinLength(
    () => faker.person.lastName(),
    4,
    (value) => value.replace(/[^a-zA-Z]/g, '')
  );
  const password = generateWithMinLength(
    () => faker.internet.password({ length: 14, memorable: false }),
    10
  );
  const id = faker.string.alphanumeric(6).toLowerCase();
  const username = `${usernameCore}${id}`.slice(0, 255);

  return {
    username,
    email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
    password,
    firstName,
    lastName,
    roles: ['ROLE_CLIENT'],
    ...overrides
  };
};

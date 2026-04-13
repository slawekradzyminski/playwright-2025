import { faker } from '@faker-js/faker';
import type { SignupDto } from '../types/auth';

const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 255;
const MIN_NAME_LENGTH = 4;
const MAX_NAME_LENGTH = 255;

export const generateUser = (): SignupDto => {
  const firstName = ensureLength(faker.person.firstName(), MIN_NAME_LENGTH, MAX_NAME_LENGTH);
  const lastName = ensureLength(faker.person.lastName(), MIN_NAME_LENGTH, MAX_NAME_LENGTH);
  const suffix = faker.string.alphanumeric({ length: 8, casing: 'lower' });
  const username = ensureLength(
    faker.internet.username({ firstName, lastName }).toLowerCase(),
    MIN_USERNAME_LENGTH,
    MAX_USERNAME_LENGTH - suffix.length - 1
  );

  return {
    username: `${username}_${suffix}`,
    email: faker.internet.exampleEmail({ firstName, lastName }).toLowerCase(),
    password: faker.internet.password({ length: MIN_PASSWORD_LENGTH + 4 }).slice(0, MAX_PASSWORD_LENGTH),
    firstName,
    lastName
  };
}

const ensureLength = (value: string, minLength: number, maxLength: number): string => {
  const trimmedValue = value.trim();
  const paddedValue = trimmedValue.length >= minLength
    ? trimmedValue
    : `${trimmedValue}${faker.string.alpha({ length: minLength - trimmedValue.length })}`;

  return paddedValue.slice(0, maxLength);
}

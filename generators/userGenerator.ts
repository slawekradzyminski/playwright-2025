import { faker } from '@faker-js/faker';
import type { UserEditDto, UserRegisterDto } from '../types/auth';

const MIN_FIELD_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 8;
const MAX_ATTEMPTS = 10;

const drawWithMinLength = (supplier: () => string, minLength: number): string => {
  let value = '';

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    value = supplier();
    if (value.length >= minLength) {
      return value;
    }
  }

  return value.padEnd(minLength, 'x');
};

const buildUser = (
  role: 'ROLE_CLIENT' | 'ROLE_ADMIN',
  overrides?: Partial<UserRegisterDto>
): UserRegisterDto => {
  const firstName = drawWithMinLength(() => faker.person.firstName(), MIN_FIELD_LENGTH);
  const lastName = drawWithMinLength(() => faker.person.lastName(), MIN_FIELD_LENGTH);
  const username = drawWithMinLength(() => faker.internet.username({ firstName, lastName }).toLowerCase(), MIN_FIELD_LENGTH);
  const email = drawWithMinLength(() => faker.internet.email({ firstName, lastName }), MIN_FIELD_LENGTH);
  const password = drawWithMinLength(() => faker.internet.password({ length: MIN_PASSWORD_LENGTH }),MIN_PASSWORD_LENGTH);

  return {
    username,
    email,
    password,
    firstName,
    lastName,
    roles: [role],
    ...overrides,
  };
};

export const generateValidEditUserBody = (): UserEditDto => {
  return {
    email: drawWithMinLength(() => faker.internet.email(), MIN_FIELD_LENGTH),
    firstName: drawWithMinLength(() => faker.person.firstName(), MIN_FIELD_LENGTH),
    lastName: drawWithMinLength(() => faker.person.lastName(), MIN_FIELD_LENGTH)
  };
}

export const generateClientUser = (
  overrides?: Partial<UserRegisterDto>
): UserRegisterDto => {
  return buildUser('ROLE_CLIENT', overrides);
};

export const generateAdminUser = (
  overrides?: Partial<UserRegisterDto>
): UserRegisterDto => {
  return buildUser('ROLE_ADMIN', overrides);
};

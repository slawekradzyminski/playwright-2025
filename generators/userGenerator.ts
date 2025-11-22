import { faker } from '@faker-js/faker';
import type { UserRegisterDto } from '../types/auth';

const MAX_ATTEMPTS = 20;

const drawUntil = <T>(
  generate: () => T,
  isValid: (value: T) => boolean,
  maxAttempts: number = MAX_ATTEMPTS
): T => {
  let lastValue: T | undefined;

  for (let i = 0; i < maxAttempts; i++) {
    const value = generate();
    lastValue = value;
    if (isValid(value)) {
      return value;
    }
  }

  return lastValue as T;
};

const isValidPersonName = (name: string): boolean => {
  return /^[A-Za-z]{2,}$/.test(name);
};

const normalisePersonName = (name: string): string => {
  return name.padEnd(4, 'x');
};

const isValidUsername = (username: string): boolean => {
  return /^[A-Za-z0-9_]{4,10}$/.test(username);
};

const normaliseUsername = (username: string): string => {
  const cleaned = username.replace(/[^A-Za-z0-9_]/g, '').substring(0, 10);
  return cleaned.padEnd(4, 'z');
};

const generateValidFirstName = (): string =>
  normalisePersonName(
    drawUntil(
      () => faker.person.firstName(),
      isValidPersonName
    )
  );

const generateValidLastName = (): string =>
  normalisePersonName(
    drawUntil(
      () => faker.person.lastName(),
      isValidPersonName
    )
  );

const generateValidUsername = (): string =>
  normaliseUsername(
    drawUntil(
      () => faker.internet.username(),
      (value) => isValidUsername(normaliseUsername(value))
    )
  );

const generateBaseUser = (passwordLength: number, roles: string[]): UserRegisterDto => {
  const firstName = generateValidFirstName();
  const lastName = generateValidLastName();
  const username = generateValidUsername();

  return {
    username,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password({ length: passwordLength }),
    firstName,
    lastName,
    roles,
  };
};

export const generateRandomClientUser = (): UserRegisterDto => generateBaseUser(8, ['ROLE_CLIENT']);
export const generateRandomAdminUser = (): UserRegisterDto => generateBaseUser(12, ['ROLE_ADMIN']);

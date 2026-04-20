import { faker } from '@faker-js/faker';
import type { UserRegisterDto } from '../types/auth';

const MAX_ATTEMPTS = 100;

const LIMITS = {
  username: { min: 4, max: 255 },
  firstName: { min: 4, max: 255 },
  lastName: { min: 4, max: 255 },
  password: { min: 8, max: 255 },
  email: { max: 255 }
} as const;

const hasValidLength = (value: string, min: number, max: number): boolean =>
  value.length >= min && value.length <= max;

const retryUntil = <T>(generator: () => T, predicate: (value: T) => boolean, label: string): T => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const value = generator();

    if (predicate(value)) {
      return value;
    }
  }

  throw new Error(`Unable to generate valid ${label} after ${MAX_ATTEMPTS} attempts`);
};

const generateName = (generator: () => string, label: 'firstName' | 'lastName'): string =>
  retryUntil(
    generator,
    value => hasValidLength(value, LIMITS[label].min, LIMITS[label].max),
    label
  );

const generateUsername = (): string =>
  `${faker.string.alpha({ length: 8, casing: 'lower' })}${faker.string.numeric(6)}`;

const generatePassword = (): string =>
  faker.internet.password({ length: 16 });

const generateEmail = (firstName: string, lastName: string): string =>
  retryUntil(
    () =>
      faker.internet
        .email({
          firstName,
          lastName,
          provider: 'example.com'
        })
        .toLowerCase(),
    value => value.length > 0 && value.length <= LIMITS.email.max,
    'email'
  );

export const randomUser = (): UserRegisterDto => {
  const firstName = generateName(() => faker.person.firstName(), 'firstName');
  const lastName = generateName(() => faker.person.lastName(), 'lastName');

  return {
    username: generateUsername(),
    email: generateEmail(firstName, lastName),
    password: generatePassword(),
    firstName,
    lastName
  };
};
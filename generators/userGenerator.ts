import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import type { UserRegisterDto, UserRole } from '../types/user';

const ensureMinLength = (value: string, minLength: number): string => {
  if (value.length >= minLength) {
    return value;
  }

  return `${value}${'x'.repeat(minLength - value.length)}`;
};

const uniqueSuffix = (): string => randomUUID().replace(/-/g, '').slice(0, 12);

export const generateUser = (
  overrides: Partial<UserRegisterDto> = {},
  role: UserRole = 'ROLE_CLIENT',
): UserRegisterDto => {
  const firstName = ensureMinLength(faker.person.firstName().replace(/[^a-zA-Z]/g, ''), 4);
  const lastName = ensureMinLength(faker.person.lastName().replace(/[^a-zA-Z]/g, ''), 4);
  const username = ensureMinLength(
    faker.internet
      .username({ firstName, lastName })
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''),
    4,
  );
  const suffix = uniqueSuffix();
  const emailLocalPart = `${firstName}.${lastName}.${suffix}`
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '');

  return {
    username: `${username}${suffix}`.slice(0, 32),
    email: `${emailLocalPart}@example.com`,
    password: faker.internet.password({ length: 12, memorable: false, prefix: 'A1!' }),
    firstName,
    lastName,
    roles: [role],
    ...overrides,
  };
};

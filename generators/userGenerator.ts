import { faker } from '@faker-js/faker';
import type { UserRegisterDto } from '../types/auth';

export function generateUser(
  overrides: Partial<UserRegisterDto> = {}
): UserRegisterDto {
  return {
    username: draw(() => faker.internet.username().slice(0, 20), 4),
    email: faker.internet.email(),
    password: draw(() => faker.internet.password({ length: 12 }), 8),
    firstName: draw(() => faker.person.firstName(), 4),
    lastName: draw(() => faker.person.lastName(), 4),
    roles: ['ROLE_CLIENT'],
    ...overrides,
  };
}

function draw(
  generator: () => string,
  minLength: number,
  maxAttempts = 10
): string {
  for (let i = 0; i < maxAttempts; i++) {
    const value = generator();
    if (value.length >= minLength) {
      return value;
    }
  }

  throw new Error(`Failed to generate string with min length ${minLength}`);
}

import { faker } from '@faker-js/faker';
import type { UserRegisterDto, UserRole } from '../types/user';

/** Ensure a string has at least `len` chars by appending random digits if needed. */
const ensureMinLen = (s: string, len: number) =>
  s.length >= len ? s : s + faker.string.numeric(len - s.length);

const DEFAULT_ROLES: readonly UserRole[] = ['ROLE_CLIENT', 'ROLE_ADMIN'] as const;

type Variant = 'random' | 'valid';

export function buildUser(
  overrides: Partial<UserRegisterDto> = {},
  variant: Variant = 'random',
): UserRegisterDto {
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();

  if (variant === 'valid') {
    // Enforce min lengths your API expects (4 as per your original)
    firstName = ensureMinLen(firstName, 4);
    lastName = ensureMinLen(lastName, 4);
  }

  const baseUsername = faker.internet.username({ firstName, lastName });
  const username =
    variant === 'valid'
      ? ensureMinLen(baseUsername, 4)
      : (baseUsername.length >= 4
          ? baseUsername
          : `${baseUsername}${faker.number.int({ min: 1000, max: 9999 })}`);

  const password =
    variant === 'valid'
      ? faker.internet.password({ length: 8, memorable: true })
      : faker.internet.password({ length: 12 });

  return {
    username,
    email: faker.internet.email({ firstName, lastName }),
    password,
    firstName,
    lastName,
    roles: [...DEFAULT_ROLES], // copy to avoid accidental mutation
    ...overrides,
  };
}

/** Convenience wrappers if you prefer named helpers */
export const generateUser = (overrides?: Partial<UserRegisterDto>) =>
  buildUser(overrides, 'random');

export const generateValidUser = (overrides?: Partial<UserRegisterDto>) =>
  buildUser(overrides, 'valid');

export const generateClientUser = (overrides?: Partial<UserRegisterDto>) =>
  buildUser({ ...overrides, roles: ['ROLE_CLIENT'] }, 'valid');

/** Intentionally violates a single field. `value` is `unknown` on purpose for tests. */
export const generateInvalidUser = <K extends keyof UserRegisterDto>(
  field: K,
  value: unknown,
  baseOverrides?: Partial<UserRegisterDto>,
): UserRegisterDto => ({
  ...buildUser(baseOverrides, 'valid'),
  [field]: value as any, // explicit cast: we *want* to break the type for negative tests
});

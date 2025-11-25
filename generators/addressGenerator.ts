import { faker } from '@faker-js/faker';
import type { AddressDto } from '../types/orders';

export const generateAddress = (overrides?: Partial<AddressDto>): AddressDto => {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
    ...overrides
  };
};

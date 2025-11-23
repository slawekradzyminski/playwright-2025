import { faker } from '@faker-js/faker';
import type { AddressDto } from '../types/order';

const generateZipCode = (): string => {
  const firstPart = faker.number.int({ min: 10, max: 99 }).toString();
  const secondPart = faker.number.int({ min: 100, max: 999 }).toString().padStart(3, '0');
  return `${firstPart}-${secondPart}`;
};

export const generateRandomAddress = (): AddressDto => {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: generateZipCode(),
    country: faker.location.country(),
  };
};

import { faker } from '@faker-js/faker';
import type { ProductCreateDto } from '../types/products';

const MIN_NAME_LENGTH = 3;

export const generateProduct = (overrides?: Partial<ProductCreateDto>): ProductCreateDto => {
  const name = faker.commerce.productName();
  
  return {
    name: name.length >= MIN_NAME_LENGTH ? name : name.padEnd(MIN_NAME_LENGTH, 'x'),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 0.01, max: 9999 })),
    stockQuantity: faker.number.int({ min: 0, max: 1000 }),
    category: faker.commerce.department(),
    imageUrl: faker.image.url(),
    ...overrides,
  };
};


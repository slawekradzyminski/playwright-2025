import { faker } from '@faker-js/faker';
import type { ProductCreateDto } from '../types/product';

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Health & Beauty',
  'Toys & Games',
  'Automotive',
  'Grocery',
  'Tools & Hardware'
];

const generateValidString = (generator: () => string, minLength: number, maxLength: number, maxAttempts: number = 100): string => {
  let result: string;
  let attempts = 0;
  do {
    result = generator();
    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error(`Failed to generate a valid string after ${maxAttempts} attempts.`);
    }
  } while (result.length < minLength || result.length > maxLength);
  return result;
};

export const randomProduct = (): ProductCreateDto => {
  return {
    name: generateValidString(() => faker.commerce.productName(), 3, 100),
    description: faker.commerce.productDescription().substring(0, 1000),
    price: parseFloat(faker.commerce.price({ min: 0.01, max: 9999.99, dec: 2 })),
    stockQuantity: faker.number.int({ min: 0, max: 1000 }),
    category: faker.helpers.arrayElement(categories),
    imageUrl: faker.image.url()
  };
};

export const randomProductMinimal = (): ProductCreateDto => {
  return {
    name: generateValidString(() => faker.commerce.productName(), 3, 100),
    price: parseFloat(faker.commerce.price({ min: 0.01, max: 9999.99, dec: 2 })),
    stockQuantity: faker.number.int({ min: 0, max: 1000 }),
    category: faker.helpers.arrayElement(categories)
  };
};

export const invalidProduct = (): Partial<ProductCreateDto> => {
  return {
    name: '',
    price: parseFloat(faker.commerce.price({ min: 0.01, max: 9999.99, dec: 2 })),
    stockQuantity: faker.number.int({ min: 0, max: 1000 }),
    category: faker.helpers.arrayElement(categories)
  };
};

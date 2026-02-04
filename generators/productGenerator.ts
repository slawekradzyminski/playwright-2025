import { faker } from '@faker-js/faker';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';

const generateProductName = (): string => {
  let name = '';
  while (name.length < 3 || name.length > 100) {
    name = faker.commerce.productName();
  }
  return name;
};

const generateCategory = (): string => {
  let category = '';
  while (category.length < 1) {
    category = faker.commerce.department();
  }
  return category;
};

export const createProductData = (overrides: Partial<ProductCreateDto> = {}): ProductCreateDto => {
  return {
    name: generateProductName(),
    description: faker.commerce.productDescription().slice(0, 1000),
    price: Number(faker.commerce.price({ min: 5, max: 1000 })),
    stockQuantity: faker.number.int({ min: 1, max: 200 }),
    category: generateCategory(),
    ...overrides
  };
};

export const createProductUpdateData = (
  overrides: Partial<ProductUpdateDto> = {}
): ProductUpdateDto => {
  return {
    name: generateProductName(),
    description: faker.commerce.productDescription().slice(0, 1000),
    price: Number(faker.commerce.price({ min: 5, max: 1000 })),
    stockQuantity: faker.number.int({ min: 1, max: 200 }),
    category: generateCategory(),
    ...overrides
  };
};

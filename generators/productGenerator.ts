import { faker } from '@faker-js/faker';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';

const categories = ['Electronics', 'Home', 'Books', 'Sports', 'Fashion', 'Toys'];

const generateValidPrice = (): number => {
  return Number(faker.number.float({ min: 0.01, max: 9999, fractionDigits: 2 }).toFixed(2));
};

const generateValidStock = (): number => faker.number.int({ min: 0, max: 1000 });

const generateValidName = (): string => {
  let name = faker.commerce.productName();
  while (name.length < 3 || name.length > 100) {
    name = faker.commerce.productName();
  }
  return name;
};

export const generateProductCreateData = (): ProductCreateDto => {
  return {
    name: generateValidName(),
    description: faker.commerce.productDescription().slice(0, 1000),
    price: generateValidPrice(),
    stockQuantity: generateValidStock(),
    category: faker.helpers.arrayElement(categories),
    imageUrl: faker.image.url(),
  };
};

export const generateProductUpdateData = (): ProductUpdateDto => {
  return {
    name: generateValidName(),
    description: faker.commerce.productDescription().slice(0, 1000),
    price: generateValidPrice(),
    stockQuantity: generateValidStock(),
    category: faker.helpers.arrayElement(categories),
    imageUrl: faker.image.url(),
  };
};

export const generateInvalidProductData = {
  withShortName: (): ProductCreateDto => ({
    ...generateProductCreateData(),
    name: faker.string.alpha({ length: 2 }),
  }),
  withNegativePrice: (): ProductCreateDto => ({
    ...generateProductCreateData(),
    price: -1,
  }),
  withNegativeStock: (): ProductCreateDto => ({
    ...generateProductCreateData(),
    stockQuantity: -5,
  }),
  withoutRequiredFields: (): Partial<ProductCreateDto> => ({
    description: faker.commerce.productDescription(),
    imageUrl: faker.image.url(),
  }),
};

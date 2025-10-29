import { faker } from '@faker-js/faker';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';

export const generateProduct = (): ProductCreateDto => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 0.01, max: 9999.99 })),
    stockQuantity: faker.number.int({ min: 0, max: 1000 }),
    category: faker.commerce.department(),
    imageUrl: faker.image.url()
  };
};

export const generateProductWithName = (name: string): ProductCreateDto => {
  return {
    ...generateProduct(),
    name: name
  };
};

export const generateProductWithInvalidName = (): ProductCreateDto => {
  return {
    ...generateProduct(),
    name: 'ab'
  };
};

export const generateProductWithInvalidPrice = (): ProductCreateDto => {
  return {
    ...generateProduct(),
    price: -10
  };
};

export const generateProductUpdate = (): ProductUpdateDto => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 0.01, max: 9999.99 })),
    stockQuantity: faker.number.int({ min: 0, max: 1000 }),
    category: faker.commerce.department(),
    imageUrl: faker.image.url()
  };
};

export const generateProductUpdateWithInvalidPrice = (): ProductUpdateDto => {
  return {
    price: -50
  };
};

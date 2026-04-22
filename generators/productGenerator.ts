import { faker } from '@faker-js/faker';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';

const ADMIN_PRODUCT_PREFIX = 'admin-test-product';
const MAX_NAME_LENGTH = 100;

const randomPrice = (): number => faker.number.float({ min: 1, max: 9999, fractionDigits: 2 });

const randomStockQuantity = (): number => faker.number.int({ min: 1, max: 1000 });

const randomProductName = (): string => {
  const uniquePart = `${faker.string.uuid()}-${Date.now()}`;

  return `${ADMIN_PRODUCT_PREFIX}-${uniquePart}`.slice(0, MAX_NAME_LENGTH);
};

export const randomAdminProduct = (): ProductCreateDto => ({
  name: randomProductName(),
  description: faker.commerce.productDescription(),
  price: randomPrice(),
  stockQuantity: randomStockQuantity(),
  category: faker.commerce.department(),
  imageUrl: ''
});

export const randomAdminProductUpdate = (): ProductUpdateDto => ({
  name: randomProductName(),
  description: faker.commerce.productDescription(),
  price: randomPrice(),
  stockQuantity: randomStockQuantity(),
  category: faker.commerce.department(),
  imageUrl: ''
});

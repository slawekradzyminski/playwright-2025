import { faker } from '@faker-js/faker';
import type { ProductCreateDto } from '../types/product';

const MAX_ATTEMPTS = 20;

const drawUntil = <T>(
  generate: () => T,
  isValid: (value: T) => boolean,
  maxAttempts: number = MAX_ATTEMPTS
): T => {
  let lastValue: T | undefined;

  for (let i = 0; i < maxAttempts; i++) {
    const value = generate();
    lastValue = value;
    if (isValid(value)) {
      return value;
    }
  }

  return lastValue as T;
};

const isValidProductName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100;
};

const normalizeProductName = (name: string): string => {
  if (name.length < 3) {
    return name.padEnd(3, 'x');
  }
  return name.substring(0, 100);
};

const generateValidProductName = (): string =>
  normalizeProductName(
    drawUntil(
      () => faker.commerce.productName(),
      isValidProductName
    )
  );

const generateProductDescription = (): string => {
  const description = faker.commerce.productDescription();
  return description.substring(0, 1000);
};

const generatePrice = (): number => {
  return parseFloat(faker.commerce.price({ min: 0.01, max: 9999.99 }));
};

const generateStockQuantity = (): number => {
  return faker.number.int({ min: 0, max: 1000 });
};

const generateCategory = (): string => {
  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Beauty',
    'Automotive',
    'Food & Beverages',
    'Office Supplies'
  ];
  return faker.helpers.arrayElement(categories);
};

const generateImageUrl = (): string => {
  return faker.image.url();
};

export const generateRandomProduct = (): ProductCreateDto => {
  return {
    name: generateValidProductName(),
    description: generateProductDescription(),
    price: generatePrice(),
    stockQuantity: generateStockQuantity(),
    category: generateCategory(),
    imageUrl: generateImageUrl(),
  };
};

export const generateRandomProductWithoutOptionalFields = (): ProductCreateDto => {
  return {
    name: generateValidProductName(),
    price: generatePrice(),
    stockQuantity: generateStockQuantity(),
    category: generateCategory(),
  };
};


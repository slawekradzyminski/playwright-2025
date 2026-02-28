import { faker } from '@faker-js/faker';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';

const ensureMinLength = (value: string, minLength: number): string => {
  if (value.length >= minLength) {
    return value;
  }

  return `${value}${'x'.repeat(minLength - value.length)}`;
};

const sanitizeWord = (value: string): string => value.replace(/[^a-zA-Z0-9 ]/g, '').trim();

const generatedBaseProduct = (): ProductCreateDto => {
  const adjective = ensureMinLength(sanitizeWord(faker.commerce.productAdjective()), 3);
  const noun = ensureMinLength(sanitizeWord(faker.commerce.product()), 3);
  const material = ensureMinLength(sanitizeWord(faker.commerce.productMaterial()), 3);

  return {
    name: `${adjective} ${noun} ${faker.string.alphanumeric({ length: 8, casing: 'lower' })}`.slice(
      0,
      100,
    ),
    description: `${material} ${faker.commerce.productDescription()}`.slice(0, 1000),
    price: Number(faker.commerce.price({ min: 1, max: 999, dec: 2 })),
    stockQuantity: faker.number.int({ min: 0, max: 500 }),
    category: ensureMinLength(sanitizeWord(faker.commerce.department()), 1),
    imageUrl: faker.image.url(),
  };
};

export const generateProduct = (overrides: Partial<ProductCreateDto> = {}): ProductCreateDto => ({
  ...generatedBaseProduct(),
  ...overrides,
});

export const generateProductUpdate = (
  overrides: Partial<ProductUpdateDto> = {},
): ProductUpdateDto => ({
  ...generatedBaseProduct(),
  ...overrides,
});

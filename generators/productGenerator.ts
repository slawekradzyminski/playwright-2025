import { faker } from '@faker-js/faker';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';

type Variant = 'random' | 'valid';

export function buildProduct(
  overrides: Partial<ProductCreateDto> = {},
  variant: Variant = 'random',
): ProductCreateDto {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food & Beverage'];
  
  let name = faker.commerce.productName();
  if (variant === 'valid') {
    name = name.length >= 3 ? name : name + faker.commerce.productMaterial();
  }

  const price = faker.number.float({ min: 0.01, max: 9999.99, fractionDigits: 2 });
  const stockQuantity = faker.number.int({ min: 0, max: 1000 });
  const category = faker.helpers.arrayElement(categories);
  const description = faker.commerce.productDescription();
  const imageUrl = faker.image.url({ width: 400, height: 400 });

  return {
    name,
    description,
    price,
    stockQuantity,
    category,
    imageUrl,
    ...overrides,
  };
}

export const generateProduct = (overrides?: Partial<ProductCreateDto>) =>
  buildProduct(overrides, 'random');

export const generateValidProduct = (overrides?: Partial<ProductCreateDto>) =>
  buildProduct(overrides, 'valid');

export const generateInvalidProduct = <K extends keyof ProductCreateDto>(
  field: K,
  value: unknown,
  baseOverrides?: Partial<ProductCreateDto>,
): ProductCreateDto => ({
  ...buildProduct(baseOverrides, 'valid'),
  [field]: value as any,
});

export function buildProductUpdate(
  overrides: Partial<ProductUpdateDto> = {},
): ProductUpdateDto {
  const updates: ProductUpdateDto = {};
  
  if (Math.random() > 0.5) updates.name = faker.commerce.productName();
  if (Math.random() > 0.5) updates.description = faker.commerce.productDescription();
  if (Math.random() > 0.5) updates.price = faker.number.float({ min: 0.01, max: 9999.99, fractionDigits: 2 });
  if (Math.random() > 0.5) updates.stockQuantity = faker.number.int({ min: 0, max: 1000 });
  if (Math.random() > 0.5) updates.category = faker.helpers.arrayElement(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food & Beverage']);
  if (Math.random() > 0.5) updates.imageUrl = faker.image.url({ width: 400, height: 400 });

  return {
    ...updates,
    ...overrides,
  };
}

export const generateProductUpdate = (overrides?: Partial<ProductUpdateDto>) =>
  buildProductUpdate(overrides);

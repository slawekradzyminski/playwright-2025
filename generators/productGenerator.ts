import { faker } from '@faker-js/faker';
import type { ProductCreateDto } from '../types/product';

const MAX_PRODUCT_NAME_LENGTH = 100;

export const generateProduct = (): ProductCreateDto => {
  const suffix = faker.string.alphanumeric({ length: 8, casing: 'lower' });
  const name = `${faker.commerce.productName()} ${suffix}`.slice(0, MAX_PRODUCT_NAME_LENGTH);

  return {
    name,
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 1, max: 1000 })),
    stockQuantity: faker.number.int({ min: 1, max: 100 }),
    category: faker.commerce.department(),
    imageUrl: faker.image.url()
  };
};

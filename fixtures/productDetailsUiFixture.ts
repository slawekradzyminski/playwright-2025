import { test as uiAuthTest, expect } from './uiAuthFixture';
import type { ProductCreateDto } from '../types/products';
import type { CartDto } from '../types/cart';
import { createTestProduct, assertCartState, type TestProduct } from '../tests/helpers';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

interface ProductDetailsUiFixtures {
  productDetailsPage: ProductDetailsPage;
  testProduct: TestProduct;
  createProduct: (overrides?: Partial<ProductCreateDto>) => Promise<TestProduct>;
  verifyCart: (expectedTotalItems: number) => Promise<CartDto>;
}

export const test = uiAuthTest.extend<ProductDetailsUiFixtures>({
  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page);
    await use(productDetailsPage);
  },

  testProduct: async ({ request, adminUiAuth }, use) => {
    const product = await createTestProduct(request, adminUiAuth.token);
    await use(product);
  },

  createProduct: async ({ request, adminUiAuth }, use) => {
    const createdProducts: TestProduct[] = [];

    const factory = async (overrides?: Partial<ProductCreateDto>): Promise<TestProduct> => {
      const product = await createTestProduct(request, adminUiAuth.token, overrides);
      createdProducts.push(product);
      return product;
    };

    await use(factory);
  },

  verifyCart: async ({ request, adminUiAuth }, use) => {
    const verify = async (expectedTotalItems: number): Promise<CartDto> => {
      return assertCartState(request, adminUiAuth.token, expectedTotalItems);
    };
    await use(verify);
  }
});

export { expect };

